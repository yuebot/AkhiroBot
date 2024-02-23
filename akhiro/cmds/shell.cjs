const { exec } = require('child_process');

module.exports = {
  config: {
    name: "shell",
    role: 1,
    description: "Get a command line bash shell",
    usage: "shell [command]",
    author: "Rui",
    aliases: ["bash", "terminal", "$"],
  },
  onRun: ({ api, event, args }) => {
    const cmd = args.join(" ");

    if (!cmd) {
      api.sendMessage(`Please provide a command to run.`, event.threadID, event.messageID);
      return;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
        return;
      }

      const output = stdout || stderr;
      api.sendMessage(`${output}`, event.threadID, event.messageID);
    });
  },
};