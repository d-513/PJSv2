import { MessageEmbed } from "discord.js";
import fs from "fs-extra";

class AskPrismarine {
  constructor() {}

  async fetch() {
    const f = await fs.readFile("./askprismarine.txt", "utf8");
    this.questions = f.split(";");
    this.questions = this.questions.filter((q) => {
      return q.trim().length < 1 ? false : true;
    });
    return;
  }

  random() {
    return this.questions[Math.floor(Math.random() * this.questions.length)];
  }

  format(q) {
    const e = new MessageEmbed()
      .setTitle("AskPrismarine")
      .setColor("GREEN")
      .setDescription(q.trim());
    return e;
  }
}

export default AskPrismarine;
