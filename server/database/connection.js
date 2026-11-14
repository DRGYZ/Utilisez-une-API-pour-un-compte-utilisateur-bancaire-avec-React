const mongoose = require('mongoose')

module.exports = function connectDatabase() {
  const databaseUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/argentBankDB'
  return mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 5000 })
}
