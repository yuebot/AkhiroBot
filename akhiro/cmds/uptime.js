const os = require("os");

// Capture the bot's start time
const startTime = new Date();

module.exports = {
  config: {
    name: "uptime",
    description: "Retrieve system information and check server latency.",
    usage: "uptime",
    author: "Rui",
  },
  onRun: async ({ api, event, fonts }) => {
    try {
      const uptimeInSeconds = (new Date() - startTime) / 1000;
      const uptimeFormatted = new Date(uptimeInSeconds * 1000)
        .toISOString()
        .substr(11, 8);

      const loadAverage = os.loadavg();
      const cpuUsage =
        os
          .cpus()
          .map((cpu) => cpu.times.user)
          .reduce((acc, curr) => acc + curr) / os.cpus().length;

      const totalMemoryGB = os.totalmem() / 1024 ** 3;
      const freeMemoryGB = os.freemem() / 1024 ** 3;
      const usedMemoryGB = totalMemoryGB - freeMemoryGB;

      const systemInfo = `
❍━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━❍

©️ | 𝗦𝗢𝗨𝗥𝗖𝗘: 𝖠𝗄𝗁𝗂𝗋𝗈𝖡𝗈𝗍
™️ | 𝗟𝗔𝗡𝗚𝗨𝗔𝗚𝗘: 𝖭𝗈𝖽𝖾.𝗃𝗌
❍━━━━━━━━━━━━━━━❍
🆙 | 𝗨𝗣𝗧𝗜𝗠𝗘𝗗: ${uptimeFormatted} 𝗌𝖾𝖼𝗈𝗇𝖽𝗌
❍━━━━━━━━━━━━━━━❍
𝗢𝗦: ${os.type()} ${os.arch()}
𝗡𝗢𝗗𝗘.𝗝𝗦 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${process.version}
𝗖𝗣𝗨 𝗠𝗢𝗗𝗘𝗟: ${os.cpus()[0].model}
𝗠𝗘𝗠𝗢𝗥𝗬: ${usedMemoryGB.toFixed(2)} GB / ${totalMemoryGB.toFixed(2)} GB
𝗖𝗣𝗨 𝗨𝗦𝗔𝗚𝗘: ${cpuUsage.toFixed(1)}%
𝗥𝗔𝗠 𝗨𝗦𝗔𝗚𝗘: ${process.memoryUsage().heapUsed / 1024 / 1024} MB;
❍━━━━━━━━━━━━━━━❍
`;

api.sendMessage(systemInfo, event.threadID, event.messageID);
} catch (error) {
console.error("Error retrieving system information:", error);
api.sendMessage(
"Unable to retrieve system information.",
event.threadID,
event.messageID,
);
}
},
};