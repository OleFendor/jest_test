const User = require('../models/user')

exports.create = async (user) => {
  try {
    await new User(user).save()
  } catch (e) {
    throw e
  }
}

exports.getById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (e) {
    throw e
  }
}

exports.getByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email })
    return user
  } catch (e) {
    throw e
  }
}

exports.getAll = async () => {
  try {
    const users = await User.find({})
    return users
  } catch (e) {
    throw e
  }
}

exports.delete = async (id) => {
  try {
    await User.findByIdAndDelete(id)
  } catch (e) {
    throw e
  }
}

exports.update = async (id, newdata) => {
  try {
    await User.findByIdAndUpdate(id, newdata)
  } catch (e) {
    throw e
  }
}
