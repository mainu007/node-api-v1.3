const { check, validationResult } = require("express-validator");

exports.postValidator = [
   check("title", "Write a title")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 150 })
      .withMessage("Title must be between 4 to 150 characters."),
   check("body", "Write a title")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 2000 })
      .withMessage("Body must be between 4 to 2000 characters."),
];

exports.userValidator = [
   check("name", "Name is required").not().isEmpty(),
   check("email", "Email must be between 4 to 30 characters.")
      .matches(/.+\@.+\../)
      .withMessage("Email contain a @")
      .isLength({ min: 4, max: 30 }),
   check("password", "password is required")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must contain 6 chart long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
];

exports.validatorErrorHandler = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(400).json({ error: firstError });
   }
   next();
};
