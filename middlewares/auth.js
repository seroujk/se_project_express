const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_DATA__ERROR_CODE } = require("../utils/errors");

module.exports.authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(UNAUTHORIZED_DATA__ERROR_CODE)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res
      .status(UNAUTHORIZED_DATA__ERROR_CODE)
      .send({ message: "Unauthorized" });
  }
  req.user = payload;
  return next();
};
