//Users
const express = require('express');

const router = express.Router();
const userController = require(`../controllers/userControllers`);

const authController = require(`../controllers/authController`);
// const { route } = require('../app');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.param('id', userController.CheckID);

router.route('/').get(userController.getUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );
module.exports = router;
