const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
//dotenv config
require("dotenv").config();
//DB connect
mongoose
   .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) =>
   console.log(`DB server error: ${err.message}`)
);

//http
const app = express();

//bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
//docs api
app.get("/", (req, res) => {
   fs.readFile("docs/apiDocs.json", (err, data) => {
      if (err) {
         return res.status(400).json({ error: err });
      }
      const docs = JSON.parse(data);
      res.json(docs);
   });
});
//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
   if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: "Unauthorized!" });
   }
});
//port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Running server port: ${port}`));
