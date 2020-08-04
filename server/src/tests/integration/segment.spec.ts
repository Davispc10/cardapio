import request from 'supertest'

import Segment from '@models/Segment'
import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

describe('Segment', () => {
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

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segment: Segment = await factory.attrs('Segment')

    const response = await request(app).post('/segments').send(segment).set({ Authorization: `Bearer ${token}` })

    expect(response.body.description).toBe(segment.description)
  })

  it('should be able to list all', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segment: Segment = await factory.attrs('Segment')

    await (await request(app).post('/segments').send(segment).set({ Authorization: `Bearer ${token}` })).body

    const listSegments: Segment[] = await (await request(app).get('/segments').set({ Authorization: `Bearer ${token}` })).body

    expect(listSegments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: segment.description
        })
      ])
    )
  })

  it('should not be able to register', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segment: Segment = await factory.attrs('Segment')

    segment.description = ''

    const response = await request(app).post('/segments').send(segment).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })
})
