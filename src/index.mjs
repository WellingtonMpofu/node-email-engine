import emailRouter from './routes/emailRoutes.mjs'
import express from 'express'
import "dotenv/config"
import session from "express-session"
import { keycloak, memoryStore } from "./middleware/keycloak-config.mjs"

import { setupSwagger } from './config/swagger.mjs'

const app = express()
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware())
app.use(express.json())

// Mount Swagger Documentation
setupSwagger(app)

app.use('/api/v1/email', emailRouter)

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
})