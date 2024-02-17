const fs = require("fs-extra");

function readBankFile() {
  const filePath = "./bank.json";
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bank file:", error);
    return {};
  }
}

function writeBankFile(data) {
  const filePath = "./bank.json";
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing bank file:", error);
  }
}

function registerUser(userId) {
  const bankData = readBankFile();
  console.log(`Before registration: ${JSON.stringify(bankData)}`);

  if (!bankData[userId]) {
    bankData[userId] = { balance: 0 };
    writeBankFile(bankData);
    console.log(`After registration: ${JSON.stringify(bankData)}`);
    return true;
  }

  console.log(`User ${userId} is already registered.`);
  return false;
}

function checkBalance(userId) {
  const bankData = readBankFile();
  return bankData[userId] ? bankData[userId].balance : 0;
}

function deposit(userId, amount) {
  const bankData = readBankFile();
  if (bankData[userId]) {
    bankData[userId].balance += amount;
    writeBankFile(bankData);
    return true;
  }
  return false;
}

function withdraw(userId, amount) {
  const bankData = readBankFile();
  if (bankData[userId] && bankData[userId].balance >= amount) {
    bankData[userId].balance -= amount;
    writeBankFile(bankData);
    return true;
  }
  return false;
}

function send(senderId, receiverId, amount) {
  const bankData = readBankFile();
  if (
    bankData[senderId] &&
    bankData[receiverId] &&
    bankData[senderId].balance >= amount
  ) {
    bankData[senderId].balance -= amount;
    bankData[receiverId].balance += amount;
    writeBankFile(bankData);
    return true;
  }
  return false;
}

module.exports = {
  registerUser,
  checkBalance,
  deposit,
  withdraw,
  send,
  readBankFile,
};
