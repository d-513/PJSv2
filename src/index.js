import Discord from "discord.js";
import cleverbot from "cleverbot-free";
import AskPrismarine from "./AskPrismarine";
import cron from "node-cron";
import rooms from "../rooms.json";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";
import * as toxicity from "@tensorflow-models/toxicity";

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
  if (message.author.id === client.user.id) return;
  if (message.author.bot && rooms.includes(message.channel.id)) {
    // toxicity filter
    const threshold = 0.9;
    const model = await toxicity.load(threshold);
    const results = await model.classify([message.content]);
    if (results.length === 0) return;
    let toxic = false;
    results.forEach((classification) => {
      if (classification.results[0].match === true) {
        toxic = true;
      }
    });
    if (toxic) message.react("🤡");
  }
  if (message.mentions.members.has(client.user.id)) {
    const msg = message.content.replace(/<@(.*?)>/, "").trim();
    message.channel.startTyping();
    const res = await cleverbot(msg);
    message.channel.stopTyping();
    message.reply(res);
  }
});

client.login(process.env.PJS_TOKEN);
