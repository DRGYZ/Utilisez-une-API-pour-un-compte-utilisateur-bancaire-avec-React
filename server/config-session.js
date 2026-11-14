const { randomBytes } = require('node:crypto')

module.exports = process.env.SECRET_KEY || randomBytes(32)
