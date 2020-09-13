const express = require("express");
const { signup, signin, signout } = require("../controller/auth");
const { userById } = require("../controller/user");
const { userValidator, validatorErrorHandler } = require("../validator");

const router = express.Router();

router.post("/signup", userValidator, validatorErrorHandler, signup);
router.post("/signin", signin);
router.get("/signout", signout);

//any route containing :userId,our app will first execute userById()
router.param("userId", userById);

module.exports = router;
