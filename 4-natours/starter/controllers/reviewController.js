// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const review = require('../models/reviewModel');
const handlerFunction = require('./handlerFactory');

exports.setTourandUserID = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = handlerFunction.getAll(review);
exports.getReview = handlerFunction.getOne(review);
exports.createReview = handlerFunction.createOne(review);
exports.updateReview = handlerFunction.updateOne(review);
exports.deleteReview = handlerFunction.deleteOne(review);
