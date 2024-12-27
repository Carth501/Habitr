import { json } from 'body-parser';
import express from 'express';
import authRouter from './routes/auth';

const app = express();
app.use(json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});