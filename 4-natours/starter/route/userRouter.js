//Users
const express = require('express');

const router = express.Router();
const userController = require(`${__dirname}/../controllers/userControllers`);

router.param('id', userController.CheckID);

router.route('/').get(userController.getUsers).post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
