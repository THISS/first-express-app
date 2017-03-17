'use strict';
// Our Controlling Variables - pre hoisted ;)
const express = require("express");
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const urlRouter = require("./routes/urls");
const helper = require("./helpers/helper_functions");

// Databases
const userDatabase = require("./data/databases").userDatabase;

// Tell express to look for the ejs file extension
// and render with ejs module
app.set('view engine', 'ejs');

// The MiddleWare Begins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// My template vars and cookies
app.use((req, res, next) => {
  res.locals.userLoggedIn = false;
  if(req.cookies.user_id && helper.idCheck(req.cookies.user_id, userDatabase)) {
    console.log("user_id", req.cookies.user_id);
    const user = userDatabase[req.cookies.user_id];
    console.log("user object", user);
    if(user.email) {
      res.locals.user = user;
      res.locals.userLoggedIn = true;
    }
  }
  if(req.cookies.error && req.cookies.prev_path === req.path) {
    res.locals.error = req.cookies.error;
  }else {
    res.locals.error = "";
  }
  res.cookie("prev_path", req.path);
  next();
});

app.use(userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`tinyURL app listening on port ${PORT}!`);
});