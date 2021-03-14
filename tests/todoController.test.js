const controller = require('../controllers/todoController')
const mms = require('../config/mms')
const Todo = require('../models/todo')
const mongoose = require('mongoose')
const {
  describe,
  beforeAll,
  afterEach,
  afterAll,
  test,
  expect,
  beforeEach,
} = require('@jest/globals')

describe('test', () => {
  beforeAll(async () => {
    await mms.connect()
  })
  afterEach(async () => {
    await mms.clearDB()
  })
  afterAll(async () => {
    await mms.closeDB()
  })

  describe('CREATE', () => {
    test('create null', () => {
      expect(controller.create()).rejects.toThrow('Incorrect todo')
    })

    test('create without all data', () => {
      const todo = {
        name: 'a',
      }
      expect(controller.create(todo)).rejects.toThrow('Incorrect todo')
    })

    test('create with incorect status', () => {
      const todo = {
        name: 'a',
        description: 'b',
        status: 'ok',
        date: '01.04.2021',
        user: '01',
      }
      expect(controller.create(todo)).rejects.toThrow('Incorrect todo')
    })

    test('create todo', async () => {
      const todo = {
        name: 'a',
        description: 'b',
        status: true,
        date: '01.04.2021',
        user: '01',
      }
      await controller.create(todo)
      expect(await Todo.find({})).toHaveLength(1)
      expect(await Todo.findOne({ name: 'a' })).toMatchObject(todo)
    })
  })

  describe('GET', () => {
    const CheckTodo = (myTodo, dbTodo) => {
      expect(dbTodo).toHaveProperty('name', myTodo.name)
      expect(dbTodo).toHaveProperty('description', myTodo.description)
      expect(dbTodo).toHaveProperty('status', myTodo.status)
      expect(dbTodo).toHaveProperty('date', myTodo.date)
      expect(dbTodo).toHaveProperty('user', myTodo.user)
    }
    describe('getAll()', () => {
      test('with empty db', async () => {
        expect(await controller.getAll()).toHaveLength(0)
      })

      test('1 object getAll', async () => {
        const todo = await new Todo({
          name: 'a',
          description: 'b',
          status: false,
          date: '11.03.2021',
          user: '21saw12e12',
        }).save()
        const todoDb = await controller.getAll()
        expect(todoDb).toHaveLength(1)
        CheckTodo(todo, todoDb[0])
      })
    })

    describe('getById()', () => {
      test('without id', async () => {
        try {
          await controller.getById()
        } catch (e) {
          expect(e).toBeDefined()
        }
      })

      test('wronge id', async () => {
        try {
          await controller.getById(1)
        } catch (e) {
          expect(e).toBeDefined()
        }
      })

      test('success get by id', async () => {
        const todo = await new Todo({
          name: 'a',
          description: 'b',
          status: false,
          date: '11.03.2021',
          user: '21saw12e12',
        }).save()
        const todoDb = await controller.getById(todo._id)
        CheckTodo(todo, todoDb)
      })
    })
    describe('getByUser()', () => {
      test('without user id', async () => {
        try {
          const todo = await new Todo({
            name: 'a',
            description: 'b',
            status: false,
            date: '11.03.2021',
            user: '21saw12e12',
          }).save()
          await controller.getByUser()
        } catch (e) {
          expect(e).toBeDefined()
        }
      })

      test('with wronge user id', async () => {
        try {
          const todo = await new Todo({
            name: 'a',
            description: 'b',
            status: false,
            date: '11.03.2021',
            user: '21saw12e12',
          }).save()
          await controller.getByUser(todo.user)
        } catch (e) {
          expect(e).toBeDefined()
        }
      })

      test('Success get by user id', async () => {
        const todo = await new Todo({
          name: 'a',
          description: 'b',
          status: false,
          date: '11.03.2021',
          user: '21saw12e12',
        }).save()
        const findedTodo = await controller.getByUser(todo.user)
        CheckTodo(todo, findedTodo)
      })
    })
  })

  describe('UPDATE', () => {
    test('update null todo', async () => {
      try {
        await controller.update('1', { name: 'a' })
      } catch (e) {
        expect(e).toBeDefined()
      }
    })

    test('update with no data', async () => {
      const todo = await new Todo({
        name: 'a',
        description: 'b',
        status: false,
        date: '11.03.2021',
        user: '21saw12e12',
      }).save()

      const todo_copy = Object.assign({}, todo)
      await controller.update(todo._id, {})
      expect(todo).toEqual(todo_copy)
    })

    test('update with wronge status', async () => {
      const todo = await new Todo({
        name: 'a',
        description: 'b',
        status: false,
        date: '11.03.2021',
        user: '21saw12e12',
      }).save()
      try {
        await controller.update(todo._id, { status: 'a' })
      } catch (e) {
        expect(e).toBeDefined()
      }
    })

    test('success update', async () => {
      const todo = await new Todo({
        name: 'a',
        description: 'b',
        status: false,
        date: '11.03.2021',
        user: '21saw12e12',
      }).save()

      await controller.update(todo._id, {
        name: 'Task_1',
        date: '11.06.20',
        status: true,
      })
      const todoDb = await Todo.findById(todo._id)
      expect(todoDb).toHaveProperty('date', '11.06.20')
      expect(todoDb).toHaveProperty('name', 'Task_1')
      expect(todoDb).toHaveProperty('status', true)
      expect(todoDb).toHaveProperty('description', 'b')
    })
  })

  describe('DELETE', () => {
    test('success delete', async () => {
      const todo = await new Todo({
        name: 'a',
        description: 'b',
        status: false,
        date: '11.03.2021',
        user: '21saw12e12',
      }).save()
      await controller.delete(todo._id)
      expect(await Todo.count()).toEqual(0)
    })

    test('delete with wronge id', async () => {
      const todo = await new Todo({
        name: 'a',
        description: 'b',
        status: false,
        date: '11.03.2021',
        user: '21saw12e12',
      }).save()
      try {
        await controller.delete(todo._id + 1)
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
})
