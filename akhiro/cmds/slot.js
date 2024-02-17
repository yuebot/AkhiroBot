const utils = require("./bank/utils");

module.exports = {
  config: {
    name: "slot",
    description: "Play the slot machine and try your luck.",
    usage: "slot [amount]",
    author: "Rui Reogo (ruingl)",
    aliases: ["slots"],
  },
  onRun: async ({ api, event, args, fonts }) => {
    const userId = event.senderID;
    const betAmount = parseInt(args[0]);

    if (isNaN(betAmount) || betAmount <= 0) {
      api.sendMessage(
        `${fonts.applyFonts(
          "❌ | Invalid Bet",
          "bold",
        )}\n━━━━━━━━━━━━━━\nPlease provide a valid bet amount.`,
        event.threadID,
        event.messageID,
      );
      return;
    }

    const userBalance = utils.checkBalance(userId);

    if (userBalance < betAmount) {
      api.sendMessage(
        `${fonts.applyFonts(
          "❌ | Insufficient Funds",
          "bold",
        )}\n━━━━━━━━━━━━━━\nPlease deposit more money to your bank account.`,
        event.threadID,
        event.messageID,
      );
      return;
    }

    const slotSymbols = ["🍒", "🍊", "🍇", "🔔", "💰", "🍋", "🍎", "🍓", "🍏"];

    const spinResults = [];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * slotSymbols.length);
      spinResults.push(slotSymbols[randomIndex]);
    }

    const isWin = spinResults.every((symbol) => symbol === spinResults[0]);

    if (isWin) {
      const winAmount = betAmount * 5;
      utils.withdraw(userId, betAmount);
      utils.deposit(userId, winAmount);

      api.sendMessage(
        `${fonts.applyFonts(
          "🎉 | Jackpot!",
          "bold",
        )}\n━━━━━━━━━━━━━━\n${spinResults.join(
          " ",
        )}\n\nCongratulations! You won $${winAmount}. Your new balance: $${utils.checkBalance(
          userId,
        )}`,
        event.threadID,
        event.messageID,
      );
    } else {
      utils.withdraw(userId, betAmount);

      api.sendMessage(
        `${fonts.applyFonts(
          "😢 | Better Luck Next Time",
          "bold",
        )}\n━━━━━━━━━━━━━━\n${spinResults.join(
          " ",
        )}\n\nSorry, you didn't win anything. Your new balance: $${utils.checkBalance(
          userId,
        )}`,
        event.threadID,
        event.messageID,
      );
    }
  },
};
