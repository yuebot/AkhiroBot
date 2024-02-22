const {execSync} = require('child_process');

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
    const command = args.join(' ');

    execSync(command, (error, stdout, stderr) => {
      if (error) {
        api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
        return;
      }

      const output = stdout || stderr;
      api.sendMessage(`${output}`, event.threadID, event.messageID);
    });
  },
};