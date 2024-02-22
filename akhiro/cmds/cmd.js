const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "cmd",
    role: 1,
    description: "Command Module Deployment",
    usage: "cmd [help/load/loadAll/unload/install]",
    author: "Rui",
    aliases: ["c"],
  },
  onRun: async ({ api, event, args, fonts }) => {
    const { loadCmd, unloadCmd, loadAll } = global.AkhiroBot;

    if (args.length === 0) {
      const helpMessage = `${fonts.applyFonts("Specify a subcommand:", "bold")}\n${fonts.applyFonts(
        "- help: Display help for commands\n- load: Load a specific command\n- loadAll: Load all commands\n- unload: Unload a specific command\n- install: Install a new command from code/pastebin link",
        "sans"
      )}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const subcommand = args[0].toLowerCase();

      switch (subcommand) {
        case "help":
          const helpMessage = `${fonts.applyFonts("Commands Module Help:", "bold")}\n${fonts.applyFonts(
            "- help: Display help for commands\n- load: Load a specific command\n- loadAll: Load all commands\n- unload: Unload a specific command\n- install: Install a new command from code/pastebin link",
            "sans"
          )}`;
          api.sendMessage(helpMessage, event.threadID, event.messageID);
          break;

        case "load":
          if (args.length >= 2) {
            const commandName = args[1];
            loadCmd(commandName);
            api.sendMessage(`✅ | Command '${commandName}' loaded successfully!`, event.threadID);
          } else {
            api.sendMessage(`❌ | Specify a command to load.`, event.threadID);
          }
          break;

        case "loadall":
          loadAll();
          api.sendMessage(`✅ | All commands loaded successfully!`, event.threadID);
          break;

        case "unload":
          if (args.length >= 2) {
            const commandName = args[1];
            unloadCmd(commandName);
            api.sendMessage(`✅ | Command '${commandName}' unloaded successfully!`, event.threadID);
          } else {
            api.sendMessage(`❌ | Specify a command to unload.`, event.threadID);
          }
          break;

        case "install":
          if (args.length >= 3) {
            const codeLink = args[1];
            const filename = args[2] + ".js";

            try {
              const response = await axios.get(codeLink);
              const code = response.data;

              const tempFilePath = path.join(process.cwd(), 'temp', filename);
              fs.writeFileSync(tempFilePath, code);

              loadCmd(tempFilePath);

              api.sendMessage(`✅ | Command '${filename}' installed successfully!`, event.threadID);
            } catch (error) {
              api.sendMessage(`❌ | Error installing command: ${error.message}`, event.threadID);
            }
          } else {
            api.sendMessage(`❌ | Specify a code link and filename to install a command.`, event.threadID);
          }
          break;

        default:
          api.sendMessage(`❌ | Unknown subcommand. Use 'help' for assistance.`, event.threadID);
      }
    }
  },
};