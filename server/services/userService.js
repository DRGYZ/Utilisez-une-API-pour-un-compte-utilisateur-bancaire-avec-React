const User = require('../database/models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = require('../config-session')

class UserError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function emailAddress(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

function names({ firstName, lastName }) {
  if (![firstName, lastName].every(name =>
    typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 80
  )) {
    throw new UserError(400, 'Enter a first and last name of up to 80 characters each.')
  }

  return { firstName: firstName.trim(), lastName: lastName.trim() }
}

async function createUser(data) {
  const email = emailAddress(data.email)
  if (!email || typeof data.password !== 'string' || !data.password || Buffer.byteLength(data.password) > 72) {
    throw new UserError(400, 'Enter an email address and a password of up to 72 bytes.')
  }

  if (await User.exists({ email })) throw new UserError(400, 'Email already exists.')
  const userNames = names(data)
  const password = await bcrypt.hash(data.password, 12)
  const user = await User.create({ email, password, ...userNames })
  return user.toObject()
}

async function loginUser(data) {
  const email = emailAddress(data.email)
  const user = email && typeof data.password === 'string' ? await User.findOne({ email }) : null
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new UserError(400, 'Incorrect email or password.')
  }

  return { token: jwt.sign({ id: user.id }, secret, { algorithm: 'HS256', expiresIn: '1d' }) }
}

async function getUserProfile(id) {
  const user = await User.findById(id)
  if (!user) throw new UserError(401, 'Please sign in again.')
  return user.toObject()
}

async function updateUserProfile(id, data) {
  const user = await User.findByIdAndUpdate(id, names(data), { new: true })
  if (!user) throw new UserError(401, 'Please sign in again.')
  return user.toObject()
}

module.exports = { createUser, loginUser, getUserProfile, updateUserProfile, UserError }
