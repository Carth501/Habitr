import { json } from 'body-parser';
import express from 'express';
import initializeDb from './db/init';
import authRouter from './routes/auth';
import habitsRouter from './routes/habits';

const app = express();
app.use(json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRouter);
app.use('/habits', habitsRouter);

const port = process.env.PORT || 4000;
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});