import request from 'supertest'

import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

describe('Session', () => {
  beforeAll(async () => {
    await PostgresMock.connect()
  })

  afterAll(async () => {
    await PostgresMock.disconect()
  })

  beforeEach(async () => {
    await PostgresMock.clearDatabase()
  })

  it('should be able to register a session user', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const response = await request(app).post('/sessions').send(session)

    expect(response.body).toHaveProperty('token')
  })

  it('should not be able to register a session without user', async () => {
    const user: User = await factory.attrs('User')

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const response = await request(app).post('/sessions').send(session)

    expect(response.status).toBe(401)
  })

  it('should not be able to register a session with a wrong user password', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: '12345678'
    }

    const response = await request(app).post('/sessions').send(session)

    expect(response.status).toBe(401)
  })

  it('should not be able to register without password', async () => {
    const user: User = await factory.attrs('User')

    const session: ISession = {
      username: user.username,
      password: ''
    }

    const response = await request(app).post('/sessions').send(session)

    expect(response.status).toBe(400)
  })
})
