const User = require('../models/user')

exports.create = async (user) => {
  try {
    await new User({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: user.role,
    }).save()
  } catch (e) {
    console.error(e)
  }
}

exports.getById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (e) {
    console.error(e)
  }
}

exports.getByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email })
    return user
  } catch (e) {
    console.error(e)
  }
}

exports.getAll = async () => {
  try {
    const users = await User.find({})
    return users
  } catch (e) {
    console.error(e)
  }
}

exports.delete = async (id) => {
  try {
    await User.findByIdAndDelete(id)
  } catch (e) {
    console.error(e)
  }
}

exports.update = async (newdata) => {
  try {
    const user = await User.findById(newdata._id)
    await user.update({
      name: newdata.name ?? user.name,
      surname: newdata.surname ?? user.surname,
      email: newdata.email ?? user.email,
      password: newdata.password ?? user.password,
      role: newdata.role ?? user.role,
    })
  } catch (e) {
    console.error(e)
  }
}
