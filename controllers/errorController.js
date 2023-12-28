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

const errorDev = function (err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    const err = new AppError(
      'Something went wrong. Please try again later!',
      404
    );
    res.status(err.statusCode).render('error', {
      message: err.message,
    });
  }
};

const errorProd = function (err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
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
  } else {
    const err = new AppError(
      'Something went wrong. Please try again later!',
      404
    );
    res.status(err.statusCode).render('error', {
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('ERROR 💥 ' + err.name);
    errorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('ERROR 💥 ' + err.name);

    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateError(err);
    }
    if (error.name === 'ValidationError') {
      error = handleValidatorError(err);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(err);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredJWT(err);
    }

    errorProd(error, req, res);
  }
};
