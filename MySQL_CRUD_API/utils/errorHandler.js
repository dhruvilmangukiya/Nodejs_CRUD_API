const Boom = require('@hapi/boom');

const errorHandler = (error, req, res, next) => {
  if (Boom.isBoom(error)) {
    const { statusCode, payload } = error.output;
    return res.status(statusCode).json(payload);
  }
}

module.exports = {
    errorHandler
};