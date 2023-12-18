const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { deleteOne, updateOne, getAll, getOne } = require('./handlerFactory');

const filterObj = function (obj, ...strs) {
  const newObj = {};
  Object.keys(obj).forEach(function (val) {
    if (strs.includes(val)) {
      newObj[val] = obj[val];
    }
  });

  return newObj;
};

exports.getMeAddParam = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.getMe = getOne(User);

exports.updateMe = catchAsync(async function (req, res, next) {
  // 1) restict that user not to update password in this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `You can't update password in this route. Try the other route /updateMyPassword`
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  console.log(filteredBody);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This api is not defined! Please try /signup instead',
  });
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
// Dont update password with this one
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
