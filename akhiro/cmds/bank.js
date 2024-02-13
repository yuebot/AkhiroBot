const utils = require("./bank/utils");

module.exports = {
  config: {
    name: "bank",
    description: "Manage your bank account.",
    usage: "bank [action] [amount]",
    author: "Rui",
    aliases: ["balance"],
  },
  onRun: async ({ api, event, args }) => {
    const userId = event.messageReply?.senderID || event.senderID;
    const action = args[0]?.toLowerCase();

    switch (action) {
      case "register":
        if (utils.registerUser(userId)) {
          api.sendMessage(`Successfully registered with the bank. You received $1000 freebies! Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
          utils.deposit(userId, 1000); // Give $1000 freebies
        } else {
          api.sendMessage("You are already registered with the bank.", event.threadID, event.messageID);
        }
        break;

      case "bal":
        api.sendMessage(`Your balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
        break;

      case "deposit":
        const depositAmount = parseInt(args[1]);
        if (isNaN(depositAmount)) {
          api.sendMessage("Invalid amount. Please provide a valid number.", event.threadID, event.messageID);
        } else {
          if (utils.deposit(userId, depositAmount)) {
            api.sendMessage(`Successfully deposited $${depositAmount} into your account. Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
          } else {
            api.sendMessage(`Failed to deposit. Make sure you are registered with \`${global.AkhiroBot.botPrefix}bank register\`.`, event.threadID, event.messageID);
          }
        }
        break;

      case "withdraw":
        const withdrawAmount = parseInt(args[1]);
        if (isNaN(withdrawAmount)) {
          api.sendMessage("Invalid amount. Please provide a valid number.", event.threadID, event.messageID);
        } else {
          if (utils.withdraw(userId, withdrawAmount)) {
            api.sendMessage(`Successfully withdrew $${withdrawAmount}. Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
          } else {
            api.sendMessage("Failed to withdraw. Make sure you have sufficient balance.", event.threadID, event.messageID);
          }
        }
        break;

      case "send":
        const receiverId = event.messageReply?.senderID || args[1];
        const sendAmount = parseInt(args[2]);
        if (isNaN(sendAmount) || !receiverId) {
          api.sendMessage("Invalid usage. Correct format: `$bank send [amount]` (Reply to a message for the recipient ID).", event.threadID, event.messageID);
        } else {
          if (utils.send(userId, receiverId, sendAmount)) {
            api.sendMessage(`Successfully sent $${sendAmount} to user ${receiverId}. Your new balance: $${utils.checkBalance(userId)}`, event.threadID, event.messageID);
          } else {
            api.sendMessage("Failed to send money. Make sure you have sufficient balance and the receiver is registered.", event.threadID, event.messageID);
          }
        }
        break;

      case "help":
        api.sendMessage(`Usage: ${global.AkhiroBot.botPrefix}bank [action] [amount]\n\nActions:\n- bal: Check your balance\n- deposit [amount]: Deposit money\n- withdraw [amount]: Withdraw money\n- send [amount]: Send money to another user (Reply to a message for the recipient ID)\n- register: Register with the bank and get $1000 freebies`, event.threadID, event.messageID);
        break;

      default:
        api.sendMessage(`Invalid action. Use \`${global.AkhiroBot.botPrefix}bank help\` to see available actions.`, event.threadID, event.messageID);
    }
  },
};