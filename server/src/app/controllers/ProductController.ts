import { Request, Response } from 'express'
import { getConnection } from 'typeorm'

import Business from '@models/Business'
import Category from '@models/Category'
import File from '@models/File'
import Product from '@models/Product'
import User from '@models/User'

class ProductController {
  public async index (req: Request, res: Response) {
    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    const products = await Product.find({
      where: { business },
      select: ['id', 'name', 'image', 'price', 'valid']
    })

    return res.json(products)
  }

  public async show (req: Request, res: Response) {
    const { businessId, id } = req.params

    const business = await Business.findOne(businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    const product = await Product.findOne(id, {
      where: { business },
      select: ['id', 'name', 'description', 'image', 'price', 'obs', 'business', 'category', 'valid']
    })

    return res.json(product)
  }

  public async store (req: Request, res: Response) {
    const business = await Business.findOne(req.params.businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    const user = await User.findOne(req.userId)

    if (!user) {
      res.status(400).json({ error: 'User not found!' })
    }

    const { categoryId } = req.body

    const category = await Category.findOne(categoryId)

    if (!category) {
      return res.status(400).json({ error: 'Category not found!' })
    }

    await getConnection().transaction(async transaction => {
      const { originalname: imageName, filename: path } = req.file

      const image = File.create({ name: imageName, path })

      await transaction.save(image)

      const { name, description, price, obs } = req.body

      const product = Product.create({
        name,
        description,
        image,
        price,
        obs,
        business,
        category,
        valid: true
      })

      await transaction.save(product)

      return res.json(product)
    })
  }

  public async update (req: Request, res: Response) {
    const { businessId, id } = req.params

    const business = await Business.findOne(businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    const user = await User.findOne(req.userId)

    if (!user) {
      res.status(400).json({ error: 'User not found!' })
    }

    const { categoryId } = req.body

    const category = await Category.findOne(categoryId)

    if (!category) {
      return res.status(400).json({ error: 'Category not found!' })
    }

    await getConnection().transaction(async transaction => {
      const { originalname: imageName, filename: path } = req.file

      const imageFound = await File.findOne({
        where: { name: imageName, path }
      })

      let image: File

      if (!imageFound) {
        image = File.create({ name: imageName, path })

        await transaction.save(image)
      }

      const { name, description, price, obs, valid } = req.body

      const product = await Product.findOne(id, {
        relations: ['business', 'category', 'image']
      })

      const newProduct = Product.merge(product, {
        name,
        description,
        image: imageFound || image,
        price,
        obs,
        business,
        category,
        valid
      })

      await transaction.save(newProduct)

      return res.json(newProduct)
    })
  }

  public async delete (req: Request, res: Response) {
    const { businessId, id } = req.params

    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    const business = await Business.findOne(businessId)

    if (!business) {
      return res.status(400).json({ error: 'Business not found!' })
    }

    await Product.delete({
      id: Number(id),
      business
    })

    return res.status(200).send()
  }
}

export default new ProductController()
