import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ApplicationCommandData,
} from "discord.js";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import { ExtendedEvents } from "./Event";
import { promisify } from "util";
import glob from "glob";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
      ],
    });
  }

  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }

  async importFile(filePath: string) {
    try {
      const module = await import(filePath);
      return module.default;
    } catch (e) {
      console.log(`❌ Error: ${e}`);
      return null;
    }
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    const target = guildId ? this.guilds.cache.get(guildId) : this.application;
    if (!target) return;

    await target.commands.set(commands);
    console.log(
      guildId
        ? `\nRegistering commands to ${guildId}`
        : "\nRegistering global commands"
    );
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandData[] = [];
    const commandFiles = await globPromise(
      (__dirname + "/..//commands//**//*.ts").replace(/\\/g, "/")
    );
    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command || !command.name) continue;
      console.log(`☑️  ${command.name} loaded.`);

      this.commands.set(command.name.toLowerCase(), command);
      slashCommands.push(command);
    }

    // Register Commands
    this.on("ready", async () => {
      await this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    // Events
    const eventFiles = await globPromise(
      (__dirname + "/..//events//*.{ts,js}").replace(/\\/g, "/")
    );
    for (const filePath of eventFiles) {
      const event: Event<keyof ExtendedEvents> = await this.importFile(
        filePath
      );
      if (!event || !event.event) continue;

      this.on(event.event as string, event.run);
    }
  }
}
