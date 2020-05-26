import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';
import Appointment from '../models/Appointment';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle(handleData: { data: { appointment: Appointment } }) {
    const { appointment } = handleData.data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Cancelled Appointment',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date.toString()),
          "MMMM dd', at' H:mm"
        ),
      },
    });
  }
}

export default new CancellationMail();
