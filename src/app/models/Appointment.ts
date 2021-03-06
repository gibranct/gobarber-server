import Sequelize, { Model, VirtualDataType, DataTypes } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import database from '../../database';

class Appointment extends Model {
  public id!: number;
  public date!: Date;
  public formattedDate!: string;
  public provider!: User;
  public user!: User;

  // tslint:disable-next-line: variable-name
  public canceled_at!: Date;
  // tslint:disable-next-line: variable-name
  public user_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    date: Sequelize.STRING,
    canceled_at: Sequelize.DATE,
    past: {
      type: Sequelize.VIRTUAL,
      get() {
        return isBefore((this as any).date, new Date());
      },
    },
    cancelable: {
      type: Sequelize.VIRTUAL,
      get() {
        return isBefore(new Date(), subHours((this as any).date, 2));
      },
    },
  },
  {
    sequelize: database.connection,
    tableName: 'appointments',
  }
);

Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Appointment.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

export default Appointment;
