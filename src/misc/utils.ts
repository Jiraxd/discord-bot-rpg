import { CharacterClass } from "@prisma/client";
import { CommandInteraction, EmbedBuilder, User } from "discord.js";

export const classDetails = {
  [CharacterClass.MAGE]: { icon: "🧙", color: 0x5865f2 },
  [CharacterClass.WARRIOR]: { icon: "⚔️", color: 0xed4245 },
  [CharacterClass.ARCHER]: { icon: "🏹", color: 0x57f287 },
};

export function getRequiredXP(currentLevel: number): number {
  if (currentLevel < 1) return 100;
  if (currentLevel >= 100) return Infinity;

  if (currentLevel < 10) {
    return 100 + currentLevel * 25;
  }

  if (currentLevel < 30) {
    return 350 + Math.floor(Math.pow(currentLevel, 1.5) * 10);
  }

  if (currentLevel < 60) {
    return 1000 + Math.floor(Math.pow(currentLevel, 1.8) * 15);
  }

  return 5000 + Math.floor(Math.pow(currentLevel, 2.2) * 20);
}

export function getLevelProgress(
  currentLevel: number,
  currentXP: number
): {
  nextLevelXP: number;
  remainingXP: number;
  progressPercent: number;
} {
  const nextLevelXP = getRequiredXP(currentLevel);
  const remainingXP = Math.max(0, nextLevelXP - currentXP);
  const progressPercent = Math.min(
    Math.floor((currentXP / nextLevelXP) * 100),
    100
  );

  return {
    nextLevelXP,
    remainingXP,
    progressPercent,
  };
}

export function getNoProfileEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xfee75c)
    .setTitle("No Character Found")
    .setDescription("You don't have a character yet!")
    .addFields({
      name: "Get Started",
      value: "Use `/start` to create your character and begin your adventure.",
    })
    .setFooter({ text: "Adventure awaits..." })
    .setTimestamp();
}
