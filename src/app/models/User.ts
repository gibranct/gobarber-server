import { Model, DataTypes, VirtualDataType, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

import database from '../../database';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  // tslint:disable-next-line: variable-name
  public password_hash!: string;
  public password!: VirtualDataType<DataTypes.StringDataType>;
  public provider!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  checkPassword(password: string) {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.VIRTUAL,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: database.connection,
    tableName: 'users',
  }
);

User.beforeSave(async (user: User) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(String(user.password), 8);
  }
});

export default User;