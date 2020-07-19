import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import authConfig from '@config/auth'

interface ITokenDto {
  id: number
  iat: number
  exp: number
}

export default async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, String(authConfig.secret)) as ITokenDto
    // const decoded: any = await promisify(jwt.verify)(token, String(authConfig.secret)) as ITokenDto

    res.locals.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
