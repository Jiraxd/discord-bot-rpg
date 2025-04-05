import { CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "../managers/cmd.manager";
import { getUser } from "../database/user.manager";
import { getNoProfileEmbed } from "../misc/utils";

export const body: Command = {
  name: "explore",
  description:
    "Allows you to enter the explore mode. You can explore maps and find items. You cannot explore during quest.",
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
      await interaction.reply({
        content: "You cannot explore while on a quest.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  },
};
