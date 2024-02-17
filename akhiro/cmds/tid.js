module.exports = {
  config: {
    name: "tid",
    description: "Get the thread ID of the current chat",
    usage: "tid",
    author: "Rui",
    aliases: ["threadid", "chatid"],
  },
  onRun: async ({ api, event }) => {
    try {
      const threadID = event.threadID;
      api.sendMessage(`Thread ID: \`${threadID}\``, threadID, event.messageID);
    } catch (error) {
      console.error("Error occurred in tid command:", error);
      api.sendMessage(
        "❌ | Error occurred while processing the tid command.",
        event.threadID,
        event.messageID,
      );
    }
  },
};
