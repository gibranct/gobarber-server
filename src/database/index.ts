import mongoose, { Mongoose } from 'mongoose';
import { Sequelize } from 'sequelize';

import databaseConfig from '../config/database';

class Database {
  public connection!: Sequelize;
  public mongoConnection!: Mongoose;
  constructor() {
    this.init();
    this.mongodb();
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

  async mongodb() {
    this.mongoConnection = await mongoose.connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
