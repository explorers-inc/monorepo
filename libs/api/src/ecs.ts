import {
  CallbackFromEntity,
  Entity,
  EntityMachineMap,
  // EntityMessageMap,
  EntityServiceKeys,
  EventFromEntity,
  InitialEntityProps,
  SnowflakeId,
} from '@explorers-club/schema';
import { compare } from 'fast-json-patch';
import { enablePatches, produce, setAutoFreeze } from 'immer';
import { AnyActorRef, InterpreterFrom, interpret } from 'xstate';
import { world } from './server/state';
import { EPOCH, TICK_RATE } from './ecs.constants';
import { machineMap } from './machines';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FromObservable, ObservableProps } from '@explorers-club/utils';

enablePatches();
setAutoFreeze(false);

export function getCurrentTick(): number {
  const now = new Date();
  const timeSinceEpoch = now.getTime() - EPOCH;
  const tick = Math.floor(timeSinceEpoch / (1000 / TICK_RATE));
  const tickDecimal = (timeSinceEpoch / (1000 / TICK_RATE)) % 1;
  return parseFloat(`${tick}.${tickDecimal.toFixed(1).slice(2)}`);
}

const WORKER_ID_BITS = 10;
const SEQUENCE_BITS = 12;

const workerId = Math.floor(Math.random() * 2 ** WORKER_ID_BITS);
let sequence = 0;
let lastTimestamp = -1;

export function generateSnowflakeId(): string {
  let timestamp = Date.now() - EPOCH;
  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) % 2 ** SEQUENCE_BITS;
    if (sequence === 0) {
      // Sequence overflow, wait for next millisecond
      timestamp++;
      while (Date.now() - EPOCH <= timestamp) {
        // Wait
      }
    }
  } else {
    sequence = 0;
  }
  lastTimestamp = timestamp;
  const id =
    (timestamp << (WORKER_ID_BITS + SEQUENCE_BITS)) |
    (workerId << SEQUENCE_BITS) |
    sequence;
  return id.toString();
}

/**
 * Isomorphic function for creating an entity.
 * We need to dynamically register the machines on the client.
 * @param entityProps
 * @returns
 */
export const createEntity = <TEntity extends Entity>(
  entityProps: InitialEntityProps<TEntity>
) => {
  type PropNames = keyof TEntity;
  type ServiceId = EntityServiceKeys<TEntity>;
  type TCallback = Parameters<TEntity['subscribe']>[0];
  type TEvent = Parameters<TCallback>[0];
  // type TMessage = EntityMessageMap[typeof entityProps.schema]['message'];
  type TMachine = EntityMachineMap[typeof entityProps.schema]['machine'];
  type TInterpreter = InterpreterFrom<TMachine>;
  type TStateValue = TEntity['states'];
  type TCommand = Parameters<TEntity['send']>[0];
  const id = generateSnowflakeId();

  const subscriptions = new Set<TCallback>();

  const subscribe = (callback: TCallback) => {
    subscriptions.add(callback);
    return () => {
      subscriptions.delete(callback);
    };
  };

  const next = (event: TEvent) => {
    for (const callback of subscriptions) {
      callback(event as any); // todo fix TS not liking nested union types on event
    }
  };

  const handler: ProxyHandler<TEntity> = {
    set: (target, property, value) => {
      const nextTarget = produce(target, (draft) => {
        type Prop = keyof typeof draft;
        draft[property as Prop] = value;
      });

      const patches = compare(target, nextTarget);
      target[property as PropNames] = value;

      if (patches.length) {
        next({
          type: 'CHANGE',
          patches,
        });
      }

      return true; // Indicate that the assignment was successful
    },
    ownKeys(target) {
      // 'channel' prop doesn't serialize, it's a ReplaySubject
      // it is implemenented differently on client.
      return Object.keys(target).filter((key) => key !== 'channel');
    },
  };

  /**
   * The send method collects events to be processed on central queues
   * @param command
   */
  const send = (command: TCommand) => {
    next({
      type: 'SEND_TRIGGER',
      command,
    } as TEvent);
    // proxy.command = command;
    service.send(command);

    next({
      type: 'SEND_COMPLETE',
      command,
    } as TEvent);
  };

  // const broadcast = (message: TMessage) => {
  //   next({
  //     type: 'MESSAGE',
  //     message,
  //   } as TEvent);
  // }

  const entityBase = {
    id,
    send,
    subscribe,
  };

  const channel = new ReplaySubject(5 /* msg buffer size */); // not always used but passed in anyways

  const entity: TEntity = {
    ...entityBase,
    ...entityProps,
    channel,
  } as unknown as TEntity; // todo fix hack, pretty sure this works though

  const proxy = new Proxy(entity, handler);
  const machine = machineMap[entityProps.schema]({
    world,
    entity: proxy,
    channel,
  });
  // todo fix types
  const service = interpret(machine as any) as unknown as TInterpreter;

  service.start();

  proxy.states = service.getSnapshot().value as TStateValue;

  const attachedServices: Partial<Record<ServiceId, AnyActorRef>> = {};

  const attachService = (serviceId: ServiceId, actor: AnyActorRef) => {
    attachedServices[serviceId] = actor;

    actor.subscribe((state) => {
      proxy[serviceId] = {
        value: state.value,
        context: state.context,
      } as any;
    });
  };

  const detachService = (serviceId: ServiceId) => {
    delete attachedServices[serviceId];
    proxy[serviceId] = undefined as any; // better way ?;
  };

  // Listens for new children on the xstate actor
  // and attach/detach it as a service
  service.onTransition((state) => {
    for (const child in state.children) {
      const serviceId = child as ServiceId; // Is this safe to assume?
      const actor = state.children[child];
      if (!attachedServices[serviceId] && actor.getSnapshot()) {
        attachService(serviceId, state.children[child]);
      }
    }

    for (const serviceId in attachedServices) {
      const actor = state.children[serviceId];
      if (!actor) {
        detachService(serviceId);
      }
    }

    proxy.states = state.value as TStateValue;
  });

  return proxy;
};
