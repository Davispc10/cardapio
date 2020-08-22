import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().required(),
      categoryId: Yup.number().required(),
      obs: Yup.string().optional(),
      valid: Yup.boolean().required()
    })

    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner })
  }
}
