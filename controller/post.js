const formidable = require("formidable");
const Post = require("../models/post");
const fs = require("fs");

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
