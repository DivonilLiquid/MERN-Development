const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(500).send({
    status: 'fail',
    data: users,
  });
});
exports.addUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'server not defined',
  });
};
