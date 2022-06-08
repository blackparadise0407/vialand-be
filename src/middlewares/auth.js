const { AppError } = require('../common');

module.exports.auth = async (req, res, next) => {
  const {
    headers: { secret },
  } = req;
  if (!secret || secret !== process.env.SECRET) {
    next(new AppError('Unauthorized', 401));
  }
  next();
};
