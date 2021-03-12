const controller = require('../controllers/userController')
const mms = require('../config/mms')
const User = require('../models/user')
const {
  describe,
  beforeAll,
  afterEach,
  afterAll,
  test,
  expect,
  beforeEach,
} = require('@jest/globals')

describe('create tests', () => {
  beforeAll(async () => {
    await mms.connect()
  })
  afterEach(async () => {
    await mms.clearDB()
  })
  afterAll(async () => {
    await mms.closeDB()
  })

  test('add undefined user', async () => {
    try {
      await controller.create(user)
    } catch (e) {
      expect(e).toBeDefined()
    }
  })
  test('without all fields', async () => {
    const user = new User({
      name: 'a',
    })
    try {
      await controller.create(user)
    } catch (e) {
      expect(e).toBeDefined()
    }
  })

  test('success create', async () => {
    const user = {
      name: 'a',
      surname: 'b',
      email: 'c',
      password: 'd',
      role: 'User',
    }
    await controller.create(user)
    const userDb = await User.find()
    const count = await User.count()
    expect(count).toBe(1)
    expect(userDb[0]).toHaveProperty('name', 'a')
    expect(userDb[0]).toHaveProperty('surname', 'b')
    expect(userDb[0]).toHaveProperty('email', 'c')
    expect(userDb[0]).toHaveProperty('password', 'd')
    expect(userDb[0]).toHaveProperty('role', 'User')
    expect(userDb[0]).toHaveProperty('_id')
  })
  /*
  test('without all fields', () => {
    const user = new User({
      name: 'a',
    })
    expect(controller.create(user)).toBeUndefined()
  })
  test('wronge role', () => {
    const user = new User({
      name: 'a',
      surname: 'b',
      email: 'c',
      password: 'd',
      role: 'e',
    })
    expect(controller.create(user)).toBeUndefined()
  })

  test('success create', async () => {
    const user = new User({
      name: 'a',
      surname: 'b',
      email: 'c',
      password: 'd',
      role: 'User',
    })
    await controller.create(user)
    expect(controller.getAll()).toEqual(user)
  })*/
})
/*
describe('get tests', () => {
  beforeAll(async () => {
    await mms.connect()
  })
  beforeEach(async () => {
    const user = new User({
      name: 'a',
      surname: 'b',
      email: 'c',
      password: 'd',
      role: 'User',
    })
    await controller.create(user)
  })
  afterEach(async () => {
    await mms.clearDB()
  })
  afterAll(async () => {
    await mms.closeDB()
  })

  describe('getbyid', () => {
    test('undefined id', async () => {
      expect(await controller.getById()).toBeUndefined()
    })

    test('incorrect id', async () => {
      expect(await controller.getById(4)).toBeUndefined()
    })

    test('incorrect type', async () => {
      expect(await controller.getById(true)).toThrowError()
    })

    test('correct id', async () => {})
  })
})*/
