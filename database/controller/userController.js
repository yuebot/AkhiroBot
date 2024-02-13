const { User } = require('../connectDB');

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('❌ | Error fetching users:', error);
    throw new Error('Internal Server Error');
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('❌ | Error fetching user by ID:', error);
    throw new Error('Internal Server Error');
  }
};

const addUserById = async (api, uid) => {
  try {
    const userInfo = await api.getUserInfo(uid);
    const existingUser = await User.findOne({ where: { userID: uid } });

    if (existingUser) {
      console.error('❌ | User already exists in the database');
      throw new Error('User already exists in the database');
    } else {
      const newUser = await User.create({
        userID: uid,
        name: userInfo.name,
        firstName: userInfo.firstName,
        vanity: userInfo.vanity,
        thumbSrc: userInfo.thumbSrc,
        profileUrl: userInfo.profileUrl,
        gender: userInfo.gender,
        type: userInfo.type,
        isFriend: userInfo.isFriend,
        isBirthday: userInfo.isBirthday,
        searchTokens: userInfo.searchTokens,
        alternateName: userInfo.alternateName,
      });

      console.log('✅ | User added to the database:', newUser);
      return newUser;
    }
  } catch (error) {
    console.error('❌ | Error adding user:', error);
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUserById,
};