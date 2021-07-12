const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModels');
const review = require('../../models/reviewModel');
const user = require('../../models/userModels');

dotenv.config({ path: './config.env' });
const DB = process.env.DataBase.replace(
  '<password>',
  process.env.DataBasePassword
);
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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await review.create(reviews);
    await user.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await review.deleteMany();
    await user.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  // node ./dev-data/data/import-dev-data.js --import
  importData();
} else if (process.argv[2] === '--delete') {
  // node ./dev-data/data/import-dev-data.js --delete
  deleteData();
}
