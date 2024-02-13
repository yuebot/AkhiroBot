module.exports = {
  config: {
    name: "help",
    description: "Show available commands and their descriptions",
    usage: "help [command]",
    author: "Rui",
    aliases: ["commands", "cmd"],
  },
  onRun: async ({ api, event, args }) => {
    const commands = global.AkhiroBot.commands.values();

    if (args.length === 0) {
      let helpMessage = "Available Commands:\n\n";
      for (const command of commands) {
        const { name, description } = command.config;
        helpMessage += `${name} - ${description}\n`;
      }
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const commandName = args[0].toLowerCase();
      const targetCommand = Array.from(commands).find(command => command.config.name.toLowerCase() === commandName || (command.config.aliases && command.config.aliases.includes(commandName)));

      if (targetCommand) {
        const { name, description, usage } = targetCommand.config;
        api.sendMessage(`${name} - ${description}\nUsage: \`${global.AkhiroBot.botPrefix}${usage}\``, event.threadID, event.messageID);
      } else {
        api.sendMessage("❌ | Command not found. Use `help` to see available commands.", event.threadID, event.messageID);
      }
    }
  },
};