import { Event } from '../structures/Event';
import { Guild } from 'discord.js';

export default new Event('ready', (client) => {
  client.guilds.cache.forEach(async (guild: Guild) => {
    await guild.members.fetch();
  });

  console.log('Bot is online, all guilds members fetched!');
});