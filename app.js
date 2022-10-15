/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
import './config/db';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use(routes);
    this.app.get('/', (req, res) => {
      res.send('NewsLBS API');
    });
  }
}

const { app } = new App();

export default app;
