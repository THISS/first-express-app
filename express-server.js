'use strict';
// Our Controlling Variables - pre hoisted ;)
const express = require("express");
const PORT = process.env.PORT || 3000; // default port 8080
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const urlRouter = require("./routes/urls");
const helper = require("./helpers/helper_functions");
const methodOverride = require("method-override");

// Databases
const userDatabase = require("./data/databases").userDatabase;

// Tell express to look for the ejs file extension
// and render with ejs module
app.set('view engine', 'ejs');

// The MiddleWare Begins
// serve static files (images)
app.use(express.static("public"));
// Change form methods when needed with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ["bacon", "mac", "cheese"],
  // Cookie Options
  maxAge: 20 * 60 * 1000 // 20 minutes
}));
// My template vars and cookies
app.use((req, res, next) => {
  res.locals.userLoggedIn = false;
  if(req.session.user_id && helper.idCheck(req.session.user_id, userDatabase)) {
    const user = userDatabase[req.session.user_id];
    if(user.email) {
      res.locals.user = user;
      res.locals.userLoggedIn = true;
    }
  }
  if(req.session.error && req.session.prev_path === req.path) {
    res.locals.error = req.session.error;
  }else {
    res.locals.error = "";
  }
  req.session.error = null;
  req.session.prev_path = req.path;
  next();
});

app.use(userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`tinyURL app listening on port ${PORT}!`);
});