import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
  User,
} from "discord.js";
import { Command, CommandParameterType } from "../managers/cmd.manager";
import prisma from "../misc/db";
import { classDetails, getLevelProgress } from "../misc/utils";
import { client } from "../main";

const DEFAULT_COLOR = 0xfee75c;

export const body: Command = {
  name: "profile",
  description: "View your character profile or another player's profile",
  parameters: [
    {
      name: "user",
      description: "The user whose profile you want to view (optional)",
      type: CommandParameterType.USER,
      required: false,
    },
  ],
  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const targetUser =
        interaction.options.getUser("user") || interaction.user;

      const user = await prisma.user.findUnique({
        where: { id: targetUser.id },
      });

      if (!user) {
        const noProfileEmbed = new EmbedBuilder()
          .setColor(0xfee75c)
          .setTitle("No Character Found")
          .setDescription(
            targetUser.id === interaction.user.id
              ? "You don't have a character yet!"
              : `${targetUser.username} doesn't have a character yet!`
          )
          .addFields({
            name: "Get Started",
            value:
              targetUser.id === interaction.user.id
                ? "Use `/start` to create your character and begin your adventure."
                : "Tell them to use `/start` to create a character and begin their adventure.",
          })
          .setFooter({ text: "Adventure awaits..." })
          .setTimestamp();

        await interaction.reply({
          embeds: [noProfileEmbed],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const nextlevel = getLevelProgress(user.level, user.xp);

      const memberSince = user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const classIcon = user.class ? classDetails[user.class].icon : "❓";
      const profileColor = user.class
        ? classDetails[user.class].color
        : DEFAULT_COLOR;

      const profileEmbed = new EmbedBuilder()
        .setColor(profileColor)
        .setTitle(`${classIcon} ${targetUser.username}'s Character`)
        .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
        .addFields(
          {
            name: "📊 Character Info",
            value:
              `**Class:** ${user.class || "Unselected"}\n` +
              `**Level:** ${user.level}\n` +
              `**XP:** ${user.xp}/${nextlevel.nextLevelXP} (${nextlevel.progressPercent}%)\n` +
              `**Gold:** ${user.money} 💰`,
            inline: false,
          },
          {
            name: "⚔️ Combat Stats",
            value:
              `**Health:** ${user.health}/${user.maxHealth} ❤️\n` +
              `**Attack:** ${user.attack} 🗡️\n` +
              `**Defense:** ${user.defense} 🛡️`,
            inline: true,
          },
          {
            name: "📜 Adventure Log",
            value: `Adventuring since: ${memberSince}`,
          }
        )
        .setFooter({
          text:
            targetUser.id === interaction.user.id
              ? "Use /help to see all available commands"
              : `Requested by ${interaction.user.username}`,
        })
        .setTimestamp();

      await interaction.reply({ embeds: [profileEmbed] });
    } catch (error) {
      console.error("Error in profile command:", error);
      await interaction.reply({
        content:
          "There was an error retrieving the profile. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
