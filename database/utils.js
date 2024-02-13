const {
  getAllUsers,
  getUserById,
  addUserById
} = require('./controller/userController');

const {
  getAllThreads,
  getThreadById,
  addThreadById
} = require('./controller/threadController');

module.exports = {
  getAllUsers,
  getUserById,
  addUserById,
  getAllThreads,
  getThreadById,
  addThreadById,
};