const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find();
  res.status(200).json({
    stataus: 'success',
    data: {
      users,
    },
  });
});

exports.createUser = function (req, res) {
  res
    .status(500)
    .json({ status: 'Error', message: 'This api is not yet defined!' });
};

exports.getUser = function (req, res) {
  res
    .status(500)
    .json({ status: 'Error', message: 'This api is not yet defined!' });
};

exports.updateUser = function (req, res) {
  res
    .status(500)
    .json({ status: 'Error', message: 'This api is not yet defined!' });
};

exports.deleteUser = function (req, res) {
  res
    .status(500)
    .json({ status: 'Error', message: 'This api is not yet defined!' });
};
