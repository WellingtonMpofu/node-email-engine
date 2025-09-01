import emailRouter from './routes/emailRoutes.mjs'
import express from 'express'
import "dotenv/config"

const app = express()
app.use(express.json())
app.use('/api/v1/email', emailRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})