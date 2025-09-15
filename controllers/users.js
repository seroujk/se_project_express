const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// GET /users/me - returns a user by _id
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const err = new NotFoundError("User not found");
        return next(err);
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        const err = new BadRequestError("Invalid ID format");
        return next(err);
      }
      return next(error);
    });
};

// PATCH users/me
module.exports.updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        const err = new NotFoundError("User not found");
        return next(err);
      }
      return res.status(200).send(updatedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new BadRequestError("Invalid user data");
        return next(err);
      }
      if (error.name === "CastError") {
        const err = new BadRequestError("Invalid ID format");
        return next(err);
      }
      return next(error);
    });
};

// POST /users - create a user
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPass) =>
      User.create({ name, avatar, email, password: hashedPass })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      return res.status(201).send(userObject);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new BadRequestError("Invalid user data");
        return next(err);
      }
      if (error.code === 11000) {
        const err = new ConflictError("Email already exists");
        return next(err);
        // return res
        //   .status(DUPLICATE_DATA_ERROR_CODE_CODE)
        //   .send({ message: "Email already exists" });
      }
      return next(error);
    });
};

// Authentication Handler
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new BadRequestError(
      "The email and password fields are required"
    );
    return next(err);
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((error) => {
      // Authentication error
      if (error.message.includes("Incorrect email or password")) {
        const err = new UnauthorizedError(error.message);
        return next(err);
      }
      return next(error);
    });
};
