const utils = require("./bank/utils");

module.exports = {
  config: {
    name: "flip",
    description: "Flip a coin and bet on heads or tails.",
    usage: "flip [heads/tails] [amount]",
    author: "Rui",
    aliases: ["coinflip"],
  },
  onRun: async ({ api, event, args }) => {
    const userId = event.senderID;
    const validSides = ["heads", "tails"];
    const selectedSide = args[0]?.toLowerCase();
    const betAmount = parseInt(args[1]);

    if (!validSides.includes(selectedSide) || isNaN(betAmount) || betAmount <= 0) {
      api.sendMessage("Invalid usage. Correct format: `$flip [heads/tails] [amount]`", event.threadID, event.messageID);
      return;
    }

    const userBalance = utils.checkBalance(userId);

    if (userBalance < betAmount) {
      api.sendMessage("Insufficient funds. Please deposit more money to your bank account.", event.threadID, event.messageID);
      return;
    }

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const isWin = result === selectedSide;

    if (isWin) {
      utils.withdraw(userId, betAmount);
      api.sendMessage(`Sorry, you guessed wrong. You lost $${betAmount}. Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
    } else {
      utils.deposit(userId, betAmount);
      api.sendMessage(`Congratulations! You guessed correctly and won $${betAmount}. Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
    }
  },
};