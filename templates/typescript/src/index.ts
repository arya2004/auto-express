import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello, World! with typescript');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
