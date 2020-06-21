import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const schema = Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().optional(),
      username: Yup.string().required(),
      email: Yup.string().required().email(),
      phone: Yup.number().optional(),
      valid: Yup.bool().required(),
      role: Yup.string().default('O'),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword: string, field: Yup.ObjectSchema) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .when('password', (password: string, field: Yup.ObjectSchema) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        )
    })

    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner })
  }
}
