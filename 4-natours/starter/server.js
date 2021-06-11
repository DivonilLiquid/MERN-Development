const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: `./config.env` });
const DB = process.env.DataBase.replace(
  '<password>',
  process.env.DataBasePassword
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(connection.connection);
    console.log('DB connection established!!');
  });

const app = require('./app');

const port = process.env.PORT;
// 1) Server start
console.log(app.get('env'));
// this will give us the environment in which our node app is running
// to get all environment variables, we do
//console.log(process.env);
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
