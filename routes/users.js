const router = require("express").Router();
const { authorize } = require("../middlewares/auth");

const {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
} = require("../controllers/users");

router.get("/users/me", authorize, getCurrentUser);
router.patch("/users/me", authorize, updateCurrentUser);
router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
