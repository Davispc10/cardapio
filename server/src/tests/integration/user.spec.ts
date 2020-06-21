import bcrypt from 'bcryptjs'
import request from 'supertest'
import { getRepository } from 'typeorm'

// import User from '@models/User'
import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import Postgresmock from '../util/PostgresMock'

describe('User', () => {
  beforeAll(async () => {
    await Postgresmock.connect()
  })

  afterAll(async () => {
    await Postgresmock.disconect()
  })

  beforeEach(async () => {
    await getRepository(User).clear()
  })

  it('should be able to register', async () => {
    const user: User = await factory.attrs('User')

    const response = await request(app).post('/users').send(user)

    expect(response.body).toHaveProperty('id')

    const users = await getRepository(User).find()

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: user.username
        })
      ])
    )
  })

  it('should encrypt user password when new user created', async () => {
    const user = new User(await factory.attrs('User'))

    user.password = '12345678'
    user.hashPassword()

    const compareHash = await bcrypt.compare('12345678', user.password)

    expect(compareHash).toBe(true)
  })
})
