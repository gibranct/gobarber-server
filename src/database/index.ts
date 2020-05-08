import { Sequelize } from 'sequelize';

import databaseConfig from '../config/database';

class Database {
  public connection!: Sequelize;
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    this.connection.authenticate().then(
      () => {
        console.log('Connection has been established successfully.');
      },
      (err: Error) => {
        console.error('Unable to connect to the database:', err);
      }
    );
  }
}

export default new Database();
