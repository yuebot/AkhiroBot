const axios = require('axios');

module.exports = {
  config: {
    name: "shotilb",
    role: 1,
    description: "Get information from Shoti API",
    usage: "shotilb [leaderboard/stats]",
    author: "Rui | Liby",
  },
  onRun: async ({ api, event, args, fonts }) => {
    try {
      const method = args[0];
      if (method === 'leaderboard' || method === 'stats') {
        const response = await axios.post('https://shoti-srv1.onrender.com/api/info', { f: method });
        if (method === 'leaderboard') {
          const topUsers = response.data;
          let leaderboardMessage = `${fonts.applyFonts("🏆 Leaderboard:", "bold")}\n`;
          topUsers.forEach((user, index) => {
            leaderboardMessage += `${index + 1}. ${fonts.applyFonts(user.username, "sans/bold")} - Requests: ${user.requests}\n`;
          });
          api.sendMessage(leaderboardMessage, event.threadID);
        } else if (method === 'stats') {
          const { videos, users, requests } = response.data;
          const statsMessage = `${fonts.applyFonts("📊 Stats:", "bold")}\nVideos: ${videos}\nUsers: ${users}\nRequests: ${requests}`;
          api.sendMessage(statsMessage, event.threadID);
        }
      } else {
        api.sendMessage(`${fonts.applyFonts("❌ Invalid method. Use 'leaderboard' or 'stats'.", "bold")}`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`${fonts.applyFonts("❌ An error occurred while fetching data.", "bold")}`, event.threadID);
    }
  },
};