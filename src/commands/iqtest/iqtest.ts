import { Command } from "../../structures/Command";
import { ChannelType, EmbedBuilder } from "discord.js";

export default new Command({
  name: "iqtest",
  description: "reponds en envoyant le TEST DE QI",
  run: async ({ interaction }) => {
    if (interaction.guild.id === "423517770622304274") {
      return;
    }

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

    // A: Moyen-Orient
    // B: Région Parisienne
    // C: Afrique du Nord

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
      .setDescription("Parmi ces livres, lequel appartient à Socrate ?");

    // A - "La République" ;
    // B - "Humain trop humain" ;
    // C - "Du contrat social" ;
    // D - "La république et la Res publica" ;
    // E - "Socrate n'a jamais écrit de livre"

    const question2 = await createdChannel.send({
      embeds: [secondQuestion],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "La République",
              custom_id: "con1",
            },
            {
              type: 2,
              style: 1,
              label: "Humain trop humain",
              custom_id: "con2",
            },
            {
              type: 2,
              style: 1,
              label: "Du contrat social",
              custom_id: "con3",
            },
            {
              type: 2,
              style: 1,
              label: "La république et la Res publica",
              custom_id: "con4",
            },
            {
              type: 2,
              style: 1,
              label: "Socrate n'a jamais écrit de livre",
              custom_id: "iq",
            },
          ],
        },
      ],
    });

    try {
      const answer = await question2.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000,
      });

      if (
        answer.customId === "con1" ||
        answer.customId === "con2" ||
        answer.customId === "con3" ||
        answer.customId === "con4"
      ) {
        score -= 1;
        await answer.update({ components: [] });
      } else if (answer.customId === "iq") {
        await answer.update({ components: [] });
      }
    } catch (err) {
      createdChannel.delete().catch(() => {});
      interaction.member.kick("Reponse trop lente");
    }

    const troisiemeQuestion = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Troisième Question")
      .setDescription("À quoi sert le Sénat ?");

    // A Il contribue à voter les lois fédérales de la France ;
    // B Il contribue à voter les lois municipales ;
    // C Il vote des projets de lois.

    const question3 = await createdChannel.send({
      embeds: [troisiemeQuestion],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "Il vote des projets de lois",
              custom_id: "iq",
            },
            {
              type: 2,
              style: 1,
              label: "Il contribue à voter les lois municipales",
              custom_id: "con2",
            },
            {
              type: 2,
              style: 1,
              label: "Il contribue à voter les lois fédérales de la France",
              custom_id: "con1",
            },
          ],
        },
      ],
    });

    try {
      const answer = await question3.awaitMessageComponent({
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
      createdChannel.delete().catch(() => {});
      interaction.member.kick("Reponse trop lente");
    }

    const quatriemeQuestion = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Quatrième Question")
      .setDescription("Que signifie OPJ ?");

    // A - Officier de Paix Judiciaire ;
    // B - Officier de Police Justice ;
    // C - Officier de Police Juridique ;
    // D - Officier de Police Judiciaire

    const question4 = await createdChannel.send({
      embeds: [quatriemeQuestion],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "Officier de Paix Judiciaire",
              custom_id: "con1",
            },
            {
              type: 2,
              style: 1,
              label: "Officier de Police Judiciaire",
              custom_id: "iq",
            },
            {
              type: 2,
              style: 1,
              label: "Officier de Police Juridique",
              custom_id: "con3",
            },
            {
              type: 2,
              style: 1,
              label: "Officier de Police Justice",
              custom_id: "con2",
            },
          ],
        },
      ],
    });

    try {
      const answer = await question4.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000,
      });

      if (
        answer.customId === "con1" ||
        answer.customId === "con2" ||
        answer.customId === "con3"
      ) {
        score -= 1;
        await answer.update({ components: [] });
      } else if (answer.customId === "iq") {
        await answer.update({ components: [] });
      }
    } catch (err) {
      createdChannel.delete().catch(() => {});
      interaction.member.kick("Reponse trop lente");
    }

    const cinquiemeQuestion = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Cinquième Question")
      .setDescription("Quel est la dérivé de 3x² ?");

    // A - 9x²;
    // B - 3x ;
    // C - 9x ;
    // D - 3x

    const question5 = await createdChannel.send({
      embeds: [cinquiemeQuestion],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: "9x²",
              custom_id: "con1",
            },
            {
              type: 2,
              style: 1,
              label: "6x",
              custom_id: "iq",
            },
            {
              type: 2,
              style: 1,
              label: "9x",
              custom_id: "con3",
            },
            {
              type: 2,
              style: 1,
              label: "3x³",
              custom_id: "con2",
            },
          ],
        },
      ],
    });

    try {
      const answer = await question5.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000,
      });

      if (
        answer.customId === "con1" ||
        answer.customId === "con2" ||
        answer.customId === "con3"
      ) {
        score -= 1;
        await answer.update({ components: [] });
      } else if (answer.customId === "iq") {
        await answer.update({ components: [] });
      }
    } catch (err) {
      createdChannel.delete().catch(() => {});
      interaction.member.kick("Reponse trop lente");
    }

    interaction.followUp({ content: `Ton score est de ${score}/5` });
  },
});
