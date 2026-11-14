const assert = require('node:assert/strict')
const { once } = require('node:events')
const { randomUUID } = require('node:crypto')
const { after, before, test } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../database/models/userModel')

const dbName = `argent_bank_test_${randomUUID().replaceAll('-', '')}`
let server
let baseUrl

before(async () => {
  const url = process.env.ARGENT_TEST_DATABASE_URL || 'mongodb://127.0.0.1:27017'
  await mongoose.connect(url, { dbName, serverSelectionTimeoutMS: 5000 })
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/user`
})

after(async () => {
  try {
    if (server) await new Promise(resolve => server.close(resolve))
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName) {
      await mongoose.connection.dropDatabase()
    }
  } finally {
    await mongoose.disconnect()
  }
})

async function request(path, { method = 'POST', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${baseUrl}/${path}`, {
    method, headers, body: JSON.stringify(body || {})
  })
  return { status: response.status, payload: await response.json() }
}

test('profile read and update require a valid session', async () => {
  assert.equal((await request('profile')).status, 401)
  assert.equal((await request('profile', { method: 'PUT' })).status, 401)
})

test('signup, login, and profile updates keep password hashes out of API responses', async () => {
  const credentials = { email: 'qa@example.test', password: 'sample-password' }
  const signup = await request('signup', {
    body: { ...credentials, firstName: 'Taylor', lastName: 'Demo' }
  })
  assert.equal(signup.status, 200)
  assert.equal(Object.hasOwn(signup.payload.body, 'password'), false)
  assert.equal((await request('login', { body: { ...credentials, password: 'wrong' } })).status, 400)

  const login = await request('login', { body: credentials })
  assert.equal(login.status, 200)
  const { token } = login.payload.body
  const profile = await request('profile', { token })
  assert.equal(profile.status, 200)
  assert.equal(profile.payload.body.firstName, 'Taylor')
  assert.equal(Object.hasOwn(profile.payload.body, 'password'), false)

  const invalid = await request('profile', {
    method: 'PUT', token, body: { firstName: '  ', lastName: 'Demo' }
  })
  assert.equal(invalid.status, 400)

  const updated = await request('profile', {
    method: 'PUT',
    token,
    body: { firstName: '  Alex ', lastName: ' Demo ', email: 'other@example.test' }
  })
  assert.equal(updated.status, 200)
  assert.equal(updated.payload.body.firstName, 'Alex')
  assert.equal(updated.payload.body.email, credentials.email)
  assert.equal((await request('profile', { token })).payload.body.firstName, 'Alex')

  await User.deleteOne({ email: credentials.email })
  assert.equal((await request('profile', { token })).status, 401)
})
