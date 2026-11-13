const jwt = require('jsonwebtoken')
const { isObjectIdOrHexString } = require('mongoose')
const secret = require('../config-session')

module.exports.validateToken = (req, res, next) => {
  const token = /^Bearer (\S+)$/i.exec(req.get('authorization') || '')?.[1]

  try {
    if (token) {
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
      if (isObjectIdOrHexString(payload?.id)) {
        req.userId = payload.id
        return next()
      }
    }
  } catch {
    // Invalid or expired session.
  }

  return res.status(401).send({ status: 401, message: 'Please sign in again.' })
}
