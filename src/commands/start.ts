import {
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
} from "discord.js";
import { Command } from "../managers/cmd.manager";
import prisma from "../misc/db";
import { CharacterClass } from "@prisma/client";
import { getUser } from "../database/user.manager";

const classStats = {
  [CharacterClass.MAGE]: {
    health: 80,
    maxHealth: 80,
    attack: 15,
    defense: 3,
    description:
      "Mages are masters of arcane magic, capable of devastating spells but physically fragile.",
  },
  [CharacterClass.WARRIOR]: {
    health: 120,
    maxHealth: 120,
    attack: 10,
    defense: 8,
    description:
      "Warriors are frontline fighters with high health and defense, capable of absorbing damage.",
  },
  [CharacterClass.ARCHER]: {
    health: 90,
    maxHealth: 90,
    attack: 12,
    defense: 5,
    description:
      "Archers excel at ranged combat, balancing moderate health with good damage output.",
  },
};

export const body: Command = {
  name: "start",
  description: "Start your adventure by creating a new character",
  parameters: [],
  execute: async (interaction: CommandInteraction) => {
    try {
      const userExists = await getUser(interaction.user.id);

      if (userExists) {
        const alreadyStartedEmbed = new EmbedBuilder()
          .setColor(0xf0ad4e)
          .setTitle("You're Already on an Adventure!")
          .setDescription("You already have a character in this world.")
          .addFields(
            {
              name: "What Now?",
              value:
                "Use `/profile` to view your character stats and progress.",
            },
            {
              name: "Need Help?",
              value:
                "Use `/help` to see all available commands and game guides.",
            }
          )
          .setFooter({ text: "Your adventure continues..." })
          .setTimestamp();

        await interaction.reply({
          embeds: [alreadyStartedEmbed],
          ephemeral: true,
        });
        return;
      }

      const classSelectionEmbed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("Choose Your Class")
        .setDescription(
          "Select a class to begin your adventure. Each class has unique strengths and abilities."
        )
        .addFields(
          {
            name: "🧙 Mage",
            value: classStats[CharacterClass.MAGE].description,
            inline: false,
          },
          {
            name: "⚔️ Warrior",
            value: classStats[CharacterClass.WARRIOR].description,
            inline: false,
          },
          {
            name: "🏹 Archer",
            value: classStats[CharacterClass.ARCHER].description,
            inline: false,
          }
        )
        .setFooter({
          text: "Your choice will determine your starting stats and ability tree",
        })
        .setTimestamp();

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("class_MAGE")
          .setLabel("Mage")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🧙"),
        new ButtonBuilder()
          .setCustomId("class_WARRIOR")
          .setLabel("Warrior")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⚔️"),
        new ButtonBuilder()
          .setCustomId("class_ARCHER")
          .setLabel("Archer")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🏹")
      );

      const response = await interaction.reply({
        embeds: [classSelectionEmbed],
        components: [buttons],
        fetchReply: true,
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", async (i: ButtonInteraction) => {
        if (i.user.id !== interaction.user.id) {
          await i.reply({
            content: "This character creation is not for you!",
            ephemeral: true,
          });
          return;
        }

        const classChoice = i.customId.split("_")[1] as CharacterClass;

        const newUser = await prisma.user.create({
          data: {
            id: interaction.user.id,
            class: classChoice,
            health: classStats[classChoice].health,
            maxHealth: classStats[classChoice].maxHealth,
            attack: classStats[classChoice].attack,
            defense: classStats[classChoice].defense,
          },
        });

        const welcomeEmbed = new EmbedBuilder()
          .setColor(0x57f287)
          .setTitle("Your Adventure Begins!")
          .setDescription(
            `Welcome, <@${
              interaction.user.id
            }>! Your ${classChoice.toLowerCase()} is ready for adventure.`
          )
          .addFields(
            { name: "🧩 Class", value: classChoice, inline: true },
            {
              name: "💰 Starting Gold",
              value: `${newUser.money} gold`,
              inline: true,
            },
            {
              name: "❤️ Health",
              value: `${newUser.health}/${newUser.maxHealth}`,
              inline: true,
            },
            { name: "⚔️ Attack", value: `${newUser.attack}`, inline: true },
            { name: "🛡️ Defense", value: `${newUser.defense}`, inline: true },
            {
              name: "📊 Level",
              value: `${newUser.level} (${newUser.xp} XP)`,
              inline: true,
            },
            {
              name: "Next Steps",
              value:
                "• Use `/profile` to check your stats anytime\n• Use `/help` for a list of all commands\n• Start exploring to find treasures and battle monsters!",
            }
          )
          .setFooter({ text: "May fortune favor your journey!" })
          .setTimestamp();

        await i.update({ embeds: [welcomeEmbed], components: [] });

        console.log(
          `New ${classChoice} character created for user ${interaction.user.tag} (${interaction.user.id})`
        );
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          try {
            await interaction.editReply({
              content:
                "Character creation timed out. Please try again with `/start`.",
              components: [],
            });
          } catch (error) {
            console.error("Error removing buttons:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error in start command:", error);
      await interaction.reply({
        content:
          "There was an error creating your character. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
