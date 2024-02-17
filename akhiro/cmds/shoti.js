const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "shoti",
    description: "Get a random Shoti video.",
    usage: "shoti",
    author: "Rui | Liby",
    aliases: ["shoti"],
    role: 1, // Only for admins
  },
  onRun: async ({ api, event }) => {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get(`https://wifey-shoti.onrender.com/kshitiz`, { responseType: "stream" });

      const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);

      const writer = fs.createWriteStream(tempVideoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);

        api.sendMessage({
          body: `Random Wifey Vidoes.`,
          attachment: stream,
        }, event.threadID, event.messageID);

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID, event.messageID);
    }
  },
};