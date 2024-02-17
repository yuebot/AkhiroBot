module.exports = {
  config: {
    name: "uid",
    description:
      "Get your user ID or the user ID of the replied message sender",
    usage: "uid [optional: reply to a message]",
    author: "Rui",
    aliases: ["userid", "myid"],
  },
  onRun: async ({ api, event }) => {
    try {
      const targetUserID = event.messageReply
        ? event.messageReply.senderID
        : event.senderID;
      api.sendMessage(
        `User ID: \`${targetUserID}\``,
        event.threadID,
        event.messageID,
      );
    } catch (error) {
      console.error("Error occurred in uid command:", error);
      api.sendMessage(
        "❌ | Error occurred while processing the uid command.",
        event.threadID,
        event.messageID,
      );
    }
  },
};
