import * as Yup from 'yup';
import { Request, Response } from 'express';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req: Request<any, any, any, { page: number }>, res: Response) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        user_id: req.body.userId,
        canceled_at: null,
      },
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    try {
      await schema.validate(req.body);

      const { provider_id, date } = req.body;

      const isProvider = await User.findOne({
        where: {
          id: provider_id,
          provider: true,
        },
      });

      if (!isProvider) {
        return res
          .status(400)
          .json({ error: 'You can only create appointments with a provider' });
      }

      if (provider_id === req.body.userId) {
        return res
          .status(400)
          .json({ error: 'You cannot make an appointment with yourself' });
      }

      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(400).json({
          error: 'Past dates are not permmited',
        });
      }

      const isAvailable = await Appointment.findOne({
        where: {
          provider_id,
          canceled_at: null,
          date: hourStart,
        },
      });

      if (isAvailable) {
        return res
          .status(400)
          .json({ error: 'Appointment date is not available' });
      }
      const appointment = await Appointment.create<Appointment>({
        provider_id,
        user_id: req.body.userId,
        date: hourStart.toISOString(),
      });

      const user = await User.findByPk(req.body.userId);
      const formattedDate = format(hourStart, "MMMM dd', at' H:mm");

      await Notification.create({
        content: `New appointment of ${user?.name} to ${formattedDate}`,
        user: provider_id,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: error?.errors ?? error });
    }
  }

  async delete(req: Request, res: Response) {
    const appointment = (await Appointment.findByPk<Appointment>(
      req.params.id,
      {
        include: [
          { model: User, as: 'provider', attributes: ['name', 'email'] },
          { model: User, as: 'user', attributes: ['name'] },
        ],
      }
    )) as Appointment;

    if (appointment.user_id !== req.body.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Cancelled Appointment',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "MMMM dd', at' H:mm"),
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
