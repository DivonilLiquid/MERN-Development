const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // get all tours
  const tours = await Tour.find();
  // build template
  // render template
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker',
  });
};
