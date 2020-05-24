import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req: Request<any, any, any, { date: string }>, res: Response) {
    const isProvider = await User.findOne({
      where: { id: req.body.userId, provider: true },
    });

    if (!isProvider) {
      return res.json({ error: 'User is not a provider' });
    }

    const { date = new Date().toISOString() } = req.query;
    const isoDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.body.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(isoDate).toISOString(),
            endOfDay(isoDate).toISOString(),
          ],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
