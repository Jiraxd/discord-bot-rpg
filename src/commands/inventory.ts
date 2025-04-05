import { CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "../managers/cmd.manager";
import { getUser } from "../database/user.manager";
import { getNoProfileEmbed } from "../misc/utils";

export const body: Command = {
  name: "inventory",
  description: "View your inventory",
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
  },
};
