module.exports = {
  config: {
    name: "unsend",
    description: "Unsend the last message sent by the bot",
    usage: "unsend",
    author: "Rui",
    aliases: ["delete", "undo"],
  },
  onRun: async ({ api, event }) => {
    try {
      if (event.messageReply.senderID !== api.getCurrentUserID()) {
        return api.sendMessage("❌ | I can't unsend messages from other users.", event.threadID, event.messageID);
      }

      if (event.type !== "message_reply") {
        return api.sendMessage("❌ | Reply to a bot message to use the unsend command.", event.threadID, event.messageID);
      }

      api.unsendMessage(event.messageReply.messageID, (err) => {
        if (err) {
          return api.sendMessage("❌ | Something went wrong while unsending the message.", event.threadID, event.messageID);
        }
        // Message successfully unsent
      });
    } catch (error) {
      console.error("Error occurred in unsend command:", error);
      api.sendMessage("❌ | Error occurred while processing the unsend command.", event.threadID, event.messageID);
    }
  },
};