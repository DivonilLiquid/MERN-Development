//tours
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
//each router by default has access to params of their route
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourandUserID,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview) //to get particular review
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
