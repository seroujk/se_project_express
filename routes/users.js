const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {validateUserBody,validateAuthenticationBody,validateUserUpdate} = require("../middlewares/validation");
const {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
} = require("../controllers/users");

router.get("/users/me", authorize, getCurrentUser);
router.patch("/users/me", authorize,validateUserUpdate, updateCurrentUser);
router.post("/signin",validateAuthenticationBody, login);
router.post("/signup",validateUserBody, createUser);

module.exports = router;