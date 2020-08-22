import { Request, Response } from 'express'
import { getConnection } from 'typeorm'

import Address from '@models/Address'
import Business from '@models/Business'
import File from '@models/File'
import Segment from '@models/Segment'
import User from '@models/User'

class BusinessController {
  public async index (req: Request, res: Response) {
    const user = await User.findOne(req.userId, {
      relations: ['businesses', 'businesses.addresses', 'businesses.segment']
    })

    return res.json(user.businesses)
  }

  public async show (req: Request, res: Response) {
    const { id } = req.params

    const business = await Business.findOne(id, {
      relations: ['addresses', 'segment']
    })

    return res.json(business)
  }

  public async store (req: Request, res: Response) {
    const { name, description, payment, phone, whatsapp, segmentId } = req.body

    const user = await User.findOne(req.userId, {
      relations: ['businesses']
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const segment = await Segment.findOne(segmentId)

    if (!segment) {
      return res.status(400).json({ error: 'Segment not found!' })
    }

    const { originalname: logoName, filename: path } = req.file

    await getConnection().transaction(async transaction => {
      const logo = File.create({ name: logoName, path })

      await transaction.save(logo)

      const { street, city, state, postalCode, locality, number } = req.body

      const address = Address.create({
        street,
        city,
        state,
        postalCode,
        locality,
        number
      })

      await transaction.save(address)

      const business = Business.create({
        name,
        description,
        logo,
        payment,
        phone,
        whatsapp,
        segment,
        valid: true
      })

      business.addresses = [address]

      user.businesses.push(business)

      await transaction.save(business)
      await transaction.save(user)

      return res.json(business)
    })
  }

  public async update (req: Request, res: Response) {
    const { name, description, payment, phone, whatsapp, segmentId, valid } = req.body

    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const segment = await Segment.findOne(segmentId)

    if (!segment) {
      return res.status(400).json({ error: 'Segment not found!' })
    }

    await getConnection().transaction(async transaction => {
      const { originalname: logoName, filename: path } = req.file

      const imageFound = await File.findOne({
        where: { name: logoName, path }
      })

      let image: File

      if (!imageFound) {
        image = File.create({ name: logoName, path })

        await transaction.save(image)
      }

      const { street, city, state, postalCode, locality, number, addressId } = req.body

      let addressFound = await Address.findOne(addressId)

      let address: Address

      if (!addressFound) {
        address = Address.create({
          street,
          city,
          state,
          postalCode,
          locality,
          number
        })

        await transaction.save(address)
      } else {
        addressFound = Address.merge(addressFound, {
          street,
          city,
          state,
          postalCode,
          locality,
          number
        })

        await transaction.save(addressFound)
      }

      const business = await Business.findOne(req.params.id)

      const newBusiness = Business.merge(business, {
        name,
        description,
        image: imageFound || image,
        payment,
        phone,
        whatsapp,
        segment,
        valid
      })

      newBusiness.addresses = [addressFound || address]

      await transaction.save(newBusiness)

      return res.json(newBusiness)
    })
  }

  public async delete (req: Request, res: Response) {
    const { id } = req.params

    const user = await User.findOne(req.userId, {
      relations: ['businesses']
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const businessToRemove = await Business.findOne(id, {
      relations: ['addresses', 'categories', 'products']
    })

    if (!businessToRemove) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    let hasBusiness = false

    user.businesses.forEach(business => {
      if (business.id === businessToRemove.id) {
        hasBusiness = true
      }
    })

    if (hasBusiness) {
      user.businesses = user.businesses.filter(business => {
        return business.id !== businessToRemove.id
      })

      await user.save()

      businessToRemove.softRemove()

      return res.status(200).send()
    } else {
      return res.status(400).json({ error: 'Business does not belong to the logged in user' })
    }
  }
}

export default new BusinessController()
