import { ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'nuke',
  description: 'Supprime le salon et le clone à l\'identique',
  userPermissions: ['ManageChannels'],
  run: async ({ interaction }) => {
    if (!interaction.guild.members.me.permissions.has('Administrator'))
      return interaction.followUp({ content: `Je ne suis pas \`Administrator\`.` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('nukeYes').setLabel('Oui').setStyle(3),

      new ButtonBuilder().setCustomId('nukeNo').setLabel('Non').setStyle(4)
    );

    const nukeInteraction = interaction;

    nukeInteraction.followUp({ content: `:warning: Alerte!!! Nuke ?`, components: [row as any] });

    setTimeout(() => {
      nukeInteraction.deleteReply().catch(() => {});
    }, 10000);

    const collector = nukeInteraction.channel.createMessageComponentCollector({ time: 10000 });

    collector.on('collect', async (button: ButtonInteraction) => {
      if (button.customId === 'nukeYes') {
        button.deferUpdate();
        if (button.user.id !== interaction.user.id) return;
        const buttonChannel = button.channel as BaseGuildTextChannel;
        const newChannel = (await buttonChannel.clone().catch(() => {})) as BaseGuildTextChannel;
        buttonChannel.delete().catch(() => {});
        newChannel.setPosition(buttonChannel.rawPosition);
        newChannel.send({ content: `\`${buttonChannel.name}\` a été nuke par **${interaction.user.username}**` });
      }

      if (button.customId === 'nukeNo') {
        button.deferUpdate();
        if (button.user.id !== interaction.user.id) return;
        const buttonMessage = button.message;
        buttonMessage.delete().catch(() => {});
      }
    });
  },
});