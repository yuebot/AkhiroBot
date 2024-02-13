const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const dataDirectory = path.join(__dirname, 'data');
fs.ensureDirSync(dataDirectory);

const dbPath = path.join(dataDirectory, 'database.sqlite');
const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: dbPath,
});

const User = require('./models/User')(sequelize);
const Thread = require('./models/Thread')(sequelize);

sequelize.sync()
  .then(() => {
    console.log(chalk.green('✅ | Connected to the database'));
  })
  .catch((err) => {
    console.error(chalk.red('❌ | Error connecting to the database:', err.message));
  });

module.exports = {
  sequelize,
  User,
  Thread,
};