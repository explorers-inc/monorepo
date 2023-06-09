import { ConnectionEntity, RoomEntity } from '@explorers-club/schema';
import { createContext } from 'react';

export const ChatContext = createContext(
  {} as {
    connectionEntity: ConnectionEntity;
    roomEntity: RoomEntity;
  }
);
