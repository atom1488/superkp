import { CommandInteractionOptionResolver, PermissionResolvable, Permissions, PermissionsBitField } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/Event';
import { ExtendedInteraction } from '../typings/Command';

export default new Event('interactionCreate', async (interaction) => {
  // Chat Input Commands
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.followUp('You have used a non existent command');

    if (command.userPermissions) {
      var neededPermissions: PermissionResolvable[] = [];

      command.userPermissions.forEach((perm) => {
        const memberPermission = interaction.member.permissions as Readonly<PermissionsBitField>;
        if (!memberPermission.has(perm)) {
          neededPermissions.push(perm);
        }
      });

      if (neededPermissions.length != 0) {
        if (neededPermissions.length > 1) {
          return interaction.followUp({
            ephemeral: true,
            content: `You don't have (${neededPermissions.map((p) => `\`${p}\``).join(', ')}) permissions.`,
          });
        } else {
          return interaction.followUp({
            ephemeral: true,
            content: `You don't have \`${neededPermissions}\` permission.`,
          });
        }
      }
    }

    command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction,
    });
  }
});