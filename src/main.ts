import "./misc/logs";

import { Client, Events, ActivityType, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { CommandManager } from "./managers/cmd.manager";

dotenv.config();

const commandManager = new CommandManager();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, async (ctx) => {
  console.log(`${client.user?.username} is ready!`);
  commandManager.registerCommands();
  commandManager.deployCommands();
  client.user?.setActivity("/help | j1r4.vercel.app", {
    type: ActivityType.Watching,
  });
  console.log("Successfully finished startup");
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  commandManager.executeCommand(interaction);
});

client.login(process.env.DISCORD_TOKEN);
