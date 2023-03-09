const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers["token"];
  if (!token) return next(Boom.proxyAuthRequired(messages.TOKEN_MISSING));

  try{
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded.user_id;
  }catch(error) {
    return next(Boom.proxyAuthRequired(messages.INVALID_TOKEN));
  }
  return next();
};

module.exports = verifyToken;