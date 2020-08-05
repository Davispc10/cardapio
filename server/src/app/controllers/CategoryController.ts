import { Request, Response } from 'express'

import Business from '@models/Business'
import Category from '@models/Category'
import User from '@models/User'

class CategoryController {
  public async index (req: Request, res: Response) {
    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found' })
    }

    const categories = await Category.find({
      select: ['id', 'description'],
      where: { business }
    })

    return res.json(categories)
  }

  public async show (req: Request, res: Response) {
    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found' })
    }

    const category = await Category.findOne(req.params.id, {
      where: { business }
    })

    return res.json(category)
  }

  public async update (req: Request, res: Response) {
    const { description } = req.body
    const { id } = req.params

    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    const category = await Category.findOne(Number(id), {
      where: { business }
    })

    if (!category) {
      return res.status(400).json({ error: 'Category not found' })
    }

    category.description = description

    await category.save()

    return res.json(category)
  }

  public async store (req: Request, res: Response) {
    const { businessId } = req.params
    const { description } = req.body

    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const business = await Business.findOne(Number(businessId))

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    // const category = new Category({ description, business, valid: true })
    const category = Category.create({
      description, business, valid: true
    })

    await category.save()

    return res.json(category)
  }

  public async delete (req: Request, res: Response) {
    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    await Category.delete({
      id: Number(req.params.id),
      business
    })

    return res.status(200).send()
  }
}

export default new CategoryController()
