import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const schema = Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().optional(),
      username: Yup.string().required(),
      email: Yup.string().required().email(),
      phone: Yup.string().optional(),
      valid: Yup.bool().required(),
      role: Yup.string().default('O'),
      password: Yup.string().min(8).required()
    })

    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner })
  }
}
