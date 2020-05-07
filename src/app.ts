import express from 'express';

class App {
  server: express.Express;
  constructor() {
    this.server = express();

    this.middlewares();
  }

  middlewares() {
    this.server.use(express.json());
  }
}

export default new App().server;
