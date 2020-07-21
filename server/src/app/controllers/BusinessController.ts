import { Request, Response } from 'express'
import { getRepository, getConnection } from 'typeorm'

import Address from '@models/Address'
import Business from '@models/Business'
import File from '@models/File'
import Segment from '@models/Segment'
import User from '@models/User'

class BusinessController {
  public async index (req: Request, res: Response) {
    const user = await getRepository(User).findOne(res.locals.userId, {
      relations: ['businesses', 'businesses.addresses', 'businesses.segment']
    })

    return res.json(user.businesses)
  }

  public async show (req: Request, res: Response) {
    const { id } = req.params

    const business = await getRepository(Business).findOne(id, {
      relations: ['addresses', 'segment']
    })

    return res.json(business)
  }

  public async store (req: Request, res: Response) {
    const { name, description, payment, phone, whatsapp, segmentId, valid } = req.body

    const user = await getRepository(User).findOne(res.locals.userId, {
      relations: ['businesses']
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const segment = await getRepository(Segment).findOne(segmentId)

    if (!segment) {
      return res.status(400).json({ error: 'Segment not found!' })
    }

    const { originalname: logoName, filename: path } = req.file

    await getConnection().transaction(async transaction => {
      const logo = new File(logoName, path)

      await transaction.save(logo)

      const { street, city, state, postalCode, locality, number } = req.body

      const address = new Address(
        street,
        city,
        state,
        postalCode,
        locality,
        number
      )

      await transaction.save(address)

      const business = new Business(
        name,
        description,
        logo,
        payment,
        phone,
        whatsapp,
        segment,
        valid
      )

      business.addresses = [address]

      user.businesses.push(business)

      await transaction.save(business)
      await transaction.save(user)

      return res.json({ business, user })
    })
  }
}

export default new BusinessController()
