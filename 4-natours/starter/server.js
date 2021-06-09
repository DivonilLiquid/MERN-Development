const app = require('./app');

const port = 3000;
// 1) Server start

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
