const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();
// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The forest hiker',
//     name: 'divonil',
//   });
// });
router.get('/', viewController.getOverview);
router.get('/tour', viewController.getTour);
module.exports = router;
