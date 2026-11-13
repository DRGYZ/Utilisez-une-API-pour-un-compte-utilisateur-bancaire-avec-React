const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const { join } = require('node:path')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/user', userRoutes)

if (process.env.NODE_ENV !== 'production') {
  const swagger = yaml.load(join(__dirname, '..', 'swagger.yaml'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger))
}

app.get('/', (req, res) => res.send('Argent Bank API'))

module.exports = app
