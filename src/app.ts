import express from 'express';

import './database';

class App {
  public server: express.Express;
  constructor() {
    this.server = express();

    this.middlewares();
  }

  middlewares() {
    this.server.use(express.json());
  }
}

export default new App().server;
