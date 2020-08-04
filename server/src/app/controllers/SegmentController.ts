import { Request, Response } from 'express'

import Segment from '@models/Segment'

class SegmentController {
  public async index (req: Request, res: Response) {
    const segments = await Segment.find({
      select: ['id', 'description'],
      order: {
        description: 'ASC'
      }
    })

    return res.json(segments)
  }

  public async store (req: Request, res: Response) {
    const { description } = req.body

    const segment = Segment.create({ description })

    await segment.save()

    return res.json(segment)
  }
}

export default new SegmentController()
