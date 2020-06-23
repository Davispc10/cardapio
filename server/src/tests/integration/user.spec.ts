import bcrypt from 'bcryptjs'
import request from 'supertest'
import { getRepository } from 'typeorm'

import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import Postgresmock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

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
  })

  it('should not be able to register with duplicated email', async () => {
    const user: User = await factory.attrs('User')

    await request(app)
      .post('/users')
      .send(user)

    const response = await request(app)
      .post('/users')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not be able to register with duplicated username', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    user.email = 'test@gmail.com'

    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(400)
  })

  it('should encrypt user password when new user created', async () => {
    let user = new User(await factory.attrs('User'))

    user.password = '12345678'
    user = await getRepository(User).save(user)

    const compareHash = bcrypt.compareSync('12345678', user.password)

    expect(compareHash).toBe(true)
  })

  it('should not be able to register without email', async () => {
    const user: User = await factory.attrs('User')

    user.email = ''

    const response = await request(app)
      .post('/users')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should be able to list all users created', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const users: User[] = await (await request(app).get('/users').set({ Authorization: `Bearer ${token}` })).body

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: user.username
        })
      ])
    )
  })

  it('should not be able to list without a token', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(401)
  })

  it('should not be able to list without a valid token', async () => {
    const token = 'S564FER6V2W4V562VWE6W2V6V6Ev61v6V562RV1621'

    const response = await request(app).get('/users').set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(401)
  })

  it('should be able to get a user', async () => {
    const user: User = await factory.attrs('User')

    const userCreated = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const response = await request(app).get(`/users/${userCreated.body.id}`).set({ Authorization: `Bearer ${token}` })

    expect(response.body.username).toBe(user.username)
  })

  it('should not be able to get a user not created', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const response = await request(app).get(`/users/${10}`).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })

  it('should be able to update', async () => {
    const user: User = await factory.attrs('User')
    const userUpdate: User = await factory.attrs('UserUpdate')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    userUpdate.firstName = 'David'

    const response = await request(app).put('/users').send(userUpdate).set({ Authorization: `Bearer ${token}` })

    expect(response.body.firstName).toBe('David')
  })

  it('should not be able to update without userId', async () => {
    const user: User = await factory.attrs('User')

    const userCreated: User = await (await request(app).post('/users').send(user)).body

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    await getRepository(User).delete({ id: userCreated.id })

    const response = await request(app).put('/users').send(userCreated).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })

  it('should not be able to update with duplicate email', async () => {
    const user: User = await factory.attrs('User')
    const user2: User = await factory.attrs('User2')

    await request(app).post('/users').send(user)

    const userUpdate: User = await (await request(app).post('/users').send(user2)).body

    const session: ISession = {
      username: user2.username,
      password: user2.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    userUpdate.email = user.email

    const response = await request(app).put('/users').send(userUpdate).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })

  it('should not be able to update with duplicate username', async () => {
    const user: User = await factory.attrs('User')
    const user2: User = await factory.attrs('User2')

    await request(app).post('/users').send(user)

    const userUpdate: User = await (await request(app).post('/users').send(user2)).body

    const session: ISession = {
      username: user2.username,
      password: user2.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    userUpdate.username = user.username

    const response = await request(app).put('/users').send(userUpdate).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })

  it('should not be able to update with wrong oldPassword', async () => {
    const user: User = await factory.attrs('User')

    await (await request(app).post('/users').send(user)).body

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    user.oldPassword = '12312312'
    user.password = '12345678'
    user.confirmPassword = '12345678'

    const response = await request(app).put('/users').send(user).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(401)
  })

  it('should be able to update and reset password', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const userUpdate = {
      username: user.username,
      email: user.email,
      valid: user.valid,
      firstName: user.firstName,
      reset: true
    }

    const responseData = await request(app).put('/users').send(userUpdate).set({ Authorization: `Bearer ${token}` })

    const userUpdated = await getRepository(User).findOne(responseData.body.id)

    const compareHash = bcrypt.compareSync('123456', userUpdated.password)

    expect(compareHash).toBe(true)
  })

  it('should be able to update changing password', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const userUpdate = {
      ...user,
      oldPassword: user.password,
      password: '12345678',
      confirmPassword: '12345678'
    }

    const responseData = await request(app).put('/users').send(userUpdate).set({ Authorization: `Bearer ${token}` })

    const userUpdated = await getRepository(User).findOne(responseData.body.id)

    const compareHash = bcrypt.compareSync('12345678', userUpdated.password)

    expect(compareHash).toBe(true)
  })

  it('should not be able to update without username', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const userUpdate = {
      email: user.email,
      valid: user.valid,
      firstName: user.firstName,
      reset: true
    }

    const response = await request(app)
      .put('/users')
      .send(userUpdate)
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(400)
  })
})
