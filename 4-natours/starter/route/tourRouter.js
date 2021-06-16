//tours
const express = require('express');

const tourController = require(`${__dirname}/../controllers/toursControllers`);
const router = express.Router();

//router.param('id', tourController.CheckID);

router.route('/').get(tourController.getTours).post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
