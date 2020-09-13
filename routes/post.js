const express = require("express");
const {
   getPosts,
   createPost,
   postsByUser,
   postById,
   isPoster,
   deletePost,
   updatePost,
} = require("../controller/post");
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
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

//any route containing :userId,our app will first execute userById()
router.param("userId", userById);
//any route containing :postId,our app will first execute postById()
router.param("postId", postById);

module.exports = router;
