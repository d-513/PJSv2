import Discord from "discord.js";
import cleverbot from "cleverbot-free";
import AskPrismarine from "./AskPrismarine";
import cron from "node-cron";
import geeksay from "geeksay";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.on("ready", () => {
  console.log("Bot ready");
  cron.schedule("15 17 * * *", async () => {
    const channel = client.channels.cache.get("519952494768685086");
    const i = new AskPrismarine();
    await i.fetch();
    return channel.send(i.format(i.random()));
  });
});

client.on("message", async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.content.trim().startsWith("geeksay ")) {
    const content = message.content.trim().slice("geeksay ".length);
    return message.reply(geeksay(content));
  } else if (message.content.startsWith("!askprismarine")) {
    const i = new AskPrismarine();
    await i.fetch();
    return message.reply(i.format(i.random(), client.user));
  } else if (message.mentions.members.has(client.user.id)) {
    const msg = message.content.replace(/<@(.*?)>/, "").trim();
    message.channel.startTyping();
    const res = await cleverbot(msg);
    message.channel.stopTyping();
    message.reply(res);
  }
});

client.login(process.env.PJS_TOKEN);
