import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import todoRouter from './routes/todoRouter.js'
import userRouter from './routes/userRouter.js'
import { ApiError } from './helper/ApiError.js'

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/tasks', todoRouter)
app.use('/users', userRouter)

app.use((req, _res, next) => {
  return next(new ApiError('Not found', 404))
})

app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500

  if (statusCode >= 500) {
    console.error(err)
  }

  return res.status(statusCode).json({
    error: {
      message:
        statusCode >= 500
          ? 'Internal server error'
          : err.message,
      status: statusCode,
    },
  })
})

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}`,
  )
})
