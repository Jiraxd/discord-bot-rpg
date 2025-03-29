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

export const body: Command = {
  name: "help",
  description:
    "Shows the help menu with setup instructions and available commands",
  parameters: [],
  execute: async (interaction: CommandInteraction) => {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Undefined RPG Bot - Help")
      .setDescription(
        "Welcome to Undefined RPG Bot! This bot allows you to play an RPG game directly in your Discord server."
      )
      .addFields(
        {
          name: "🔧 Setup",
          value:
            "To get started, make sure the bot has the proper permissions in your server.",
        },
        {
          name: "💡 Quick Start",
          value:
            "Use `/start` to begin your adventure and create your character.",
        },
        {
          name: "📚 Need more help?",
          value:
            "Click the buttons below to view detailed guides or see all available commands.",
        }
      )
      .setFooter({ text: "Use the buttons below to navigate" })
      .setTimestamp();

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("guide")
        .setLabel("Game Guide")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📖"),
      new ButtonBuilder()
        .setCustomId("commands")
        .setLabel("Commands List")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔍"),
      new ButtonBuilder()
        .setCustomId("settings")
        .setLabel("Settings")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⚙️"),
      new ButtonBuilder()
        .setCustomId("home")
        .setLabel("Main Menu")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏠")
    );

    await interaction.reply({
      embeds: [helpEmbed],
      components: [buttons],
    });

    const response = await interaction.fetchReply();

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: "These buttons are not for you!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (i.customId === "guide") {
        const guideEmbed = new EmbedBuilder()
          .setColor(0x3ba55c)
          .setTitle("Game Guide")
          .setDescription("Learn how to play Undefined RPG!")
          .addFields(
            {
              name: "⚔️ Combat",
              value:
                "Use `/explore` to explore new areas. Find chests and battle monsters using /attack.",
            },
            {
              name: "💰 Economy",
              value:
                "Earn gold through battles and quests. Spend it on items and upgrades.",
            },
            {
              name: "🏆 Leveling",
              value: "Gain XP to level up and increase your stats.",
            },
            {
              name: "🛡️ Equipment",
              value: "Use `/inventory` to view and equip items.",
            }
          );

        await i.update({ embeds: [guideEmbed], components: [buttons] });
      } else if (i.customId === "commands") {
        const commandsEmbed = new EmbedBuilder()
          .setColor(0xeb459e)
          .setTitle("Available Commands")
          .setDescription("Here are all the commands you can use:")
          .addFields(
            {
              name: "🎮 Basic Commands",
              value:
                "`/start` - Begin your adventure\n`/profile` - View your character\n`/help` - Show this help menu",
            },
            {
              name: "⚔️ Combat Commands",
              value: "`/attack` - Attack a monster",
            },
            {
              name: "💰 Economy Commands",
              value:
                "`/inventory` - View your items\n`/shop` - Browse available items\n`/buy` - Purchase items",
            },
            {
              name: "🌍 World Commands",
              value:
                "`/explore` - Discover new areas\n`/quest` - View and accept quests",
            }
          );

        await i.update({ embeds: [commandsEmbed], components: [buttons] });
      } else if (i.customId === "settings") {
        const settingsEmbed = new EmbedBuilder()
          .setColor(0x2b82dc)
          .setTitle("Game Settings")
          .setDescription("Configure your RPG game experience")
          .addFields(
            {
              name: "⚙️ User Settings",
              value:
                "Configure your personal preferences for the game experience using `/settings`.",
            },
            {
              name: "👑 Server Admin Settings",
              value:
                "Server administrators can use `/serversettings` to configure server-wide game options.",
            }
          );

        await i.update({ embeds: [settingsEmbed], components: [buttons] });
      } else if (i.customId === "home") {
        await i.update({ embeds: [helpEmbed], components: [buttons] });
      }
    });

    collector.on("end", async (collected, reason) => {
      try {
        await interaction.editReply({ components: [] });
      } catch (error) {
        console.error("Error removing buttons from help command:", error);
      }
    });
  },
};
