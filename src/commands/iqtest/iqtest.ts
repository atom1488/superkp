import { Command } from "../../structures/Command";
import { ChannelType, EmbedBuilder } from "discord.js";

export default new Command({
  name: "iqtest",
  description: "reponds en envoyant le TEST DE QI",
  run: async ({ interaction }) => {
    let createdChannel = await interaction.guild?.channels.create({
      name: interaction.user.username,
      type: ChannelType.GuildText,
    });

    let score = 5;

    const firstQuestion = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Première Question")
      .setDescription("Où se situe le Maghreb ?");

    await createdChannel.send(
      `<@${interaction.user.id}>, bienvenue sur l'Appel du Vide, pour entrer sur le serveur, tu vas devoir répondre à un test de QI de 5 questions. Bonne chance!`
    );
    const question1 = await createdChannel.send({
      embeds: [firstQuestion],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "Moyen-Orient",
              custom_id: "con1",
            },
            {
              type: 2,
              style: 1,
              label: "Région Parisienne",
              custom_id: "con2",
            },
            {
              type: 2,
              style: 1,
              label: "Afrique du Nord",
              custom_id: "iq",
            },
          ],
        },
      ],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const answer = await question1.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000,
      });

      if (answer.customId === "con1" || answer.customId === "con2") {
        score -= 1;
        await answer.update({ components: [] });
      } else if (answer.customId === "iq") {
        await answer.update({ components: [] });
      }
    } catch (err) {
      createdChannel.delete();
      interaction.member.kick("Reponse trop lente");
    }

    const secondQuestion = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Seconde Question")
      .setDescription("Où se situe le Maghreb ?");

      const question2 = await createdChannel.send({
        embeds: [secondQuestion],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 1,
                label: "Moyen-Orient",
                custom_id: "con1",
              },
              {
                type: 2,
                style: 1,
                label: "Région Parisienne",
                custom_id: "con2",
              },
              {
                type: 2,
                style: 1,
                label: "Afrique du Nord",
                custom_id: "iq",
              },
            ],
          },
        ],
      });
  },
});
