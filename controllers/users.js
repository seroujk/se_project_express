const User = require("../models/user");
const {
  INVALID_DATA_ERROR_CODE,
  SERVER_ERROR_CODE,
  DATA_NOT_FOUND_ERROR_CODE,
} = require("../utils/errors");
// GET /users - returns all users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: "Server error" }));
};

// GET /users/:userId - returns a user by _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      console.log("get user by id error catch", err);
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: "Invalid ID format" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// POST /users - create a user
module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: "Invalid user data" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};
