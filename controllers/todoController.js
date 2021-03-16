const Todo = require('../models/todo');

exports.create = async (todo) => {
  try {
    await new Todo(todo).save();
  } catch (e) {
    throw new Error('Incorrect todo');
  }
};

exports.getAll = async () => {
  const todos = await Todo.find({});
  return todos;
};

exports.getById = async (id) => {
  try {
    const todo = await Todo.findById(id);
    return todo;
  } catch (e) {
    throw e;
  }
};

exports.getByUser = async (user) => {
  const todo = await Todo.findOne({ user: user });
  if (!todo) throw new Error();
  return todo;
};

exports.update = async (id, newdata) => {
  try {
    await Todo.findByIdAndUpdate(id, newdata);
  } catch (e) {
    throw e;
  }
};
exports.delete = async (id) => {
  try {
    await Todo.findByIdAndDelete(id);
  } catch (e) {
    throw e;
  }
};
