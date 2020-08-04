import { getRepository } from 'typeorm'

import Address from '@models/Address'

import factory from '../factories'
import PostgresMock from '../util/PostgresMock'

describe('Address', () => {
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
    const addressData: Address = await factory.attrs('Address')

    const address = Address.create({
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      postalCode: addressData.postalCode,
      locality: addressData.locality,
      number: addressData.number
    })

    await getRepository(Address).save(address)

    const data = await getRepository(Address).find()

    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
          locality: addressData.locality,
          number: addressData.number
        })
      ])
    )
  })
})
