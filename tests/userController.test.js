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

  test('undefine object', () => {
    expect(controller.create()).toThrow()
  })
})
