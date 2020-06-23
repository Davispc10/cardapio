import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../models/User'

class UserController {
  public async index (req: Request, res: Response) {
    const users = await getRepository(User).find({
      relations: ['avatar'],
      select: ['id', 'username', 'email', 'firstName', 'valid', 'avatar'],
      order: {
        firstName: 'ASC'
      }
    })

    return res.json(users)
  }

  public async show (req: Request, res: Response) {
    const user = await getRepository(User).findOne(req.params.id, {
      select: ['id', 'avatar', 'firstName', 'lastName', 'username', 'email', 'phone', 'role', 'valid'],
      relations: ['avatar']
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    return res.json(user)
  }

  public async store (req: Request, res: Response) {
    const userData: User = req.body

    let userExist = await getRepository(User).findOne({ email: userData.email })

    if (userExist) {
      return res.status(400).json({ error: 'User email already exist' })
    }

    userExist = await getRepository(User).findOne({ username: userData.username })

    if (userExist) {
      return res.status(400).json({ error: 'Username already exist' })
    }

    const user = new User(userData)

    await getRepository(User).save(user)

    const { firstName, email, username, lastName, phone, role, valid, id } = user

    return res.json({
      firstName,
      email,
      username,
      lastName,
      phone,
      role,
      valid,
      id
    })
  }

  public update = async (req: Request, res: Response) => {
    const { email, username, reset, password, oldPassword } = req.body

    const user = await getRepository(User).findOne(res.locals.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    if (email !== user.email) {
      const userExits = await getRepository(User).findOne({ email })

      if (userExits) {
        return res.status(400).json({ error: 'User email already exists' })
      }
    }

    if (username !== user.username) {
      const userExits = await getRepository(User).findOne({ username })

      if (userExits) {
        return res.status(400).json({ error: 'Username already exists' })
      }
    }

    if (oldPassword && !(user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const newUser = await getRepository(User).merge(user, req.body)

    if (reset) {
      newUser.password = '123456'
      newUser.hashPassword()
    } else if (password) {
      newUser.hashPassword()
    }

    await getRepository(User).save(newUser)

    const { firstName, lastName, phone, role, valid, id } = newUser

    return res.json({
      firstName,
      email,
      username,
      lastName,
      phone,
      role,
      valid,
      id
    })
  }
}

export default new UserController()
