const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DataBase.replace(
  '<password>',
  process.env.DataBasePassword
);
// DB has the string to connect our express app with database
mongoose
  .connect(DB, {
    // .connect returns promise
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // useUnifiedTopology: true,
    //deprication warnings !!!
  })
  .then(() => {
    console.log('DB connection established!!');
  });

const port = process.env.PORT;
// 1) Server start
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
