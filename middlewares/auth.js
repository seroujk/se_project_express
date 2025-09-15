const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    const err = new UnauthorizedError("Authorization required");
    return next(err);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    const err = new UnauthorizedError("Authorization required");
    return next(err);
  }
  req.user = payload;
  return next();
};
