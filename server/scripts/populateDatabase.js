require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const connectDatabase = require('../database/connection')
const User = require('../database/models/userModel')

const users = [
  { firstName: 'Tony', lastName: 'Stark', email: 'tony@stark.com', password: 'password123' },
  { firstName: 'Steve', lastName: 'Rogers', email: 'steve@rogers.com', password: 'password456' }
]

async function seed() {
  if (process.env.NODE_ENV === 'production') throw new Error('Demo seeding is only available locally.')

  await connectDatabase()
  for (const { password, ...user } of users) {
    if (await User.exists({ email: user.email })) continue
    const now = new Date()
    await User.updateOne(
      { email: user.email },
      { $setOnInsert: { ...user, password: await bcrypt.hash(password, 12), createdAt: now, updatedAt: now } },
      { upsert: true, timestamps: false, setDefaultsOnInsert: true }
    )
  }
  console.log('Demo accounts ready.')
}

seed().catch(error => {
  console.error(`Could not seed demo accounts: ${error.message}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
