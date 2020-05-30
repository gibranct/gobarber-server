import { Options } from 'sequelize';

const config = require('./config.json');

const { host, username, password, database, port } = config.development;

const DB_HOST = process.env.DB_HOST || host;
const DB_USER = process.env.DB_USER || username;
const DB_PASS = process.env.DB_PASS || password;
const DB_NAME = process.env.DB_NAME || database;
const DB_PORT = process.env.DB_PORT || port;

const databaseConfig: Options = {
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
  define: {
    timestamps: true,
    underscored: true,
  },
};

export default databaseConfig;
