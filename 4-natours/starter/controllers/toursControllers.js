const Tour = require('../models/tourModels');
// const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const handlerFunction = require('./handlerFactory');

exports.getTours = handlerFunction.getAll(Tour);
exports.getTour = handlerFunction.getOne(Tour, { path: 'review' });
exports.addTour = handlerFunction.createOne(Tour);
exports.updateTour = handlerFunction.updateOne(Tour);
exports.deleteTour = handlerFunction.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numsRating: { $avg: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    response: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.id * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    response: {
      plan,
    },
  });
});
