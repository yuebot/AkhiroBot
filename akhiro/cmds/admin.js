const path = require("path");
const fs = require("fs-extra");
const configPath = path.join(process.cwd(), "akhiro_config.json");

const config = require(configPath);

module.exports = {
  config: {
    name: "admin",
    description: "Manage admin roles",
    usage: "admin [list/add/remove/help]",
    author: "Rui",
    role: 1,
    aliases: ["Admin"],
  },
  onRun: async ({ api, event, args, fonts }) => {
    const command = args[0]?.toLowerCase();

    switch (command) {
      case "list":
        const admins = config.botAdmins;
        let adminListMessage = `${fonts.applyFonts(
          "👑 | Admin List",
          "bold",
        )}\n━━━━━━━━━━━━━━\n`;
        for (const adminId of admins) {
          const userInfo = await api.getUserInfo(adminId);
          const adminName = userInfo[adminId]?.name || "Unknown";
          adminListMessage += `➤ ${adminName}\n`;
        }
        api.sendMessage(adminListMessage, event.threadID, event.messageID);
        break;

      case "add":
        const addAdminId = event.messageReply?.senderID || args[1];
        if (addAdminId) {
          if (!config.botAdmins.includes(addAdminId)) {
            config.botAdmins.push(addAdminId);
            // Save the updated config to the file
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            api.sendMessage(
              `${fonts.applyFonts(
                "👑 | Admin Added",
                "bold",
              )}\n━━━━━━━━━━━━━━\nSuccessfully added admin.`,
              event.threadID,
              event.messageID,
            );
          } else {
            api.sendMessage(
              `${fonts.applyFonts(
                "👑 | Admin Add",
                "bold",
              )}\n━━━━━━━━━━━━━━\nThis user is already an admin.`,
              event.threadID,
              event.messageID,
            );
          }
        } else {
          api.sendMessage(
            `${fonts.applyFonts(
              "❌ | Admin Add",
              "bold",
            )}\n━━━━━━━━━━━━━━\nPlease provide a valid user to add as an admin.`,
            event.threadID,
            event.messageID,
          );
        }
        break;

      case "remove":
        const removeAdminId = event.messageReply?.senderID || args[1];
        if (removeAdminId) {
          const adminIndex = config.botAdmins.indexOf(removeAdminId);
          if (adminIndex !== -1) {
            config.botAdmins.splice(adminIndex, 1);
            // Save the updated config to the file
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            api.sendMessage(
              `${fonts.applyFonts(
                "👑 | Admin Removed",
                "bold",
              )}\n━━━━━━━━━━━━━━\nSuccessfully removed admin.`,
              event.threadID,
              event.messageID,
            );
          } else {
            api.sendMessage(
              `${fonts.applyFonts(
                "❌ | Admin Remove",
                "bold",
              )}\n━━━━━━━━━━━━━━\nThis user is not an admin.`,
              event.threadID,
              event.messageID,
            );
          }
        } else {
          api.sendMessage(
            `${fonts.applyFonts(
              "❌ | Admin Remove",
              "bold",
            )}\n━━━━━━━━━━━━━━\nPlease provide a valid user to remove from admin.`,
            event.threadID,
            event.messageID,
          );
        }
        break;

      case "help":
        api.sendMessage(
          `${fonts.applyFonts(
            "👑 | Admin Commands",
            "bold",
          )}\n━━━━━━━━━━━━━━\nUsage: ${
            config.botPrefix
          }admin [list/add/remove/help]\n\nCommands:\n- list: List all admins\n- add: Add an admin (Reply to a message for the user ID)\n- remove: Remove an admin (Reply to a message for the user ID)\n- help: Show this help message`,
          event.threadID,
          event.messageID,
        );
        break;

      default:
        api.sendMessage(
          `${fonts.applyFonts(
            "❌ | Admin Command",
            "bold",
          )}\n━━━━━━━━━━━━━━\nInvalid admin command. Use \`${
            config.botPrefix
          }admin help\` to see available commands.`,
          event.threadID,
          event.messageID,
        );
    }
  },
};
