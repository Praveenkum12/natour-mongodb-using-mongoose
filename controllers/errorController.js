const AppError = require('./../utils/appError');

const handleCastError = function (error) {
  const message = `Invalid ${error.path} ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = function (error) {
  const val = error.message.match(/"([^"]*)"/)[0];
  return new AppError(
    `Duplicate field: ${val}. Try another field of name.`,
    404
  );
};

const handleValidatorError = function (err) {
  const error = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${error.join('. ')}`, 404);
};

const handleJWTError = function (err) {
  return new AppError('Please login... Token is Invalid', 401);
};

const handleExpiredJWT = function (err) {
  return new AppError('Please login again... Token is expired', 401);
};

const errorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const errorProd = function (err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('ERROR 💥 ' + err.name);

    errorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('ERROR 💥 ' + err.name);

    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastError(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateError(err);
    }
    if (err.name === 'ValidationError') {
      error = handleValidatorError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(err);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleExpiredJWT(err);
    }

    errorProd(error, res);
  }
};
