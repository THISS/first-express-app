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
  }
  res.render("login_user");
});

// Login via post
router.post("/login", (req, res) => {
  if(res.locals.userLoggedIn){
    res.render("login_user");
  }
  req.session.error = null;
  if(req.body.email && req.body.password) {
    const email = req.body.email;
    const userID = userEmailDatabase[email];
    if(userID) {
      const password = userDatabase[userID].passhash;
      if(helper.bcrypt.compareSync(req.body.password, password)){
        req.session.user_id = userID;
        res.redirect('/');
        return;
      }
    }
  }
  req.session.error = "Email or Password are incorrect";
  res.status(403).redirect('/login');
});

// Logout
router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect('/');
});

// Registration form
router.get("/register", (req, res) => {
  if(res.locals.userLoggedIn){
    res.redirect('/');
  }
  res.render('register_user');
});

router.post("/register", (req, res) => {
  req.session.error = null;
  if(res.locals.userLoggedIn) {
    res.redirect("/");
  }
  const form = req.body;
  // Check if all forms have been filled out
  if(form.email && form.password) {
    // If the users email is already registered 
    if(helper.emailCheck(form.email, userEmailDatabase)) {
      res.status(400).render('400');
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
    // Set user_id as cookie
    req.session.user_id = userID;
    // redirect to '/' path 
    res.redirect('/');
    return;
  }
  // if either emil or password not supplied render to 400 page
  res.status(400).redirect('400');
});

module.exports = router;