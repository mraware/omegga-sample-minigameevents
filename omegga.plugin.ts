import OmeggaPlugin, { OL, PS, PC } from 'omegga';

type Config = { foo: string };
type Storage = { bar: string };

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;

  }

  async init() {
    // Subscribe to the death events plugin
    const minigameEvents = await this.omegga.getPlugin('minigameevents')
    if (minigameEvents) {
      console.log('subscribing to minigameevents')
      minigameEvents.emitPlugin('subscribe')
    } else {
      throw Error("minigameevents plugin is required for this to plugin")
    }
  }

  async stop() {
    // Unsubscribe to the death events plugin
    const minigameEvents = await this.omegga.getPlugin('minigameevents')
    if (minigameEvents) {
      console.log('unsubscribing from minigameevents')
      minigameEvents.emitPlugin('unsubscribe')
    } else {
      throw Error("minigameevents plugin is required for this to plugin")
    }
  }

  async pluginEvent(event: string, from: string, ...args: any[]) {
    console.log(event, from, args)
    if (event === 'roundend') {
      const [{ name }] = args;
      this.omegga.broadcast(`${name} has ended.`)
    }

    if (event === 'roundchange') {
      const [{ name }] = args;
      this.omegga.broadcast(`${name} has reset.`);
    }

    if (event === 'joinminigame') {
      const [{ player, minigame }] = args;
      if (player && minigame) {
        this.omegga.broadcast(`${player.name} has joined ${minigame.name}`);
      }
    }

    if (event === 'leaveminigame') {
      const [{ player, minigame }] = args;
      if (player && minigame) {
        this.omegga.broadcast(`${player.name} has left ${minigame.name}`);
      }
    }

    if (event === 'leaderboardchange') {
      const [{ player, leaderboard }] = args;
      if (player) {
        this.omegga.broadcast(`${player.name} has gotten a a new leaderboard: ${leaderboard[0]},${leaderboard[1]},${leaderboard[2]}`);
      }
    }

    if (event === 'score') {
      const [{ player, leaderboard }] = args;
      if (player) {
        this.omegga.broadcast(`${player.name} has gotten a score: ${leaderboard[0]}`);
      }
    }

    if (event === 'kill') {
      const [{ player, leaderboard }] = args;
      if (player) {
        this.omegga.broadcast(`${player.name} has gotten a kill: ${leaderboard[1]}`);
      }
    }

    if (event === 'death') {
      const [{ player, leaderboard }] = args;
      if (player) {
        this.omegga.broadcast(`${player.name} has gotten a death: ${leaderboard[2]}`);
      }
    }
  }
}
