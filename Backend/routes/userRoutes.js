const express = require("express");
const {
  getUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
  userLogin,
  verifyToken,
} = require("../controller/userController");
const route = express.Router();

route.get("/", getUser);
route.get("/:id", getUserById);
route.patch("/:id", updateUser);
route.delete("/:id", deleteUser);
route.delete("/", deleteAllUsers);

route.post("/signup", createUser);
route.post("/signin", userLogin);

route.get("/verify-email/:verificationToken", verifyToken)

module.exports = route;
