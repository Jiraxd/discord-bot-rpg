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
      const questInfo = getQuestInfo(user.activeQuest.questId);
      const startTime = user.activeQuest.startedAt || new Date();
      const questDuration = questInfo.length * 60 * 1000; // convert minutes to milliseconds
      const endTime = new Date(startTime.getTime() + questDuration);
      const currentTime = new Date();

      // quest endedm, give rewards
      if (currentTime >= endTime) {
        const goldReward =
          Math.floor(
            Math.random() * (questInfo.goldMax - questInfo.goldMin + 1)
          ) + questInfo.goldMin;
        const xpReward =
          Math.floor(
            Math.random() *
              (questInfo.experienceMax - questInfo.experienceMin + 1)
          ) + questInfo.experienceMin;

        const itemRewards = [];
        if (questInfo.itemReward.length > 0 && questInfo.itemRewardAmount > 0) {
          const totalWeight = questInfo.itemReward.reduce(
            (sum, item) => sum + item.weight,
            0
          );
          const itemRewardAmount =
            Math.floor(Math.random() * questInfo.itemRewardAmount) + 1;

          for (let i = 0; i < itemRewardAmount; i++) {
            let randomValue = Math.random() * totalWeight;
            let selectedItem = null;

            for (const item of questInfo.itemReward) {
              randomValue -= item.weight;
              if (randomValue <= 0) {
                selectedItem = item;
                break;
              }
            }

            if (selectedItem) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  inventory: {
                    create: {
                      state: selectedItem.state,
                      itemId: selectedItem.id,
                    },
                  },
                },
              });

              itemRewards.push(selectedItem);
            }
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            money: { increment: goldReward },
            xp: { increment: xpReward },
          },
        });

        await prisma.quest.delete({
          where: { id: user.activeQuest.id },
        });

        const completionEmbed = new EmbedBuilder()
          .setTitle("Quest Completed!")
          .setDescription(`You have completed the quest: **${questInfo.name}**`)
          .addFields({
            name: "Rewards",
            value: `💰 ${goldReward} gold\n✨ ${xpReward} XP`,
          })
          .setColor("#00FF00");

        if (itemRewards.length > 0) {
          completionEmbed.addFields({
            name: "Items Received",
            value: itemRewards.map((item) => `${item.id}`).join("\n"),
          });
        }

        await interaction.reply({ embeds: [completionEmbed] });
        return;
      } else {
        const timeRemaining = endTime.getTime() - currentTime.getTime();
        const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000));

        const progressEmbed = new EmbedBuilder()
          .setTitle("Active Quest")
          .setDescription(
            `You are currently on the quest: **${questInfo.name}**`
          )
          .addFields(
            { name: "Objective", value: questInfo.description },
            {
              name: "Time Remaining",
              value: `${minutesRemaining} minute${
                minutesRemaining !== 1 ? "s" : ""
              }`,
            },
            {
              name: "Possible Rewards",
              value: `💰 ${questInfo.goldMin}-${questInfo.goldMax} gold\n✨ ${questInfo.experienceMin}-${questInfo.experienceMax} XP`,
            },
            {
              name: "Item Rewards",
              value: `You may receive up to ${questInfo.itemRewardAmount} item(s) upon completion.`,
            }
          )
          .setColor("#FFD700");

        if (questInfo.itemReward.length > 0) {
          progressEmbed.addFields({
            name: "Possible Item Rewards",
            value: `You may receive up to ${questInfo.itemRewardAmount} item(s) upon completion.`,
          });
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("abandon_quest")
            .setLabel("Abandon Quest")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
          embeds: [progressEmbed],
          components: [row],
        });

        const response = await interaction.fetchReply();
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 60000,
        });

        collector.on("collect", async (buttonInteraction) => {
          if (buttonInteraction.user.id !== interaction.user.id) {
            await buttonInteraction.reply({
              content: "This quest belongs to someone else.",
              ephemeral: true,
            });
            return;
          }

          if (buttonInteraction.customId === "abandon_quest") {
            if (!user.activeQuest) {
              await buttonInteraction.reply({
                content: "You don't have an active quest.",
                ephemeral: true,
              });
              return;
            }
            await prisma.quest.delete({
              where: { id: user.activeQuest.id },
            });

            await buttonInteraction.update({
              content:
                "You have abandoned your quest. Use /quest to find a new one.",
              embeds: [],
              components: [],
            });
          }
        });

        return;
      }
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
