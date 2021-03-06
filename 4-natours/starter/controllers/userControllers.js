const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFunction = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating password, use resetPassword to update your password'
      ),
      400
    );
  }
  //const allowedFields = ['name', 'email'];
  const filteredObject = filterObj(req.body, 'name', 'email');
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getUser = handlerFunction.getOne(User);
exports.getUsers = handlerFunction.getAll(User);
//not for update password
exports.updateUser = handlerFunction.updateOne(User);
exports.deleteUser = handlerFunction.deleteOne(User);
