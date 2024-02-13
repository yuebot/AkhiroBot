const { Thread } = require('../connectDB');
const chalk = require('chalk');

const getAllThreads = async () => {
  try {
    const threads = await Thread.findAll();
    return threads;
  } catch (error) {
    console.error(chalk.red('❌ | Error fetching threads:'), error);
    throw new Error('Internal Server Error');
  }
};

const getThreadById = async (threadId) => {
  try {
    const thread = await Thread.findByPk(threadId);
    return thread;
  } catch (error) {
    console.error(chalk.red('❌ | Error fetching thread by ID:'), error);
    throw new Error('Internal Server Error');
  }
};

const addThreadById = async (api, threadId) => {
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    const existingThread = await Thread.findOne({ where: { threadID: threadId } });

    if (existingThread) {
      console.error(chalk.red('❌ | Thread already exists in the database'));
      throw new Error('Thread already exists in the database');
    } else {
      const newThread = await Thread.create({
        threadID: threadInfo.threadID,
        threadName: threadInfo.threadName || '',
        participantIDs: threadInfo.participantIDs || [],
        userInfo: threadInfo.userInfo || [],
        unreadCount: threadInfo.unreadCount || 0,
        messageCount: threadInfo.messageCount || 0,
        imageSrc: threadInfo.imageSrc || null,
        timestamp: threadInfo.timestamp || null,
        muteUntil: threadInfo.muteUntil || null,
        isGroup: threadInfo.isGroup || false,
        isSubscribed: threadInfo.isSubscribed || false,
        folder: threadInfo.folder || '',
        isArchived: threadInfo.isArchived || false,
        lastReadTimestamp: threadInfo.lastReadTimestamp || null,
        emoji: threadInfo.emoji ? threadInfo.emoji.emoji : null,
        color: threadInfo.color || '',
        adminIDs: threadInfo.adminIDs || [],
        approvalMode: threadInfo.approvalMode || false,
        approvalQueue: threadInfo.approvalQueue || [],
        inviteLink: threadInfo.inviteLink || {},
        enable: threadInfo.inviteLink ? threadInfo.inviteLink.enable : false,
        link: threadInfo.inviteLink ? threadInfo.inviteLink.link : '',
        accountType: threadInfo.accountType || '',
      });

      console.log(chalk.green('✅ | Thread added to the database:'), newThread);
      return newThread;
    }
  } catch (error) {
    console.error(chalk.red('❌ | Error adding thread:'), error);
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  getAllThreads,
  getThreadById,
  addThreadById,
};