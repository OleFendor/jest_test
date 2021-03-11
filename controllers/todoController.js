const { findById } = require('../models/todo')
const Todo = require('../models/todo')

exports.create = async (todo) => {
  try {
    await new Todo({
      name: todo.name,
      description: todo.description,
      status: todo.status,
      date: todo.date,
      user: todo.user,
    }).save()
    return 'success'
  } catch (e) {
    console.error(e)
  }
}

exports.getAll = async () => {
  try {
    const todos = await Todo.find({})
    return todos
  } catch (e) {
    console.error(e)
  }
}

exports.getById = async (id) => {
  try {
    const todo = await Todo.findById(id)
    return todo
  } catch (e) {
    console.error(e)
  }
}

exports.getByUser = async (user) => {
  try {
    const todo = await Todo.findOne({ user: user })
    return todo
  } catch (e) {
    console.error(e)
  }
}

exports.update = async (newdata) => {
  try {
    const todo = await findById(newdata._id)
    await todo.update({
      name: newdata.name ?? todo.name,
      description: newdata.description ?? todo.description,
      status: newdata.status ?? todo.status,
      date: newdata.date ?? todo.date,
      user: newdata.user ?? todo.user,
    })
  } catch (e) {
    console.error(e)
  }
}
exports.delete = async (id) => {
  try {
    await Todo.findByIdAndDelete(id)
  } catch (e) {
    console.error(e)
  }
}
