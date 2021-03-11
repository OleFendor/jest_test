const controller = require('../controllers/userController')
const mms = require('../config/mms.config')
const User = require('../models/user')
const {
  describe,
  beforeAll,
  afterEach,
  afterAll,
  test,
  expect,
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

  test('undefined object', () => {
    expect(controller.create()).toThrow()
  })
  test('empty user', () => {
    const user = new User()
    expect(controller.create(user)).toThrow()
  })
  test('without all fields', () => {
    const user = new User({
      name: 'a',
    })
    expect(controller.create(user)).toThrow()
  })
  test('wronge role', () => {
    const user = new User({
      name: 'a',
      surname: 'b',
      email: 'c',
      password: 'd',
      role: 'e',
    })
    expect(controller.create(user)).toThrow()
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
  })
})
