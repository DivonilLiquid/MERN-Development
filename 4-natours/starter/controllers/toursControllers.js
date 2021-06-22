const Tour = require('../models/tourModels');
const APIFeatures = require('../utils/APIFeatures');

exports.getTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query).filter();
    const tours = await features.query;
    //Send response
    res.status(200).json({
      status: 'success',
      size: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty', //very important, whatever value of key will be, it will group accordingly
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
      {
        $match: {
          _id: { $ne: 'easy' }, //all groups except the group which has difficulty equals to easy
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      response: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};
