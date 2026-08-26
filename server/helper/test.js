import fs from 'fs/promises'
import path from 'path'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from './db.js'

const __dirname = import.meta.dirname

const initializeTestDb = async () => {
  const sql = await fs.readFile(
    path.resolve(__dirname, '../db.sql'),
    'utf8',
  )

  await pool.query(sql)
}

const insertTestUser = async (user) => {
  const hashedPassword = await hash(
    user.password,
    10,
  )

  await pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2)',
    [
      user.email.trim().toLowerCase(),
      hashedPassword,
    ],
  )
}

const getToken = (email) => {
  return jwt.sign(
    { email: email.trim().toLowerCase() },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  )
}

export {
  initializeTestDb,
  insertTestUser,
  getToken,
}
