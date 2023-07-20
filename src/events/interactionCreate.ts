import {
  CommandInteractionOptionResolver,
  PermissionResolvable,
  PermissionsBitField,
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
  // Chat Input Commands
  if (!interaction.isCommand()) return;

  try {
    await interaction.deferReply();

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.followUp("You have used a non-existent command");
    }

    if (command.userPermissions) {
      const memberPermission = interaction.member
        ?.permissions as Readonly<PermissionsBitField>;

      const missingPermissions = command.userPermissions.filter(
        (perm) => !memberPermission?.has(perm)
      );

      if (missingPermissions.length > 0) {
        const formattedPermissions = missingPermissions
          .map((p) => `\`${p}\``)
          .join(", ");
        const message =
          missingPermissions.length > 1
            ? `You don't have (${formattedPermissions}) permissions.`
            : `You don't have ${formattedPermissions} permission.`;

        return interaction.followUp({ ephemeral: true, content: message });
      }
    }

    const args = interaction.options as CommandInteractionOptionResolver;
    command.run({
      args,
      client,
      interaction: interaction as ExtendedInteraction,
    });
  } catch (error) {
    console.error("Error processing interaction:", error);
    interaction.followUp({
      ephemeral: true,
      content: "An error occurred while processing your command.",
    });
  }
});
