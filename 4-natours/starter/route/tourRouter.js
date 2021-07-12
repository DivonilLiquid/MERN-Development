//tours
const express = require('express');
const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRouter');

const tourController = require(`${__dirname}/../controllers/toursControllers`);
const router = express.Router();

//router.param('id', tourController.CheckID);
router.use('/:tourId/reviews', reviewRouter);
//for this specific route, we will use reviewRouter
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:id').get(tourController.getMonthlyPlan);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
//tours-within/233/center/-40,45/unit/mi
router
  .route('/')
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.addTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
