import Discord from "discord.js";
import cleverbot from "cleverbot-free";
import { parse } from "discord-command-parser";
import * as sql from "./sql";
import AskPrismarine from "./AskPrismarine";
import cron from "node-cron";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.on("ready", () => {
  console.log("Bot ready");
  cron.schedule("15 17 * * *", async () => {
    const channel = client.channels.cache.get("738645672085159946");
    const i = new AskPrismarine();
    await i.fetch();
    return channel.send(i.format(i.random()));
  });
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.mentions.members.has(client.user.id)) {
    const msg = message.content.replace(/<@(.*?)>/, "").trim();
    message.channel.startTyping();
    const res = await cleverbot(msg);
    message.channel.stopTyping();
    message.reply(res);
  }
  const parsed = parse(message, "!", { allowSpaceBeforeCommand: true });
  if (!parsed.success) return;
  if (parsed.command === "askprismarine") {
    const i = new AskPrismarine();
    await i.fetch();
    return message.reply(i.format(i.random()));
  }
  const tag = await sql.getTag(parsed.command);

  if (!tag) return message.reply("No such tag");
  else {
    return message.reply(new Discord.MessageEmbed(JSON.parse(tag.data)));
  }
});

client.login(process.env.PJS_TOKEN);
