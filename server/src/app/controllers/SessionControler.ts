import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import authConfig from '@config/auth'
import User from '@models/User'

class SessionController {
  public async store (req: Request, res: Response) {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    if (!(user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const { id, firstName, email, avatar, role } = user

    return res.json({
      user: {
        id, firstName, username, email, role, avatar
      },
      token: jwt.sign({ id }, String(authConfig.secret), {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new SessionController()
