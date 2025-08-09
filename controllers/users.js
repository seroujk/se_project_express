const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR_CODE,
  SERVER_ERROR_CODE,
  DATA_NOT_FOUND_ERROR_CODE,
  DUPLICATE_DATA_ERROR_CODE_CODE,
  UNAUTHORIZED_DATA__ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// GET /users/me - returns a user by _id
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }
     return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// PATCH users/me
module.exports.updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(DATA_NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid user data" });
      }
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: "Server Error" });
    });
};

// POST /users - create a user
module.exports.createUser = (req, res) => {
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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid user data" });
      }
      if (err.code === 11000) {
        return res
          .status(DUPLICATE_DATA_ERROR_CODE_CODE)
          .send({ message: "Email already exists" });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// Authentication Handler
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(INVALID_DATA_ERROR_CODE)
      .send({ message: "The email and password fields are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // Authentication error
      if (err.message.includes("Incorrect email or password")) {
        return res
          .status(UNAUTHORIZED_DATA__ERROR_CODE)
          .send({ message: err.message });
      }
      return res.status(SERVER_ERROR_CODE).send({message: "Server error"})
    });
};
