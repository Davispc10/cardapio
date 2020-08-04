import path from 'path'
import request from 'supertest'
import { getRepository } from 'typeorm'

import Business from '@models/Business'
import Segment from '@models/Segment'
import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

interface IBusinessPost {
  name: string,
  description: string,
  payment: string,
  phone: string,
  whatsapp: string,
  street: string,
  city: string,
  state: string,
  postalCode: string,
  locality: string,
  number: string,
}

describe('Business', () => {
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

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    const response = await request(app).post('/business')
      .field('name', business.name)
      .field('description', business.description)
      .field('payment', business.payment)
      .field('phone', business.phone)
      .field('whatsapp', business.whatsapp)
      .field('street', business.street)
      .field('city', business.city)
      .field('state', business.state)
      .field('postalCode', business.postalCode)
      .field('locality', business.locality)
      .field('number', business.number)
      .field('segmentId', segment.id)
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(200)
  })

  it('should not be able to register without user', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    await getRepository(User).delete(responseUser.body.id)

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    const response = await request(app).post('/business')
      .field('name', business.name)
      .field('description', business.description)
      .field('payment', business.payment)
      .field('phone', business.phone)
      .field('whatsapp', business.whatsapp)
      .field('street', business.street)
      .field('city', business.city)
      .field('state', business.state)
      .field('postalCode', business.postalCode)
      .field('locality', business.locality)
      .field('number', business.number)
      .field('segmentId', segment.id)
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should not be able to register without segment', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const business: IBusinessPost = await factory.attrs('Business')

    const response = await request(app).post('/business')
      .field('name', business.name)
      .field('description', business.description)
      .field('payment', business.payment)
      .field('phone', business.phone)
      .field('whatsapp', business.whatsapp)
      .field('street', business.street)
      .field('city', business.city)
      .field('state', business.state)
      .field('postalCode', business.postalCode)
      .field('locality', business.locality)
      .field('number', business.number)
      .field('segmentId', 10)
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should be able to list all', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    await request(app).post('/business')
      .field('name', business.name)
      .field('description', business.description)
      .field('payment', business.payment)
      .field('phone', business.phone)
      .field('whatsapp', business.whatsapp)
      .field('street', business.street)
      .field('city', business.city)
      .field('state', business.state)
      .field('postalCode', business.postalCode)
      .field('locality', business.locality)
      .field('number', business.number)
      .field('segmentId', segment.id)
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })

    const businesses: Business = await (await request(app).get('/business').set({ Authorization: `Bearer ${token}` })).body

    expect(businesses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: business.name,
          description: business.description,
          payment: business.payment,
          phone: business.phone,
          whatsapp: business.whatsapp,
          segment: segment,
          valid: true,
          addresses: expect.arrayContaining([
            expect.objectContaining({
              street: business.street,
              city: business.city,
              state: business.state,
              postalCode: business.postalCode,
              locality: business.locality,
              number: business.number
            })
          ])
        })
      ])
    )
  })

  it('should be able to get one', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const businessData: IBusinessPost = await factory.attrs('Business')

    const business: Business = await (await request(app).post('/business')
      .field('name', businessData.name)
      .field('description', businessData.description)
      .field('payment', businessData.payment)
      .field('phone', businessData.phone)
      .field('whatsapp', businessData.whatsapp)
      .field('street', businessData.street)
      .field('city', businessData.city)
      .field('state', businessData.state)
      .field('postalCode', businessData.postalCode)
      .field('locality', businessData.locality)
      .field('number', businessData.number)
      .field('segmentId', segment.id)
      .attach('file', path.resolve(__dirname, '..', 'util', 'nodejs.jpg'))
      .set({ Authorization: `Bearer ${token}` })).body

    const businessReceived: Business = await (await request(app).get(`/business/${business.id}`).set({ Authorization: `Bearer ${token}` })).body

    expect(businessReceived).toEqual(
      expect.objectContaining({
        name: business.name,
        description: business.description,
        payment: business.payment,
        phone: business.phone,
        whatsapp: business.whatsapp,
        segment: segment,
        valid: true,
        addresses: expect.arrayContaining([
          expect.objectContaining({
            street: businessData.street,
            city: businessData.city,
            state: businessData.state,
            postalCode: businessData.postalCode,
            locality: businessData.locality,
            number: businessData.number
          })
        ])
      })
    )
  })
})
