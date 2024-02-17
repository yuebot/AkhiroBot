const utils = require("./bank/utils");

const flipHistory = [];

module.exports = {
  config: {
    name: "flip",
    description: "Flip a coin and bet on heads or tails.",
    usage: "flip [heads/tails/view/history] [amount]",
    author: "Rui Reogo (ruingl)",
    aliases: ["coinflip"],
  },
  onRun: async ({ api, event, args, fonts }) => {
    const userId = event.senderID;
    const validActions = ["heads", "tails", "view", "history"];
    const selectedAction = args[0]?.toLowerCase();
    const betAmount = parseInt(args[1]);

    if (
      !validActions.includes(selectedAction) ||
      (selectedAction !== "view" && isNaN(betAmount)) ||
      (selectedAction !== "view" && betAmount <= 0)
    ) {
      api.sendMessage(
        `${fonts.applyFonts("❌ | Invalid usage.", "bold")} Correct format: \`${
          global.AkhiroBot.botPrefix
        }flip [heads/tails/view/history] [amount]\``,
        event.threadID,
        event.messageID,
      );
      return;
    }

    if (selectedAction === "view") {
      const userBalance = utils.checkBalance(userId);
      api.sendMessage(
        `${fonts.applyFonts(
          "💰 | Current Balance",
          "bold",
        )}\n━━━━━━━━━━━━━━\nYour balance: $${userBalance}`,
        event.threadID,
        event.messageID,
      );
      return;
    }

    if (selectedAction === "history") {
      const historyMessage =
        flipHistory.length > 0
          ? flipHistory
              .map(
                (flip) =>
                  `${flip.result === "win" ? "Won" : "Lost"} $${flip.amount}`,
              )
              .join("\n")
          : "No flip history yet.";
      api.sendMessage(
        `${fonts.applyFonts(
          "🔄 | Flip History",
          "bold",
        )}\n━━━━━━━━━━━━━━\n${historyMessage}`,
        event.threadID,
        event.messageID,
      );
      return;
    }

    const userBalance = utils.checkBalance(userId);

    if (selectedAction !== "view" && userBalance < betAmount) {
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

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const isWin = result === selectedAction;

    if (isWin) {
      utils.withdraw(userId, betAmount);
      api.sendMessage(
        `${fonts.applyFonts(
          "🎉 | Congratulations!",
          "bold",
        )}\n━━━━━━━━━━━━━━\nYou guessed correctly and won $${betAmount}. Your new balance: $${utils.checkBalance(
          userId,
        )}`,
        event.threadID,
        event.messageID,
      );
      flipHistory.push({ result: "win", amount: betAmount });
    } else {
      utils.deposit(userId, betAmount);
      api.sendMessage(
        `${fonts.applyFonts(
          "😢 | Sorry!",
          "bold",
        )}\n━━━━━━━━━━━━━━\nYou guessed wrong and lost $${betAmount}. Your new balance: $${utils.checkBalance(
          userId,
        )}`,
        event.threadID,
        event.messageID,
      );
      flipHistory.push({ result: "lost", amount: betAmount });
    }
  },
};
