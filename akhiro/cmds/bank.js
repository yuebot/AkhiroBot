const utils = require("./bank/utils");

module.exports = {
  config: {
    name: "bank",
    description: "Manage your bank account.",
    usage: "bank [action] [amount]",
    author: "Rui",
    aliases: ["Bank"],
  },
  onRun: async ({ api, event, args, fonts }) => {
    const userId = event.messageReply?.senderID || event.senderID;
    const action = args[0]?.toLowerCase();

    switch (action) {
      case "register":
        if (utils.registerUser(userId)) {
          const balanceMessage = fonts.applyFonts(
            `Your Current Balance is: $${abbreviateNumber(
              utils.checkBalance(userId),
            )}`,
            "sans",
          );
          api.sendMessage(
            `${fonts.applyFonts(
              "🏦 | AKHIROBANK",
              "bold",
            )}\n━━━━━━━━━━━━━━━━━━━\nCongratulations! You have successfully registered with the bank. Here is your $10K freebie, Thanks for registry!\n\n ${balanceMessage}`,
            event.threadID,
            event.messageID,
          );
          utils.deposit(userId, 10000); // Give $10K freebies
        } else {
          api.sendMessage(
            `${fonts.applyFonts(
              "🏦 | AKHIROBANK",
              "bold",
            )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
              "❌ | You are already registered on AkhiroBank.",
              "sans",
            )}`,
            event.threadID,
            event.messageID,
          );
        }
        break;

      case "bal":
        const balanceMessage = fonts.applyFonts(
          `Your balance: $${abbreviateNumber(utils.checkBalance(userId))}`,
          "sans",
        );
        api.sendMessage(
          `${fonts.applyFonts(
            "💰 | BANK BALANCE",
            "bold",
          )}\n━━━━━━━━━━━━━━━━━━━\n${balanceMessage}`,
          event.threadID,
          event.messageID,
        );
        break;

      case "deposit":
        const depositAmount = parseInt(args[1]);
        if (isNaN(depositAmount)) {
          api.sendMessage(
            `${fonts.applyFonts(
              "🏦 | AKHIROBANK",
              "bold",
            )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
              "❌ | Invalid amount. Please provide a valid number.",
              "sans",
            )}`,
            event.threadID,
            event.messageID,
          );
        } else {
          if (utils.deposit(userId, depositAmount)) {
            const newBalanceMessage = fonts.applyFonts(
              `Your new balance: $${abbreviateNumber(
                utils.checkBalance(userId),
              )}`,
              "sans",
            );
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | AKHIROBANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
                `✅ | Successfully deposited $${abbreviateNumber(
                  depositAmount,
                )}. ${newBalanceMessage}`,
                "sans",
              )}`,
              event.threadID,
              event.messageID,
            );
          } else {
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | AKHIROBANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
                "❌ | Failed to deposit. Make sure the amount is positive.",
                "sans",
              )}`,
              event.threadID,
              event.messageID,
            );
          }
        }
        break;

      case "withdraw":
        const withdrawAmount = parseInt(args[1]);
        if (isNaN(withdrawAmount)) {
          api.sendMessage(
            `${fonts.applyFonts(
              "🏦 | AKHIROBANK",
              "bold",
            )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
              "❌ | Invalid amount. Please provide a valid number.",
              "sans",
            )}`,
            event.threadID,
            event.messageID,
          );
        } else {
          if (utils.withdraw(userId, withdrawAmount)) {
            const newBalanceMessage = fonts.applyFonts(
              `Your new balance: $${abbreviateNumber(
                utils.checkBalance(userId),
              )}`,
              "sans",
            );
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | AKHIROBANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
                `✅ | Successfully withdrew $${abbreviateNumber(
                  withdrawAmount,
                )}. ${newBalanceMessage}`,
                "sans",
              )}`,
              event.threadID,
              event.messageID,
            );
          } else {
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | AKHIROBANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
                "❌ | Failed to withdraw. Make sure you have sufficient balance.",
                "sans",
              )}`,
              event.threadID,
              event.messageID,
            );
          }
        }
        break;

      case "send":
        const receiverId = event.messageReply?.senderID || args[1];
        const sendAmount = parseInt(args[2]);
        if (isNaN(sendAmount) || !receiverId) {
          api.sendMessage(
            `${fonts.applyFonts(
              "🏦 | AKHIROBANK",
              "bold",
            )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
              "❌ | Invalid usage. Correct format: `$bank send [amount]` (Reply to a message for the recipient ID).",
              "sans",
            )}`,
            event.threadID,
            event.messageID,
          );
        } else {
          if (utils.send(userId, receiverId, sendAmount)) {
            const newBalanceMessage = fonts.applyFonts(
              `Your new balance: $${abbreviateNumber(
                utils.checkBalance(userId),
              )}`,
              "sans",
            );
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | AKHIROBANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
                `✅ | Successfully sent $${abbreviateNumber(
                  sendAmount,
                )} to user ${receiverId}. ${newBalanceMessage}`,
                "sans",
              )}`,
              event.threadID,
              event.messageID,
            );
          } else {
            api.sendMessage(
              `${fonts.applyFonts(
                "🏦 | BANK",
                "bold",
              )}\n━━━━━━━━━━━━━━━━━━━\n❌ | Failed to send money. Make sure you have sufficient balance and the receiver is registered.`,
              event.threadID,
              event.messageID,
            );
          }
        }
        break;

      case "help":
        api.sendMessage(
          `${fonts.applyFonts(
            "🏦 | BANK",
            "bold",
          )}\n━━━━━━━━━━━━━━━━━━━\n𝖧𝖾𝗅𝗅𝗈 𝗍𝗁𝖾𝗋𝖾 𝗎𝗌𝖾𝗋, 𝖶𝖾𝗅𝖼𝗈𝗆𝖾 𝗍𝗈 𝗍𝗁𝖾 𝖠𝗄𝗁𝗂𝗋𝗈𝖡𝖺𝗇𝗄 𝖲𝖾𝗋𝗏𝖾𝗋, 𝖧𝖾𝗋𝖾 𝖺𝗋𝖾 𝗍𝗁𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗎𝗌𝖺𝗀𝖾 𝗈𝗇 𝗎𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖠𝗄𝗁𝗂𝗋𝗈𝖡𝖺𝗇𝗄.\n✯ 𝖡𝖺𝗇𝗄 𝖻𝖺𝗅𝖺𝗇𝖼𝖾\n✯ 𝖡𝖺𝗇𝗄 𝖽𝖾𝗉𝗈𝗌𝗂𝗍\n✯ 𝖡𝖺𝗇𝗄 𝗐𝗂𝗍𝗁𝖽𝗋𝖺𝗐\n𝖡𝖺𝗇𝗄 𝗍𝗋𝖺𝗇𝗌𝖿𝖾𝗋\n✯ 𝖡𝖺𝗇𝗄 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋\n✯ 𝖡𝖺𝗇𝗄 𝗋𝗍𝗈𝗉\n𝗨𝗦𝗔𝗚𝗘: ${
            global.AkhiroBot.botPrefix
          }bank [action] [amount]`,
          event.threadID,
          event.messageID,
        );
        break;

      case "top":
        const bankData = utils.readBankFile();
        const topEntries = Object.entries(bankData)
          .sort(([, a], [, b]) => b.balance - a.balance)
          .slice(0, 10);

        const topMessage = await Promise.all(
          topEntries.map(async ([uid, { balance }], index) => {
            const userInfo = await api.getUserInfo(uid);
            const userName = userInfo[uid]?.name || "Unknown";
            return `${index + 1}. ╭┈ ❒ 👤 | 𝗨𝗦𝗘𝗥: ${userName}
    ╰┈➤ 💰 | 𝗕𝗔𝗟𝗔𝗡𝗖𝗘: $${abbreviateNumber(balance)}`;
          }),
        );

        api.sendMessage(
          `${fonts.applyFonts(
            "TOP 10 RICHEST USER'S\n━━━━━━━━━━━━━━━\n",
            "bold",
          )}\n${topMessage.join("\n\n")}`,
          event.threadID,
          event.messageID,
        );
        break;

      // ... (previous code)

      case "interest":
        const interestRate = 0.05; // You can adjust the interest rate as needed
        const balanceBefore = utils.checkBalance(userId);
        const interestAmount = balanceBefore * interestRate;
        utils.deposit(userId, interestAmount);
        const newBalanceAfterInterest = utils.checkBalance(userId);
        api.sendMessage(
          `${fonts.applyFonts(
            "🏦 | AKHIROBANK",
            "bold",
          )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
            `✨ | Interest Added: $${abbreviateNumber(
              interestAmount,
            )}. Your new balance: $${abbreviateNumber(
              newBalanceAfterInterest,
            )}.`,
            "sans",
          )}`,
          event.threadID,
          event.messageID,
        );
        break;

      case "reset":
        // Implement logic to reset user's balance or any other data as needed
        api.sendMessage(
          `${fonts.applyFonts(
            "🏦 | AKHIROBANK",
            "bold",
          )}\n━━━━━━━━━━━━━━━━━━━\n${fonts.applyFonts(
            "🔄 | Reset Successful. Your balance is reset.",
            "sans",
          )}`,
          event.threadID,
          event.messageID,
        );
        break;

      // Add more cases as needed...

      // ... (remaining code)

      default:
        api.sendMessage(
          `${fonts.applyFonts(
            "🏦 | BANK ━━━━━━━━━━━━━━━━━━━",
            "bold",
          )} Invalid Usage, Please Use\`${
            global.AkhiroBot.botPrefix
          }bank help\` ${fonts.applyFonts(
            "to see available actions.",
            "sans",
          )}`,
          event.threadID,
          event.messageID,
        );
    }
  },
};

function abbreviateNumber(number) {
  const SI_SYMBOL = [
    "",
    "k",
    "M",
    "B",
    "T",
    "Q",
    "Qd",
    "Qt",
    "Quintqt",
    "Sextqt",
    "Septqt",
    "Octqt",
    "Nonqt",
  ];

  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier >= SI_SYMBOL.length) {
    // Beyond current supported abbreviations
    return number.toExponential(2);
  }

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  const scaledNumber = number / scale;

  // Use toFixed(2) to round to 2 decimal places
  return scaledNumber.toFixed(2) + suffix;
}
