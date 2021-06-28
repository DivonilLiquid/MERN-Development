const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //create a token for jwt authentication
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token, //token:token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email password exists
  if (!email || !password)
    return next(new AppError('Please enter email and password', 400));
  //2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  //   const correct = await user.correctPassword(password, user.password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Wrong email or password', 401));
  }
  //   console.log(user);
  //if everything is okay then send token to client
  const token = signToken(user._id);
  console.log(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //console.log(token);
  if(!token){
    return next(new AppError('You are not logged in', 401));
  }
  //2) Verification token
  //3) check if user still exists
  //4) check if user changed password after the token was issued
  next();
});
