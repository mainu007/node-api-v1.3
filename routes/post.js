const express = require("express");
const { getPosts, createPost, postsByUser } = require("../controller/post");
const { requireSignin } = require("../controller/auth");
const { userById } = require("../controller/user");
const { postValidator, validatorErrorHandler } = require("../validator");

const router = express.Router();

router.get("/", requireSignin, getPosts);
router.post(
   "/post/new/:userId",
   requireSignin,
   postValidator,
   createPost,
   validatorErrorHandler
);
router.get("/posts/by/:userId", requireSignin, postsByUser);

//any route containing :userId,our app will first execute userById()
router.param("userId", userById);
module.exports = router;
