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
exports.login = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login');
});
exports.signUp = catchAsync(async (req, res) => {
  res.status(200).render('signUp');
});
exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'review',
    fields: 'review rating user',
  });
  // console.log(tour);
  console.log(tour.name);
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});
