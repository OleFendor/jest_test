const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongoServer = new MongoMemoryServer()

const mongooseOpts = {
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useFindAndModify: false,
}

module.exports.connect = async () => {
  const uri = await mongoServer.getUri()
  await mongoose.connect(uri, mongooseOpts, (err) => {
    if (err) console.error(err)
  })
}

module.exports.clearDB = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany()
  }
}

module.exports.closeDB = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}
