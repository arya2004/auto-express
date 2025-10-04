import express from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.send('hello world with middleware');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
