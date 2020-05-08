import { Options } from 'sequelize';

const databaseConfig: Options = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
};

export default databaseConfig;
