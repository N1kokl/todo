import pg from 'pg'
import 'dotenv/config'

const environment =
  process.env.NODE_ENV || 'development'

const { Pool } = pg

const openDb = () => {
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database:
      environment === 'development'
        ? process.env.DB_NAME
        : process.env.TEST_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  })
}

const pool = openDb()

export { pool }
