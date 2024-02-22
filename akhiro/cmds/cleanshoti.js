const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "cleanshoti",
    role: 1,
    description: "Delete all Shoti videos and show freed-up space",
    usage: "cleanshoti",
    author: "Rui",
  },
  onRun: async ({ api, event, args }) => {
    try {
      const videosDirectory = path.join(__dirname, 'videos');

      if (fs.existsSync(videosDirectory)) {
        const initialSize = getDirectorySize(videosDirectory);

        const files = fs.readdirSync(videosDirectory);
        const shotiVideos = files.filter((file) => file.includes('_shoti.mp4'));

        shotiVideos.forEach((video) => {
          const videoPath = path.join(videosDirectory, video);
          fs.unlinkSync(videoPath);
        });

        const finalSize = getDirectorySize(videosDirectory);
        const freedUpSpace = initialSize - finalSize;

        api.sendMessage(`✅ Deleted Shoti videos and freed up ${formatBytes(freedUpSpace)}.`, event.threadID, event.messageID);
      } else {
        api.sendMessage("❌ 'videos/' directory not found.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`❌ An error occurred: ${error.message}`, event.threadID);
    }
  },
};

function getDirectorySize(directory) {
  const files = fs.readdirSync(directory);
  let totalSize = 0;

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  });

  return totalSize;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}