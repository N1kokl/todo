import { expect } from 'chai'
import {
  getToken,
  initializeTestDb,
  insertTestUser,
} from './helper/test.js'

const apiUrl = 'http://localhost:3001'

before(async () => {
  await initializeTestDb()
})

describe(
  'Testing basic database functionality',
  () => {
    let token

    before(() => {
      token = getToken('foo@foo.com')
    })

    it('should get all tasks', async () => {
      const response = await fetch(
        `${apiUrl}/tasks`,
      )
      const data = await response.json()

      expect(response.status).to.equal(200)
      expect(data)
        .to.be.an('array')
        .that.is.not.empty
      expect(data[0]).to.include.all.keys([
        'id',
        'description',
      ])
    })

    it('should not create a task without authentication', async () => {
      const response = await fetch(
        `${apiUrl}/tasks`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task: {
              description: 'Unauthorized task',
            },
          }),
        },
      )

      expect(response.status).to.equal(401)
    })

    it('should create a new task', async () => {
      const newTask = {
        description: 'Test task',
      }

      const response = await fetch(
        `${apiUrl}/tasks`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: newTask,
          }),
        },
      )

      const data = await response.json()

      expect(response.status).to.equal(201)
      expect(data).to.include.all.keys([
        'id',
        'description',
      ])
      expect(data.description).to.equal(
        newTask.description,
      )
    })

    it('should not create a new task without description', async () => {
      const response = await fetch(
        `${apiUrl}/tasks`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: null,
          }),
        },
      )

      const data = await response.json()

      expect(response.status).to.equal(400)
      expect(data).to.have.property('error')
    })

    it('should delete task', async () => {
      const response = await fetch(
        `${apiUrl}/tasks/1`,
        {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      expect(response.status).to.equal(200)
      expect(data).to.have.property('id')
    })
  },
)

describe('Testing user management', () => {
  const user = {
    email: 'foo2@test.com',
    password: 'password123',
  }

  before(async () => {
    await insertTestUser(user)
  })

  it('should sign up', async () => {
    const newUser = {
      email: 'foo@test.com',
      password: 'password123',
    }

    const response = await fetch(
      `${apiUrl}/users/signup`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: newUser,
        }),
      },
    )

    const data = await response.json()

    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys([
      'id',
      'email',
    ])
    expect(data).not.to.have.property('password')
    expect(data.email).to.equal(newUser.email)
  })

  it('should log in', async () => {
    const response = await fetch(
      `${apiUrl}/users/signin`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      },
    )

    const data = await response.json()

    expect(response.status).to.equal(200)
    expect(data).to.include.all.keys([
      'id',
      'email',
      'token',
    ])
    expect(data.email).to.equal(user.email)
  })

  it('should reject a wrong password', async () => {
    const response = await fetch(
      `${apiUrl}/users/signin`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: user.email,
            password: 'wrong-password',
          },
        }),
      },
    )

    expect(response.status).to.equal(401)
  })
})
