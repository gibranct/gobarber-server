import {
  startOfDay,
  endOfDay,
  setSeconds,
  setMinutes,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import { Request, Response } from 'express';

import Appointment from '../models/Appointment';

// tslint:disable-next-line: prefer-array-literal
const schedule = [...new Array(12)].map((_, index) => {
  const offset = 8;
  const hour = index + offset;
  return hour >= 9 ? `${hour}:00` : `0${hour}:00`;
});

class AvailableController {
  async index(req: Request, res: Response) {
    const searchDate = Number.parseInt(req.query.date as string, 10);

    try {
      if (!searchDate) {
        return res.status(400).json({ error: 'Invalid date' });
      }

      const appointments = await Appointment.findAll({
        where: {
          provider_id: req.params.providerId,
          canceled_at: null,
          date: {
            [Op.between]: [
              startOfDay(searchDate).toISOString(),
              endOfDay(searchDate).toISOString(),
            ],
          },
        },
      });

      const available = schedule.map(time => {
        const [hour] = time.split(':');
        const value = setSeconds(
          setMinutes(searchDate, Number.parseInt(hour, 10)),
          0
        );

        return {
          time,
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          available:
            isAfter(searchDate, new Date()) &&
            !appointments.find(a => format(a.date, 'HH:mm') === time),
        };
      });

      return res.json(available);
    } catch (error) {
      console.error(error);
      return res.json(error);
    }
  }
}

export default new AvailableController();
