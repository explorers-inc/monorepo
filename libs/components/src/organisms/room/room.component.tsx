import { Heading } from '@atoms/Heading';
import { InitializedConnectionEntityContext } from '../../context/Entity';
import { enablePatches } from 'immer';
import { useContext } from 'react';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { RoomContext } from './room.context';
import { useEntitySelector } from '@hooks/useEntitySelector';
enablePatches();

export const Room = () => {
  const { roomEntity } = useContext(RoomContext);
  const connectPlayerCount = useEntitySelector(
    roomEntity,
    (entity) => entity.connectedEntityIds.length
  );

  const selectedGameId = useEntitySelector(roomEntity, (state) => state.gameId);

  return (
    <Flex gap="2" css={{ p: '$2', gap: '$2' }} direction="column">
      <Heading css={{ color: 'white' }} size="2">
        #{roomEntity.slug}
      </Heading>
      <Heading css={{ color: 'white' }}>{roomEntity.gameId}</Heading>
      <Text css={{ color: 'white' }}>{connectPlayerCount} connected</Text>
      <Text css={{ color: 'white' }}>
        {selectedGameId ? selectedGameId : 'No game selected'}
      </Text>
    </Flex>
  );
};
