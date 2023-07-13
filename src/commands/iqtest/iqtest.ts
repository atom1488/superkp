import { Command } from "../../structures/Command";
import { ChannelType, EmbedBuilder } from "discord.js";

const userUsage = new Map();

export default new Command({
  name: "iqtest",
  description: "Reponds en envoyant le TEST DE QI",
  run: async ({ interaction }) => {
    if (interaction.guild.id === "423517770622304274") {
      return;
    }

    const userId = interaction.user.id;
    if (userUsage.has(userId) && userUsage.get(userId) >= 2) {
      await interaction.followUp("Tu as déjà effectué le test de QI deux fois. Tu ne peux plus le refaire.");
      return;
    }

    if (!userUsage.has(userId)) {
      userUsage.set(userId, 1);
    } else {
      userUsage.set(userId, userUsage.get(userId) + 1);
    }

    let createdChannel = await interaction.guild?.channels.create({
      name: interaction.user.username,
      type: ChannelType.GuildText,
    });

    let score = 5;
    let channelDeleted = false; // Variable pour vérifier si le salon a été supprimé

    const sendMessage = async (content) => {
      if (!channelDeleted) {
        await createdChannel.send(`<@${interaction.user.id}>, ${content}`);
      }
    };

    const askQuestion = async (question, options) => {
      const embed = new EmbedBuilder()
        .setColor("DarkAqua")
        .setTitle(question.title)
        .setDescription(question.description);

      const components = {
        type: 1,
        components: options.map((option) => ({
          type: 2,
          style: 1,
          label: option.label,
          custom_id: option.custom_id,
        })),
      };

      const message = await createdChannel.send({ embeds: [embed], components: [components] });

      try {
        const answer = await message.awaitMessageComponent({
          filter: collectorFilter,
          time: 60000,
        });

        if (options.some((option) => option.custom_id === answer.customId && option.custom_id !== "iq")) {
          score -= 1;
        }

        await answer.update({ components: [] });
      } catch (err) {
        createdChannel.delete().catch(() => { });
        interaction.member.kick("Reponse trop lente").catch(() => { });
        channelDeleted = true; // Mettre à jour la variable pour indiquer que le salon a été supprimé
        return interaction.followUp({ content: "Trop lent" });
      }
    };

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    await sendMessage(
      "Bienvenue sur l'Appel du Vide, pour entrer sur le serveur, tu vas devoir répondre à un test de QI de 5 questions. Bonne chance!"
    );


    const questions = [
      {
        title: "Première Question",
        description: "Où se situe le Maghreb ?",
        options: [
          { label: "Moyen-Orient", custom_id: "con1" },
          { label: "Région Parisienne", custom_id: "con2" },
          { label: "Afrique du Nord", custom_id: "iq" },
        ],
      },
      {
        title: "Seconde Question",
        description: "Parmi ces livres, lequel appartient à Socrate ?",
        options: [
          { label: "La République", custom_id: "con1" },
          { label: "Humain trop humain", custom_id: "con2" },
          { label: "Du contrat social", custom_id: "con3" },
          { label: "La république et la Res publica", custom_id: "con4" },
          { label: "Socrate n'a jamais écrit de livre", custom_id: "iq" },
        ],
      },
      {
        title: "Troisième Question",
        description: "À quoi sert le Sénat ?",
        options: [
          { label: "Il vote des projets de lois", custom_id: "iq" },
          { label: "Il contribue à voter les lois municipales", custom_id: "con2" },
          { label: "Il contribue à voter les lois fédérales de la France", custom_id: "con1" },
        ],
      },
      {
        title: "Quatrième Question",
        description: "Que signifie OPJ ?",
        options: [
          { label: "Officier de Paix Judiciaire", custom_id: "con1" },
          { label: "Officier de Police Judiciaire", custom_id: "iq" },
          { label: "Officier de Police Juridique", custom_id: "con3" },
          { label: "Officier de Police Justice", custom_id: "con2" },
        ],
      },
      {
        title: "Cinquième Question",
        description: "Quel est la dérivé de 3x² ?",
        options: [
          { label: "9x²", custom_id: "con1" },
          { label: "6x", custom_id: "iq" },
          { label: "9x", custom_id: "con3" },
          { label: "3x³", custom_id: "con2" },
        ],
      },
    ];

    for (const question of questions) {
      await askQuestion(question, question.options);

      // Vérifier si le salon a été supprimé avant de continuer la boucle
      if (channelDeleted) {
        break;
      }
    }

    if (!channelDeleted)
      interaction.followUp({ content: `Ton score est de ${score}/5` });
  },
});