// Isomorphic file
// do not put anything that is server or client specific in here
// gets included with the api-client
import { Entity, SnowflakeId } from '@explorers-club/schema';
import { World } from 'miniplex';

export const createIndex = (world: World) => {
  const entitiesById = new Map<SnowflakeId, Entity>();
  for (const entity of world.entities) {
    entitiesById.set(entity.id, entity);
  }

  world.onEntityAdded.add((entity) => {
    entitiesById.set(entity.id, entity);
  });
  world.onEntityRemoved.add((entity) => {
    entitiesById.delete(entity.id);
  });

  return entitiesById;
};

export const waitForEntity = <TEntity extends Entity>(
  world: World<Entity>,
  entitiesById: Map<SnowflakeId, Entity>,
  id: SnowflakeId,
  timeout = 10000
) => {
  const entity = entitiesById.get(id);
  if (entity) {
    return Promise.resolve(entity as TEntity);
  }

  return new Promise<TEntity>((resolve, reject) => {
    const unsub = world.onEntityAdded.add((entity) => {
      if (entity.id === id) {
        resolve(entity as TEntity);
        unsub();
        clearTimeout(timer);
      }
    });

    const timer = setTimeout(() => {
      reject(new Error('timed out waiting for entity ' + id));
      unsub();
    }, timeout);
  });
};

// todo fix "double timeout" on this method
export const waitForCondition = async <TEntity extends Entity>(
  world: World<Entity>,
  entitiesById: Map<SnowflakeId, Entity>,
  id: SnowflakeId,
  condition: (entity: TEntity) => boolean,
  timeoutMs = 10000
) => {
  const entity = await waitForEntity<TEntity>(
    world,
    entitiesById,
    id,
    timeoutMs
  );
  if (condition(entity)) {
    return Promise.resolve(entity);
  }

  return new Promise<TEntity>((resolve, reject) => {
    const unsub = entity.subscribe((s) => {
      if (condition(entity)) {
        clearTimeout(timer);
        resolve(entity);
        unsub();
      }
    });

    const timer = setTimeout(() => {
      unsub();
      reject(new Error('timed out waiting for entity' + entity.id));
    }, timeoutMs);
  });
};
