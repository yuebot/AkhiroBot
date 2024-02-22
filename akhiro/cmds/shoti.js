const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "shoti",
    role: 1,
    description: "Get video from Shoti API",
    usage: "shoti",
    author: "Rui | Liby",
  },
  onRun: async ({ api, event, args }) => {
    try {
      const apiKey = "$shoti-1hn634vu67edaqv02qo";

      const postData = {
        apikey: apiKey,
      };

      api.setMessageReaction("⌛", event.messageID, (err) => console.log(err), true);
      
      const response = await axios.post('https://shoti-srv1.onrender.com/api/v1/get', postData);

      if (response.data.code === 200) {
        const videoData = response.data.data;
        const videoURL = videoData.url;
        const videoFilename = `${Date.now()}_shoti.mp4`;

        const videoBuffer = await axios.get(videoURL, { responseType: 'arraybuffer' });
        const videoPath = path.join(__dirname, 'videos', videoFilename);
        fs.writeFileSync(videoPath, Buffer.from(videoBuffer.data, 'utf-8'));

        const fileStream = fs.createReadStream(videoPath);
        api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
        await api.sendMessage({ attachment: fileStream, body: `@${videoData.user.username}`, }, event.threadID, event.messageID);

        setTimeout(() => {
          fs.unlinkSync(videoPath);
        }, 5500);
      } else {
        api.sendMessage(`❌ | API Error: ${response.data.message}`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`❌ | An error occurred: ${error.message}`, event.threadID);
    }
  },
};