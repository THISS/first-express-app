const router = require("express").Router();
const helper = require("../helpers/helper_functions.js");
// Be sure to include body-parser and cookie-parser prior to this in the main app

// Databases
const userDatabase = require("../data/databases").userDatabase;
const userEmailDatabase = require("../data/databases").userEmailDatabase;

// The login form page
router.get("/login", (req, res) => {
  if(res.locals.userLoggedIn){
    res.redirect("/");
    return;
  }
  // TODO: Check if the middleware can do this
  // res.locals.error = req.sessions.error;
  res.render("login_user");
});

// Login via post
router.post("/login", (req, res) => {
  if(res.locals.userLoggedIn){
    res.redirect("/");
    return;
  }
  if(req.body.email && req.body.password) {
    const email = req.body.email;
    const userID = userEmailDatabase[email];
    if(userID && userDatabase[userID]) {
      const password = userDatabase[userID].passhash;
      if(helper.bcrypt.compareSync(req.body.password, password)){
        req.session.user_id = userID;
        res.redirect("/");
        return;
      }
    }
  }
  const error = "Email or Password are incorrect";
  req.session.error = error;
  res.locals.error = error;
  res.status(401).render("401");
});
// Logout
router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/");
});

// Registration form
router.get("/register", (req, res) => {
  if(res.locals.userLoggedIn){
    res.redirect("/");
    return;
  }
  // TODO: Check if the middleware can do this
  // res.locals.error = req.sessions.error;
  res.render("register_user");
});

router.post("/register", (req, res) => {
  if(res.locals.userLoggedIn) {
    res.redirect("/");
    return;
  }
  const form = req.body;
  // Check if all forms have been filled out
  if(form.email && form.password) {
    // If the users email is already registered 
    if(helper.emailCheck(form.email, userEmailDatabase)) {
      const error = "Sorry, email is already taken";
      req.session.error = error;
      res.locals.error = error;
      res.status(400).render("400");
      return;
    }
    // Generate a new userRandomID
    const userID = helper.generateRandomString();
    // Add the new user to userDatabase
    userDatabase[userID] = {
      id: userID,
      email: form.email,
      passhash: helper.bcrypt.hashSync(form.password, 10)
    };

    // Add email to id Lookup
    userEmailDatabase[form.email] = userID;
    req.session.user_id = userID;
    res.redirect("/");
    return;
  }
  // if either email or password not supplied render to 400 page
  const error = "You need to have entered an email and a password";
  req.session.error = error;
  res.locals.error = error;
  res.status(400).render("400");
});

module.exports = router;