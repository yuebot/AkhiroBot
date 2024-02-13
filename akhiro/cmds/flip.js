module.exports = {
  config: {
    name: "flip",
    description: "Flip a virtual coin",
    usage: "flip",
    author: "Rui",
    aliases: ["coin"],
  },
  onRun: ({ api, event }) => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    api.sendMessage(`🪙 It's ${result}!`, event.threadID, event.messageID);
  },
};