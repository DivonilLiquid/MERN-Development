const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The forest hiker',
//     name: 'divonil',
//   });
// });
router.get('/', viewController.getOverview);
// router.get('/tours', viewController.getTour);
router.get('/tour/:slug', authController.protect, viewController.getTour);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
module.exports = router;
