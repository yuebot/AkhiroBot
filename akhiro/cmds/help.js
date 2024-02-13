module.exports = {
  config: {
    name: "help",
    description: "Show available commands and their descriptions",
    usage: "help [command]",
    author: "Rui",
    aliases: ["commands", "cmd"],
  },
  onRun: async ({ api, event, args }) => {
    const commands = Object.values(global.AkhiroBot.commands);

    if (args.length === 0) {
      let helpMessage = "╭─• [ Help ]\n│\n";
      for (const command of commands) {
        const { name, description } = command.config;
        helpMessage += `│ ➤ ${name}\n`;
        helpMessage += `│    ${description}\n`;
        helpMessage += `│\n`;
      }
      helpMessage += "╰──•";
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const commandName = args[0].toLowerCase();
      const targetCommand = commands.find(
        (command) =>
          command.config.name.toLowerCase() === commandName ||
          (command.config.aliases && command.config.aliases.includes(commandName))
      );

      if (targetCommand) {
        const { name, description, usage, author, aliases } = targetCommand.config;
        let helpMessage = `╭─• [ ${name} ]\n`;
        helpMessage += `│ ➤ description\n`;
        helpMessage += `│    ${description}\n`;
        helpMessage += `│ ➤ usage\n`;
        helpMessage += `│    Usage: \`${global.AkhiroBot.botPrefix}${usage}\`\n`;
        helpMessage += `│ ➤ author\n`;
        helpMessage += `│    ${author}\n`;
        if (aliases) {
          helpMessage += `│ ➤ aliases\n`;
          helpMessage += `│    ${aliases.join(", ")}\n`;
        }
        helpMessage += `╰──•`;
        api.sendMessage(helpMessage, event.threadID, event.messageID);
      } else {
        api.sendMessage(
          "❌ | Command not found. Use `help` to see available commands.",
          event.threadID,
          event.messageID
        );
      }
    }
  },
};
