const AppError = require('../utils/appError');

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue).join('');
  const message = `The key '${key}' has duplicate value of '${err.keyValue[key]}'`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} with ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const values = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  const message = `Invalid input as ${values} `;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } //Unknown error
  else {
    //console.error('Error 💥', err);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong 💥',
    });
  }
};
const handleJsonWebTokenError = () =>
  new AppError('You are not logged in, Please login', 401);

const handleTokenExpiredError = () =>
  new AppError('Your token has expired, login again', 401);

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //mongoose errors are of 3 types:
    // 1) CastError
    let error = { ...err };
    //hard copy of error
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    //console.error(err);
    // 2) MongoError
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // 3) ValidatorError
    if (err._message === 'Validation failed') {
      console.log('Found validator');
      error = handleValidationErrorDB(error);
    }
    //jwt errors
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, res);
  }
};
