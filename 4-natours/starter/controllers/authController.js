/* eslint-disable arrow-body-style */
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  // to remove password from postman output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token, //token:token,
    data: {
      user: user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  //create a token for jwt authentication
  createSendToken(newUser, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // 1) get user based on it's email
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  // 2) generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //ignoring validation
  // 3) sending reset token to email
  const resetURL = `${req.protocol}://${req.get(
    `host`
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot password? submit patch request with your new password and passwordConfirm to ${resetURL}`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token, (valid for 10 mins)`,
      message,
    });
    res.status(200).json({
      status: 'success',
      message: `Token send to ${user.email}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpIn = undefined;
    await user.save({ validateBeforeSave: false }); //ignoring validation
    return next(new AppError('There was an error in sending the email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpIn: { $gt: Date.now() },
  });

  //if token has a user, and is not expired, set the new password
  if (!user) {
    return next(new AppError('Your token has expired or invalid'), 400);
  }
  // update changed password at property of the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpIn = undefined;
  await user.save();
  //log the user in, send JWT
  createSendToken(user, 201, res);
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
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //console.log(token);
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //3) check if user still exists
  //what if someone stole the token from the user and then removed its account in order to protect him
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // console.log('User not found');
    return next(
      new AppError('The user belonging to token does not exist', 401)
    );
  }
  //4) check if user changed password after the token was issued
  // implemented in user model
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, login again'),
      401
    );
  }
  //grant access to protected route
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array [admin, lead-guide]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this acction', 403)
      );
    }
    next();
  };
};
exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from db
  const user = await User.findById(req.user.id).select('+password'); //explicitly including password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('your passwordCurrent is wrong'), 401);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});

//Only for rendered pages, with no error
exports.isLoggedIn = async (req, res, next) => {
  //1) Getting token and check of it's there
  if (req.cookies.jwt) {
    try {
      //2) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // console.log(decoded);
      //3) check if user still exists
      //what if someone stole the token from the user and then removed its account in order to protect him
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        // console.log('User not found');
        return next();
      }
      //4) check if user changed password after the token was issued
      // implemented in user model
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //There is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
