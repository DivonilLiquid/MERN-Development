const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user should have a name'],
  },
  email: String,
  photo: String,
  password: String,
  passwordConfirm: String,
});
const userModel = mongoose.Model('userModel', userSchema);
module.exports = userModel;
