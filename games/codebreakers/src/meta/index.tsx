import { CodebreakersGameInfoScreen } from './codebreakers-game-info-screen.component';

export const CODEBREAKERS_CONFIG = {
  gameId: 'codebreakers',
  displayName: 'Codebreakers',
  minPlayers: 4,
  maxPlayers: 10,
  coverImageUrl:
    'https://media.discordapp.net/attachments/1000472333108129935/1064172607500451920/InspectorT_box_cover_for_a_game_called_Codebreakers_1e7b9bc8-47f2-438a-8c8d-fdc543fbd38e.png?width=1194&height=1194',
  GameInfoScreenComponent: <CodebreakersGameInfoScreen />,
} as const;