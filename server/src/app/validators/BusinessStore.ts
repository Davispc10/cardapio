import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      payment: Yup.string().required(),
      phone: Yup.string().required(),
      whatsapp: Yup.string().optional(),
      segmentId: Yup.number().required(),
      street: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      postalCode: Yup.string().required(),
      locality: Yup.string().required(),
      number: Yup.string().required()
    })

    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner })
  }
}
