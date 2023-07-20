import { Command } from "../../structures/Command";
import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";

// Map pour limité l'utilisation du test de QI
const userUsage = new Map();
// Map pour qu'un utilisateur ne puisse pas faire plusieurs fois le test de QI
const userHasIQ = new Map();

type OptionType = { label: string; custom_id: string };

// Array avec plusieurs gifs
const gifs = [
  "https://tenor.com/view/monkey-cool-swag-lavy-gangster-gif-25294031",
  "https://tenor.com/view/homelander-speech-bubble-the-boys-upset-crying-gif-26284753",
  "https://tenor.com/view/ouch-power-ranger-gif-14370780",
];

export default new Command({
  name: "iqtest",
  description: "Reponds en envoyant le TEST DE QI",
  run: async ({ interaction }) => {
    if (interaction.guild.id === "423517770622304274") {
      return;
    }

    let incorrectAnswers = []; // Array qui stock les réponses incorrects

    const userId = interaction.user.id;
    if (userUsage.has(userId)) {
      await interaction.followUp(
        "Tu as déjà effectué le test de QI. Tu ne peux plus le refaire."
      );
      return;
    }

    if (!userUsage.has(userId)) {
      userUsage.set(userId, 1);
    } else {
      userUsage.set(userId, userUsage.get(userId) + 1);
    }

    // Vérifie si "testqi" existe
    let testqiCategory = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildCategory && channel.name === "testqi"
    );

    // Si la catégorie "testqi" n'existe pas, elle est créée
    if (!testqiCategory) {
      testqiCategory = await interaction.guild.channels.create({
        name: "testqi",
        type: ChannelType.GuildCategory,
      });
    }

    let createdChannel = await interaction.guild.channels.create({
      name: interaction.user.username,
      type: ChannelType.GuildText,
      parent: testqiCategory.id,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: ["ViewChannel"], // Les autres rôles ne peuvent pas voir le salon
        },
      ],
    });

    let score = 5;
    let channelDeleted = false; // Variable pour vérifier si le salon a été supprimé

    const sendMessage = async (content: string) => {
      if (!channelDeleted) {
        await createdChannel.send({ content });
      }
    };

    const randomGif = (gifArray: string[]) => {
      const randomIndex = Math.floor(Math.random() * gifArray.length);
      return gifArray[randomIndex];
    };

    const askQuestion = async (question, options: OptionType[]) => {
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

      const message = await createdChannel.send({
        embeds: [embed],
        components: [components],
      });

      try {
        const answer = await message.awaitMessageComponent({
          filter: collectorFilter,
          time: 120000,
        });

        if (
          options.some(
            (option) =>
              option.custom_id === answer.customId && option.custom_id !== "iq"
          )
        ) {
          const selectedOption = options.find(
            (option) => option.custom_id === answer.customId
          ); // Selectionne la réponse de l'utilisateur
          score -= 1;
          incorrectAnswers.push(
            `${question.description}: ${selectedOption.label}`
          ); // Ajoute la mauvaise réponse à l'Array
        }

        await answer.update({ components: [] });
      } catch (err) {
        createdChannel.delete().catch(() => {});
        channelDeleted = true; // Mettre à jour la variable pour indiquer que le salon a été supprimé
        return interaction.followUp({ content: "Trop lent" });
      }
    };

    const collectorFilter = (i: { user: { id: string } }) =>
      i.user.id === interaction.user.id;

    await sendMessage(
      `<@${interaction.member.user.id}>, bienvenue sur **L'Appel du Vide**, pour entrer sur le serveur, tu vas devoir répondre à un Test de QI de 5 questions.\n* Bonne chance!\n## Tu as 2 minutes de temps de réponse pour chaque question`
    );
    await sendMessage(randomGif(gifs));

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
          {
            label: "Il contribue à voter les lois municipales",
            custom_id: "con2",
          },
          {
            label: "Il contribue à voter les lois fédérales de la France",
            custom_id: "con1",
          },
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

    if (!channelDeleted) {
      createdChannel.delete();
      let feedbackMessage = `Ton score est de ${score}/5.`;

      if (incorrectAnswers.length > 0) {
        feedbackMessage += `\nTu t'es trompé aux questions suivantes :\``;
        for (const index of incorrectAnswers) {
          feedbackMessage += `\n${index}`;
        }
        feedbackMessage += "`";
      }

      if (userHasIQ.has(userId)) {
        return; // Ne pas donner le role de QI.
      }
      // Attribution du role par rapport au score :
      const scoreRoleMap: { [key: number]: string } = {
        0: "Mangeur de Mafé",
        1: "Mangeur de Mafé",
        2: "Mangeur de Mafé",
        3: "ADS",
        4: "ADS",
        5: "chooo",
      };

      const roleName = scoreRoleMap[score];
      if (roleName) {
        const role = interaction.member.guild.roles.cache.find(
          (role) => role.name === roleName
        );
        try {
          userHasIQ.set(userId, 1); // Indiquer au Map() que l'utilisateur a déjà fait le test
          interaction.member.roles.add(role);
        } catch (err) {
          console.log(err);
        }
      }

      try {
        const sendChannel = interaction.member.guild.channels.cache.find(
          (channel) => channel.name === "general"
        ) as TextChannel;
        await interaction.followUp({ content: feedbackMessage });
      } catch (err) {
        console.log(err);
      }
    }
  },
});
