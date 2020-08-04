import { Request, Response } from 'express'

import File from '@models/File'
import User from '@models/User'

class FileController {
  public async store (req: Request, res: Response) {
    const { originalname: name, filename: path } = req.file

    const file = File.create({ name, path })

    const user = await User.findOne(req.userId)

    if (!user) {
      return res.status(400).json({ error: 'User not found!' })
    }

    user.avatar = file

    await file.save()
    await user.save()

    return res.json(file)
  }
}

export default new FileController()
