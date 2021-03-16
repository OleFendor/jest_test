const User = require('../models/user');

exports.create = async (user) => {
  try {
    await new User(user).save();
  } catch (e) {
    throw e;
  }
};

exports.getById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (e) {
    throw e;
  }
};

exports.getByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error();
  return user;
};

exports.getAll = async () => {
  const users = await User.find({});
  return users;
};

exports.delete = async (id) => {
  try {
    await User.findByIdAndDelete(id);
  } catch (e) {
    throw e;
  }
};

exports.update = async (id, newdata) => {
  try {
    await User.findByIdAndUpdate(id, newdata);
  } catch (e) {
    throw e;
  }
};
