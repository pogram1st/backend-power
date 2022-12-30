import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import workRouter from './routes/work.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', workRouter);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log('Server start');
});
