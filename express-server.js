'use strict';
// Our Controlling Variables - pre hoisted ;)
const express = require("express");
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const urlRouter = require("./routes/urls");

// Databases
const userDatabase = require("./data/databases").userDatabase;
const urlDatabase = require("./data/databases").urlDatabase;
const userEmailDatabase = require("./data/databases").userEmailDatabase;

// Tell express to look for the ejs file extension
// and render with ejs module
app.set('view engine', 'ejs');

// The MiddleWare Begins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// My template vars and cookies
app.use((req, res, next) => {
  if(req.cookies.user_id) {
    const user = userDatabase[req.cookies.user_id];
    res.locals.user = user;
  }else {
    // TODO: Check to see if we can remove this
    res.locals.user = {};
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
app.user(urlRouter);

app.listen(PORT, () => {
  console.log(`tinyURL app listening on port ${PORT}!`);
});