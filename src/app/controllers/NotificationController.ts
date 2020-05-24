import { Request, Response } from 'express';

import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req: Request, res: Response) {
    const isProvider = await User.findOne({
      where: { id: req.body.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.body.userId,
    })
      .sort('createdAt')
      .limit(20);

    return res.json(notifications);
  }

  async update(req: Request, res: Response) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
