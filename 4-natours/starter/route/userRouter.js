//Users
const express = require('express');

const router = express.Router();
const userController = require(`../controllers/userControllers`);

const authController = require(`../controllers/authController`);
// const { route } = require('../app');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
//protecting all routes after this middleware
router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// router.param('id', userController.CheckID);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect, userController.deleteUser);
module.exports = router;
