import { Command } from '../../structures/Command';

export default new Command({
  name: 'ping',
  description: "reponds en envoyant le ping du bot",
  run: async ({ client, interaction }) => {
    interaction.followUp({ content: `Le ping du bot est actuellement de \`${client.ws.ping}ms\`` });
  },
});