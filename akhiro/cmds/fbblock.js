const fs = require('fs');

module.exports.config = {
  name: "fbuser",
  credits: 'Eugene Aguilar | Rui & Akhiro',
  description: 'Block a user from using the bot',
  role: 1,
  usage: 'fbuser [uid/mention] [block/unblock]',
};

module.exports.onRun = async function ({ api, event, args }) {
  if (args.length === 0) {
    api.sendMessage('Please provide a user ID or mention to block.', event.threadID, event.messageID);
    return;
  }

  let targetUserID;
  if (event.mentions.length > 0) {
    targetUserID = event.mentions[0].id;
  } else if (args[0].match(/^\d+$/)) {
    targetUserID = args[0];
  } else {
    api.sendMessage('Invalid user ID or mention provided.', event.threadID, event.messageID);
    return;
  }

  const action = args[1] ? args[1].toLowerCase() : '';

  if (action === 'unblock') {
    api.changeBlockedStatus(targetUserID, false);
    api.sendMessage(`Successfully unblocked user ${targetUserID}`, event.threadID, event.messageID);
  } else if (action === 'block') {
    api.changeBlockedStatus(targetUserID, true);
    api.sendMessage(`Successfully blocked user ${targetUserID}`, event.threadID, event.messageID);
  } else {
    api.sendMessage('Invalid command. Please use "block" or "unblock".', event.threadID, event.messageID);
  }
};