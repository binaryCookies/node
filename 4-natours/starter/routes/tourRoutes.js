const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

//* Searches for route with id (1st arg), passes the value to value (arg 4)
router.param('id', tourController.checkID);
router.param('tours', tourController.createTour);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
