const userService = require('../services/userService')

function respond(message, action) {
  return async (req, res) => {
    try {
      const body = await action(req)
      return res.status(200).send({ status: 200, message, body })
    } catch (error) {
      if (error instanceof userService.UserError) {
        return res.status(error.status).send({ status: error.status, message: error.message })
      }
      console.error(error)
      return res.status(500).send({ status: 500, message: 'The request could not be completed.' })
    }
  }
}

module.exports.createUser = respond('User successfully created', req => userService.createUser(req.body || {}))
module.exports.loginUser = respond('User successfully logged in', req => userService.loginUser(req.body || {}))
module.exports.getUserProfile = respond('Successfully got user profile data', req => userService.getUserProfile(req.userId))
module.exports.updateUserProfile = respond('Successfully updated user profile data', req => userService.updateUserProfile(req.userId, req.body || {}))
