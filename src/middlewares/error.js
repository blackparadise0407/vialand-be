const { AppError } = require('../common');

module.exports.notFound = (req, res, next) => {
  res.json(new AppError(`${req.originalUrl} not found`));
};

module.exports.error = (err, req, res, next) => {
  const statusCode = err.statusCode || '500';
  const message = err.message || 'Internal server error';
  console.log('Error stack: ', err);
  res.status(statusCode).send(new AppError(message, statusCode));
};
