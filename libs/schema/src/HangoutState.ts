import { MapSchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') name!: string;
  @type('boolean') connected = true;
}

export class HangoutState extends Schema {
  @type('string') currentSongURL: string | undefined;
  @type('string') selectedGame: 'trivia_jam' | 'diffusionary' | undefined;
  @type({ map: Player }) public players: MapSchema<Player> =
    new MapSchema<Player>();
}
