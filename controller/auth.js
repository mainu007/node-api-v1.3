const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.signup = async (req, res) => {
   const userExist = await User.findOne({ email: req.body.email });
   if (userExist)
      return res.status(403).json({
         error: "Email is taken!.",
      });
   //save user
   const user = await new User(req.body);
   await user.save();
   res.json({ message: "Signup success! Please login" });
};

//sign in
exports.signin = (req, res) => {
   //user find based on email
   const { email, password } = req.body;
   User.findOne({ email }, (err, user) => {
      //if error or no user
      if (err || !user) {
         return res.status("401").json({
            error: "User with that email does not exist! please signin.",
         });
      }
      //user found,
      //creating authenticate method in user model and use here
      if (!user.authenticate(password)) {
         return res
            .status(401)
            .json({ error: "Email and password do not match!" });
      }
      //generate a token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      //parsis the token as "t" in cookie and expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      //user response with token and user for frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
   });
};
//sign out
exports.signout = (req, res) => {
   res.clearCookie("t");
   res.json({ message: "Signout!" });
};
//authorization
exports.requireSignin = expressJwt({
   secret: process.env.JWT_SECRET,
   algorithms: ["HS256"],
   userProperty: "auth",
});
