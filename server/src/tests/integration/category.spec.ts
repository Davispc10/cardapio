import path from 'path'
import request from 'supertest'

import Category from '@models/Category'
import Segment from '@models/Segment'
import User from '@models/User'

import app from '../../app'
import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

interface ISession {
  username: string
  password: string
}

interface ICategoryPost {
  description: string
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

describe('Category', () => {
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

    const responseBusiness = await request(app).post('/business')
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

    const category: ICategoryPost = await factory.attrs('Category')

    const response = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(category).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(200)
    expect(response.body.description).toBe(category.description)
  })

  it('should not be able to store without user and business', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const responseB = await request(app).post('/business/10/categories').send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseB.status).toEqual(400)

    await User.delete(responseUser.body.id)

    const responseU = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseU.status).toEqual(400)
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

    const responseBusiness = await request(app).post('/business')
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

    const category: ICategoryPost = await factory.attrs('Category')

    const categoryResponse = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(category).set({ Authorization: `Bearer ${token}` })

    const categories: Category[] = await (await request(app).get(`/business/${responseBusiness.body.id}/categories`).set({ Authorization: `Bearer ${token}` })).body

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: categoryResponse.body.id,
          description: category.description
        })
      ])
    )
  })

  it('should not be able to list all without a business', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const response = await request(app).get('/business/10/categories').set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should not be able to get one', async () => {
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

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const categoryResponse = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    const category: Category = await (await request(app).get(`/business/${responseBusiness.body.id}/categories/${categoryResponse.body.id}`).set({ Authorization: `Bearer ${token}` })).body

    expect(category).toEqual(
      expect.objectContaining({
        id: categoryResponse.body.id,
        description: category.description
      })
    )
  })

  it('should not be able to get one without a business', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const response = await request(app).get('/business/10/categories/10').set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should not be able to list all without business', async () => {
    const user: User = await factory.attrs('User')

    await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const response = await request(app).get('/business/10/categories').set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should be able to update', async () => {
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

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const categoryResponse = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    categoryData.description = 'bebidas'

    const category: Category = await (await request(app).put(`/business/${responseBusiness.body.id}/categories/${categoryResponse.body.id}`).send(categoryData).set({ Authorization: `Bearer ${token}` })).body

    expect(category).toEqual(
      expect.objectContaining({
        id: categoryResponse.body.id,
        description: category.description
      })
    )
  })

  it('should not be able to update without user, business and category', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const categoryResponse = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    categoryData.description = 'bebidas'

    const responseB = await request(app).put(`/business/10/categories/${categoryResponse.body.id}`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseB.status).toEqual(400)

    const responseC = await request(app).put(`/business/${responseBusiness.body.id}/categories/10`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseC.status).toEqual(400)

    await User.delete(responseUser.body.id)

    const responseU = await request(app).put(`/business/${responseBusiness.body.id}/categories/${categoryResponse.body.id}`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseU.status).toEqual(400)
  })

  it('should be able to delete', async () => {
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

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const responseCategory = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    const response = await request(app).delete(`/business/${responseBusiness.body.id}/categories/${responseCategory.body.id}`).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(200)
  })

  it('should not to be able to delete without user and business', async () => {
    const user: User = await factory.attrs('User')

    const responseUser = await request(app).post('/users').send(user)

    const session: ISession = {
      username: user.username,
      password: user.password
    }

    const { token } = await (await request(app).post('/sessions').send(session)).body

    const segmentData: Segment = await factory.attrs('Segment')

    const segment: Segment = await (await request(app).post('/segments').send(segmentData).set({ Authorization: `Bearer ${token}` })).body

    const business: IBusinessPost = await factory.attrs('Business')

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const responseCategory = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    const responseB = await request(app).delete(`/business/10/categories/${responseCategory.body.id}`).set({ Authorization: `Bearer ${token}` })

    expect(responseB.status).toEqual(400)

    await User.delete(responseUser.body.id)

    const response = await request(app).delete(`/business/${responseBusiness.body.id}/categories/${responseCategory.body.id}`).set({ Authorization: `Bearer ${token}` })

    expect(response.status).toEqual(400)
  })

  it('should not to be able to store and update without description', async () => {
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

    const responseBusiness = await request(app).post('/business')
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

    const categoryData: ICategoryPost = await factory.attrs('Category')

    const responseCategory = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    categoryData.description = ''

    const responseValidateUpdate = await request(app).put(`/business/${responseBusiness.body.id}/categories/${responseCategory.body.id}`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseValidateUpdate.status).toEqual(400)

    const responseValidateStore = await request(app).post(`/business/${responseBusiness.body.id}/categories`).send(categoryData).set({ Authorization: `Bearer ${token}` })

    expect(responseValidateStore.status).toEqual(400)
  })
})
