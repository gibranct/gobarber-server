import Sequelize, { Model, VirtualDataType, DataTypes } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import database from '../../database';

class Appointment extends Model {
  public id!: number;
  public date!: Date;

  // tslint:disable-next-line: variable-name
  public canceled_at!: Date;

  get past() {
    return isBefore(this.date, new Date());
  }

  get cancelable() {
    return isBefore(new Date(), subHours(this.date, 2));
  }

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    date: Sequelize.STRING,
    canceled_at: Sequelize.DATE,
  },
  {
    sequelize: database.connection,
    tableName: 'appointments',
  }
);

Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Appointment.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

export default Appointment;
