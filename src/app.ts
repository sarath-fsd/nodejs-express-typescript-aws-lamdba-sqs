import express, {Request, Response, NextFunction} from 'express';
import {json} from 'body-parser';
import {emailRouter} from './routes/v1/email';
import routes from './routes';

const app = express();
app.use(json());

app.use('/', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send();
});

export {app};
