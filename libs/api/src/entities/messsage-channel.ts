/*
 * Think of channels as the place where events and changes from an entity
 * get streamed "to". It has access to an individual's user id it is able
 * to determine which events it should filter out for the user and which to
 * include.
 *
 * Channels only run on the server where the client doesn't have access.
 *
 * This is an example of an entity type with a dynmaic service type.
 * Services are pretty close to systems in ECS.
 */
import { assert } from '@explorers-club/utils';
import {
  Entity,
  MessageChannelCommand,
  MessageChannelContext,
  MessageChannelEntity,
  MessageChannelMachine,
  MessageData,
} from '@explorers-club/schema';
import { World } from 'miniplex';
import { createMachine } from 'xstate';
import { entitiesById } from '../server/state';
import { Observable, lastValueFrom, map } from 'rxjs';

// return createMachine({
//   id: 'MessageChannelMachine',
//   type: 'parallel',
//   schema: {
//     context: {} as MessageChannelContext,
//     events: {} as MessageChannelCommand,
//   },
//   states: {},
//   predictableActionArguments: true,
// });

export const createMessageChannelMachine = ({
  world,
  entity,
}: {
  world: World;
  entity: Entity;
}) => {
  const messageChannelEntity = entity as MessageChannelEntity;
  const parentEntity = entitiesById.get(messageChannelEntity.parentId);
  assert(parentEntity, "expected parentEntity but wasn't found");
  assert('channel' in parentEntity, 'expected channel in parentEntity');
  const channel = parentEntity.channel as Observable<MessageData>;

  // channel.subscribe((e) => {
  //   console.log('listening from msg channel', e);
  // });
  return createMachine({
    id: 'MessageChannelMachine',
    initial: 'Initialized',
    context: {
      foo: '',
    },
    schema: {
      events: {} as MessageChannelCommand,
      context: {} as MessageChannelContext,
    },
    states: {
      Initialized: {
        initial: 'Running',
        states: {
          Running: {
            invoke: {
              src: async () => {
                channel.subscribe((event) => {
                  messageChannelEntity.messages = [
                    ...messageChannelEntity.messages,
                    event,
                  ];
                });

                await parentEntity.channel.toPromise();
              },
            },
          },
          Error: {},
        },
      },
    },
  }) satisfies MessageChannelMachine;

  // parentEntity.channel.pipe(map((f) => f)).subscribe((e) => {

  // })
  // parentEntity.channel.subscribe((e) => {

  // })

  // parentEntity.channel.subscribe((e) => {
  //   console.log(e);
  // })

  // parentEntity.channel.subscribe((messageData) => {

  // })

  // parentEntity.subscribe((event) => {
  //   event.type
  // })

  // switch (parentEntity.schema) {
  //   case 'room':
  //     // parentEntity.channel.subscribe((e) => {
  //     //   console.log(e);
  //     // });
  //     // What does this channel do?
  //     return createMachine({}) as MessageChannelMachine;
  //   case 'little_vigilante_game':
  //     return createMachine({}) as MessageChannelMachine;
  //   case 'codebreakers_game':
  //     return createMachine({}) as MessageChannelMachine;
  //   case 'banana_traders_game':
  //     return createMachine({}) as MessageChannelMachine;
  //   default:
  //     throw new Error(
  //       'message channel machine not implemented for entity schema: ' +
  //         parentEntity.schema
  //     );
  // }
};
