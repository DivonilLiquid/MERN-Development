const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user should have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user should have a email'],
    unique: true,
    lowercase: true, //divonil_liquid@gmail.com all will be in lowercase
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user should have a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //gets executed when current document will be saved.
      validator: function (el) {
        //this only works for save and create
        return el === this.password;
      },
      message: 'Password are not same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpIn: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // If the pw has not been modified, then return
  // If the pw has been modified, then hash the password -> if 2 passwords are same, then their hash value will be different as well as hash value will be secured
  this.password = await bcrypt.hash(this.password, 12); //async version
  this.passwordConfirm = undefined; //till here we have make it sure that pw and pwc are same, so removing pwc
  next();
});
userSchema.pre('save', async function (next) {
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
})
//instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userpassword
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; //password changed
  }

  return false;
  //not changed
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({resetToken},this.passwordResetToken);
  this.passwordResetTokenExpIn = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;
