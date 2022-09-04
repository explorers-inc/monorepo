import { ActorRefFrom, ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyModel = createModel(
  {
    id: '' as string,
    playerIds: [] as string[],
  },
  {
    events: {
      PLAYER_JOINED: (id: string) => ({ playerId: id }),
      PLAYER_CONNECTED: (id: string) => ({ playerId: id }),
      PLAYER_DISCONNECTED: (id: string) => ({ playerId: id }),
      PLAYER_READY: (id: string) => ({ playerId: id }),
    },
  }
);

export type PartyContext = ContextFrom<typeof partyModel>;

export const createPartyServerMachine = (context: PartyContext) => {
  return partyModel.createMachine(
    {
      id: `PartyServerMachine-${context.id}`,
      initial: 'Initializing',
      context,
      states: {
        Initializing: {},
      },
    },
    {
      services: {},
    }
  );
};

// export const createPartyClientMachine = (id: string) => {
//   return partyModel.createMachine({
//     id: `PartyClientMachine-${id}`,
//     initial: 'Initializing',
//     context: {
//       id,
//     },
//     states: {
//       Initializing: {},
//     },
//   });
// };

type PartyMachine = ReturnType<typeof createPartyServerMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;