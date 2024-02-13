const login = require("fb-mica-api");
const fs = require("fs-extra");
const express = require("express");
const chalk = require("chalk");
const gradient = require("gradient-string");

const PORT = 3000;
const configPath = "akhiro_config.json";

const app = express();

fs.ensureFileSync(configPath);
const config = fs.readJsonSync(configPath, { throws: false }) || {
  botPrefix: "/",
};

global.AkhiroBot = {
  botPrefix: config.botPrefix,
  commands: {},
};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

function loadCommands() {
  const commandsPath = __dirname + "/akhiro/cmds";
  fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const command = require(`${commandsPath}/${file}`);
      const commandName = file.replace('.js', '');
      global.AkhiroBot.commands[commandName] = command;
    }
  });
}

function initializeBot() {
  try {
    const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
    login({ appState }, (err, api) => {
      try {
        if (err) {
          throw new Error(`Error while logging in: ${err}`);
        }

        api.listen((err, message) => {
          try {
            if (err) {
              throw new Error(`Error while listening: ${err}`);
            }

            if (message.body && message.body.toLowerCase() === 'prefix') {
              api.sendMessage(
                `My prefix is: \`${global.AkhiroBot.botPrefix}\``,
                message.threadID,
                message.messageID,
              );
            } else if (message.body && message.body.toLowerCase().startsWith(global.AkhiroBot.botPrefix)) {
              const [inputCommand, ...args] = message.body
                .slice(global.AkhiroBot.botPrefix.length)
                .trim()
                .split(' ');

              const commandName = Object.keys(global.AkhiroBot.commands).find(
                key => global.AkhiroBot.commands[key].config.aliases?.includes(inputCommand) || key === inputCommand
              );

              if (commandName) {
                const command = global.AkhiroBot.commands[commandName];

                if (command && command.onRun) {
                  command.onRun({ api, event: message, args });
                } else {
                  api.sendMessage(
                    `❌ | Invalid command, use \`${global.AkhiroBot.botPrefix}help\` to show available commands.`,
                    message.threadID,
                    message.messageID,
                  );
                }
              } else {
                api.sendMessage(
                  `❌ | Invalid command, use \`${global.AkhiroBot.botPrefix}help\` to show available commands.`,
                  message.threadID,
                  message.messageID,
                );
              }
            }
          } catch (error) {
            console.error(chalk.red(`❌ | ${error}`));
          }
        });
      } catch (error) {
        console.error(chalk.red(`❌ | ${error}`));
      }
    });
  } catch (error) {
    console.error(chalk.red(`❌ | Error initializing bot: ${error}`));
  }
}

app.listen(PORT, () => {
  loadCommands();
  initializeBot();

  console.log(gradient.retro("AkhiroBot v1"));
  console.log(gradient.retro("━━━━━━━━━━━━━━━"));
  console.log("");
  console.log(chalk.green(`✅ | Website running on port ${PORT}`));
  console.log("");
});