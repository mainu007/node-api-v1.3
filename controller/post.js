const formidable = require("formidable");
const Post = require("../models/post");
const fs = require("fs");

exports.postById = (req, res, next, id) => {
   Post.findById(id)
      .populate("postedBy", "_id name")
      .exec((err, post) => {
         if (err) {
            res.status(400).json({ error: "Post not found" });
         }
         req.post = post;
         next();
      });
};

exports.getPosts = (req, res) => {
   const posts = Post.find()
      .populate("postedBy", "_id name")
      .select("_id title body")
      .then((posts) => res.json({ posts }))
      .catch((err) => console.log(err));
};
//create post
exports.createPost = (req, res, next) => {
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
      if (err) {
         return res.status(400).json({
            error: "Image code not be uploaded",
         });
      }
      let post = new Post(fields);
      //post created by
      req.profile.hashed_password = undefined;
      req.profile.salt = undefined;
      post.postedBy = req.profile;
      //if photo file
      if (files.photo) {
         post.photo.data = fs.readFileSync(files.photo.path);
         post.photo.contentType = files.photo.type;
      }
      //save post database
      post.save((err, result) => {
         if (err) {
            res.status(400).json({ error: err });
         }
         res.json(result);
      });
   });
};
//get single user all posts
exports.postsByUser = (req, res) => {
   Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name")
      .sort("_created")
      .exec((err, posts) => {
         if (err) {
            res.status(400).json({ error: err });
         }
         res.json(posts);
      });
};
//is poster method
exports.isPoster = (req, res, next) => {
   console.log("isPoster method run");
   const poster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

   if (!poster) {
      return res.status(403).json({ error: "User not authorized" });
   }
   next();
};
//delete post method
exports.deletePost = (req, res) => {
   const post = req.post;
   post.remove((err, post) => {
      if (err) {
         res.status(400).json({ error: err });
      }
      res.json({ message: "Post deleted successfully", post });
   });
};
