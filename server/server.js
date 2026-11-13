require('dotenv').config()
const connectDatabase = require('./database/connection')
const app = require('./app')

async function start() {
  if (process.env.NODE_ENV === 'production' && !process.env.SECRET_KEY) {
    throw new Error('Set SECRET_KEY before starting the API in production.')
  }

  await connectDatabase()
  const port = Number(process.env.PORT || 3001)
  const host = process.env.HOST || '127.0.0.1'
  app.listen(port, host, () => console.log(`Argent Bank API at http://${host}:${port}`))
}

start().catch(error => {
  console.error(`Argent Bank could not start: ${error.message}`)
  process.exitCode = 1
})
