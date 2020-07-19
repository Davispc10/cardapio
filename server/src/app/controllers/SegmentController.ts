import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import Segment from '@models/Segment'

class SegmentController {
  public async index (req: Request, res: Response) {
    const segments = await getRepository(Segment).find({
      select: ['id', 'description'],
      order: {
        description: 'ASC'
      }
    })

    return res.json(segments)
  }

  public async store (req: Request, res: Response) {
    const { description } = req.body

    const segment = new Segment(description)

    await getRepository(Segment).save(segment)

    return res.json(segment)
  }
}

export default new SegmentController()
