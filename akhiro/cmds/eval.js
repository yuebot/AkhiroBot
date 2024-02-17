const fs = require("fs");
const bank = require("./bank/utils");

module.exports = {
  config: {
    name: "eval",
    description: "Executes the provided JavaScript code",
    usage: "eval <code>",
    author: "LiANE",
    role: 1,
  },
  onRun: async ({ api, event }) => {
    try {
      const adminList = global.AkhiroBot.botAdmins;

      if (!adminList.includes(event.senderID)) {
        api.sendMessage(
          "You do not have permission to use this command.",
          event.threadID,
          event.messageID,
        );
        return;
      }

      const args = event.body.split(" ");
      const code = args.slice(1).join(" ");
      eval(code);
    } catch (error) {
      api.sendMessage(
        `🔥 | Oops! An error occurred:\nError: ${error.message}`,
        event.threadID,
        event.messageID,
      );
    }
  },
};
