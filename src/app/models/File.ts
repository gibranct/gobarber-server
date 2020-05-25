import { Model, DataTypes } from 'sequelize';

import database from '../../database';

class File extends Model {
  public id!: number;
  public name!: string;
  public path!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `http://localhost:3333/files/${(this as any).path}`;
      },
    },
  },
  {
    tableName: 'files',
    sequelize: database.connection,
  }
);

export default File;
