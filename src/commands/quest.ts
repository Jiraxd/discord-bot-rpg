import {
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from "discord.js";
import { Command } from "../managers/cmd.manager";
import { getUser } from "../database/user.manager";
import { getNoProfileEmbed } from "../misc/utils";
import {
  assignRandomAvailableQuest,
  getQuestInfo,
} from "../managers/quest.manager";
import prisma from "../misc/db";

export const body: Command = {
  name: "quest",
  description: "Shows your current quest progress and available quests",
  parameters: [],
  execute: async (interaction: CommandInteraction) => {
    const user = await getUser(interaction.user.id);

    if (!user) {
      const noProfileEmbed = getNoProfileEmbed();
      await interaction.reply({
        embeds: [noProfileEmbed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    if (user.activeQuest) {
      // todo
      return;
    }

    let availableQuests = user.availableQuests;
    const questIds = availableQuests.map((q) => parseInt(q.questId));

    while (availableQuests.length < 3) {
      const newQuest = assignRandomAvailableQuest(user, questIds);
      if (!newQuest) break;

      const dbQuest = await prisma.quest.create({
        data: {
          questId: newQuest.id,
          availableForUserId: user.id,
        },
      });

      availableQuests.push(dbQuest);
      questIds.push(parseInt(newQuest.id));
    }

    const availableQuestsEmbed = new EmbedBuilder()
      .setTitle("Available Quests")
      .setDescription("Choose a quest to embark on:")
      .setColor("#4287f5");

    if (availableQuests.length === 0) {
      availableQuestsEmbed.setDescription(
        "No quests available at this time. Check back later!"
      );
      await interaction.reply({ embeds: [availableQuestsEmbed] });
      return;
    }

    availableQuests.forEach((quest, index) => {
      const questInfo = getQuestInfo(quest.questId);
      availableQuestsEmbed.addFields({
        name: `${index + 1}. ${questInfo.name} (Level ${questInfo.level})`,
        value: `${questInfo.description}\n💰 ${questInfo.goldMin}-${questInfo.goldMax} gold\n✨ ${questInfo.experienceMin}-${questInfo.experienceMax} XP\n Item drops: ${questInfo.itemRewardAmount}`,
      });
    });

    const row = new ActionRowBuilder<ButtonBuilder>();

    availableQuests.forEach((quest, index) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_quest_${quest.id}`)
          .setLabel(`Accept Quest ${index + 1}`)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await interaction.reply({
      embeds: [availableQuestsEmbed],
      components: [row],
    });
    const response = await interaction.fetchReply();
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000, // 1 minute timeout
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        await buttonInteraction.reply({
          content:
            "This quest is not for you. Use the /quest command to see your own quests.",
          ephemeral: true,
        });
        return;
      }

      const questId = buttonInteraction.customId.replace("accept_quest_", "");
      const selectedQuest = availableQuests.find(
        (q) => q.id.toString() === questId
      );

      if (!selectedQuest) {
        await buttonInteraction.reply({
          content: "This quest is no longer available.",
          ephemeral: true,
        });
        return;
      }

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            activeQuest: {
              create: {
                questId: selectedQuest.questId,
                startedAt: new Date(),
              },
            },
          },
        });

        await prisma.quest.deleteMany({
          where: {
            availableForUserId: user.id,
            id: parseInt(questId),
          },
        });

        const questInfo = getQuestInfo(selectedQuest.questId);
        const acceptedQuestEmbed = new EmbedBuilder()
          .setTitle("Quest Accepted")
          .setDescription(`You have accepted the quest: **${questInfo.name}**`)
          .addFields({
            name: "Quest Details",
            value: `${questInfo.description}\n💰 ${questInfo.goldMin}-${questInfo.goldMax} gold\n✨ ${questInfo.experienceMin}-${questInfo.experienceMax} XP\n Item drops: ${questInfo.itemRewardAmount}`,
          })
          .addFields({
            name: "Quest Progress",
            value: `You can view your quest progress using 
            '/quest' !`,
          })
          .setColor("#00FF00");

        await buttonInteraction.update({
          embeds: [acceptedQuestEmbed],
          components: [],
        });

        collector.stop();
      } catch (error) {
        console.error("Error accepting quest:", error);
        await buttonInteraction.reply({
          content: "There was an error accepting the quest. Please try again.",
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time" && collected.size === 0) {
        await interaction.editReply({
          components: [],
          content:
            "Quest selection timed out. Use the /quest command again to see available quests.",
        });
      }
    });
  },
};
