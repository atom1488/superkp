import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'limbes',
  description: "Met un membre dans les limbes",
  userPermissions: ['KickMembers'],
  options: [
    {
      name: 'membre',
      type: ApplicationCommandOptionType.User,
      description: 'Bon séjour.',
      required: true,
    }
  ],
  run: async ({ interaction }) => {
    const member = interaction.options.getMember('membre') as GuildMember;

    if (interaction.member.roles.highest.rawPosition <= member.roles.highest.rawPosition) {
      return interaction.followUp({ content: `Ce membre est plus haut placé que toi :)` });
    }

    member.roles.cache.forEach(role => {
      if (role.name === '@everyone') return;
      member.roles.remove(role);
    });

    member.roles.add('978264937732382742')

    interaction.followUp({ content: `${member}, bon séjour.` });
  },
});