import Discord from "discord.js";
import cleverbot from "cleverbot-free";
import { parse } from "discord-command-parser";
import * as sql from "./sql";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.on("ready", () => {
  console.log("Bot ready");
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.mentions.members.has(client.user.id)) {
    const msg = message.content.replace(/<@(.*?)>/, "").trim();
    const res = await cleverbot(msg);
    return message.reply(res + "\n*this is an AI response. its a dumb ai*");
  }
  const parsed = parse(message, "!", { allowSpaceBeforeCommand: true });
  if (!parsed.success) return;
  const tag = await sql.getTag(parsed.command);
  if (!tag) return message.reply("No such tag");
  else {
    return message.reply(new Discord.MessageEmbed(JSON.parse(tag.data)));
  }
});

client.login(process.env.PJS_TOKEN);
