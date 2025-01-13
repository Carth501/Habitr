import { json } from 'body-parser';
import express from 'express';
import initializeDb from './db/init';
import authRouter from './routes/auth';
import habitDatesRouter from './routes/habitDates';
import habitsRouter from './routes/habits';

const app = express();
app.use(json());

app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      req.cookies[name.trim()] = decodeURIComponent(rest.join('='));
    });
  }
  next();
});

// TODO: Softcode the URLs
const habitrClientUrl = 'http://localhost:4001';
const authFlowUrl = 'http://localhost:5173';
const allowedOrigins = [habitrClientUrl, authFlowUrl];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/auth', authRouter);
app.use('/habits', habitsRouter);
app.use('/habit-dates', habitDatesRouter);

const port = process.env.PORT || 4000;
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});