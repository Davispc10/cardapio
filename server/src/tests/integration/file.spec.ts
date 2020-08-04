import path from 'path'
import request from 'supertest'
import { getRepository } from 'typeorm'

import File from '@models/File'
import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

describe('File', () => {
  beforeAll(async () => {
    await PostgresMock.connect()
  })

  afterAll(async () => {
    await PostgresMock.disconect()
  })

  beforeEach(async () => {
    await PostgresMock.clearDatabase()
  })

  it('should be able to register', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (
      await request(app).post('/sessions').send(session)
    ).body

    const file = await (await request(app).post('/files')
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })).body

    const userCreated = await getRepository(User).findOne(responseUser.body.id, { relations: ['avatar'] })

    expect(userCreated.avatar.id).not.toBeNull()

    await getRepository(File).delete(file)
  })

  it('should not be able to register', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (
      await request(app).post('/sessions').send(session)
    ).body

    await getRepository(User).delete(responseUser.body.id)

    const response = await request(app).post('/files')
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })
})
