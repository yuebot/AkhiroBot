module.exports = {
  config: {
    name: "bank",
    description: "Manage your bank account",
    usage: "bank [check/deposit/withdraw] [amount]",
    author: "Rui",
    aliases: ["balance"],
  },
  onRun: async ({ api, event, args }) => {
    try {
      // Check if the user exists in the database
      const user = await utils.getUserById(event.senderID);

      if (user) {
        const subCommand = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);

        switch (subCommand) {
          case "check":
            api.sendMessage(`💰 | Your current balance: ${user.money} coins`, event.threadID, event.messageID);
            break;

          case "deposit":
            if (!isNaN(amount) && amount > 0) {
              if (user.money >= amount) {
                user.money -= amount;
                user.save();
                api.sendMessage(`💸 | Successfully deposited ${amount} coins into your bank account.`, event.threadID, event.messageID);
              } else {
                api.sendMessage(`❌ | Insufficient funds.`, event.threadID, event.messageID);
              }
            } else {
              api.sendMessage(`❌ | Invalid amount. Please provide a positive number.`, event.threadID, event.messageID);
            }
            break;

          case "withdraw":
            if (!isNaN(amount) && amount > 0) {
              user.money += amount;
              user.save();
              api.sendMessage(`💸 | Successfully withdrew ${amount} coins from your bank account.`, event.threadID, event.messageID);
            } else {
              api.sendMessage(`❌ | Invalid amount. Please provide a positive number.`, event.threadID, event.messageID);
            }
            break;

          default:
            api.sendMessage(`❌ | Invalid sub-command. Use \`${global.AkhiroBot.botPrefix}help bank\` for usage.`, event.threadID, event.messageID);
            break;
        }
      }
    } catch (error) {
      console.error(`❌ | ${error}`);
    }
  },
};