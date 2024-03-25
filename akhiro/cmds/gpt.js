const axios = require('axios');

module.exports = {
  config: {
    name: "gpt",
    role: 0,
    aliases: ["chatgpt"],
    author: "AkhiroDEV",
    usage: "gpt [ query ]"
  },
  onRun: async ({ args, api, fonts, event }) => {
    try {
      const query = args.join("");
      api.sendMessage("⏳ | 𝗔𝗜 𝗂𝗌 𝖺𝗇𝗌𝗐𝖾𝗋𝗂𝗇𝗀, 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍....", event.senderID, event.threadID);
      api.setMessageReaction("⏳", event.messageID);

      const response = await axios.get(`lianeapi.onrender.com/ask/gpt?query=${query}`);
      const message = response.data.message || "ℹ️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗊𝗎𝖾𝗋𝗒.";
      api.sendMessage({ body: message }, event.threadID);
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage({ body: "Sorry, an error occurred while processing your request." }, event.threadID);
    }
  }
};
