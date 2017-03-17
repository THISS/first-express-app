'use strict';
// Our Controlling Variables - pre hoisted ;)
const express = require("express");
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Generate a random string
function generateRandomString() {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for(let i = 0; i < 6; ++i) {
    result.push( alpha.charAt(Math.floor(Math.random() * alpha.length)));
  }
  return result.join('');
}

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

// The URL Database that will allllllllways persist these three urls 
// When delete has not been used
const urlDatabase = {
      "b2xVn2": {url: "http://www.lighthouselabs.ca", userid: "userRandomID"},
      "9sm5xL": {url: "http://www.castawayswatersports.com", userid: "userRandomID"},
      "9sm5xK": {url: "http://www.google.com", userid: "userRandomID"}
};

// Helper function to get the users URLs
function urlsForUserId(userID) {
  const userURLS = {};
  for(let key in urlDatabase) {
    if(userID === urlDatabase[key].userid) {
      userURLS[key] = urlDatabase[key].url;
    }
  }
  return userURLS;
}

// User Database - if User email or User id is modified
// modify the same in userEmailDatabase
const userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "a@g.com",
    passhash: "12345"
  },
  "userRandomID2": {
    id: "userRandomID2",
    email: "useremail2@g.com",
    passhash: "password"
  }
};

// User Email Database Lookup Table
// if User email or User id is modified
// modify the same in userDatabase
const userEmailDatabase = {
  "a@g.com": "userRandomID",
  "useremail2@g.com": "userRandomID2"
}

// redirect our client to the URL in our URL DB
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  // console.log(longURL);
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login_user");
});
// Login via post
app.post("/login", (req, res) => {
  res.clearCookie("error");
  if(req.body.email && req.body.password) {
    const email = req.body.email;
    const userID = userEmailDatabase[email];
    if(userID) {
      const password = userDatabase[userID].passhash;
      if(req.body.password === password){
        res.cookie("user_id", userID);
        res.redirect('/');
        return;
      }
    }
  }
  res.cookie("error", "Email or Password are incorrect");
  res.status(403).redirect('/login');
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/');
});

// Registration form
app.get("/register", (req, res) => {
  if(typeof res.locals.user !== "undefined"){
    res.redirect('/');
  }
  res.render('register_user');
});

// helper function to check emails
// returns true if it exists
function emailCheck(emailAddress) {
  if(userEmailDatabase[emailAddress]) {
    return true;
  }
  return false;
}

app.post("/register", (req, res) => {
  res.clearCookie("error");
  if(typeof res.locals.user !== "undefined") {
    res.redirect("/");
  }
  const form = req.body;
  // Check if all forms have been filled out
  if(form.email && form.password) {
    // If the users email is already registered 
    if(emailCheck(form.email)) {
      res.status(400).render('400');
    }
    // Generate a new userRandomID
    const userID = generateRandomString();
    // Add the new user to userDatabase
    userDatabase[userID] = {
      id: userID,
      email: form.email,
      passhash: form.password
    };

    // Add email to id Lookup
    userEmailDatabase[form.email] = userID;
    // Set user_id as cookie
    res.cookie('user_id', userID);
    // Clear attempts cookie
    res.clearCookie("attempts");
    // redirect to '/' path 
    res.redirect('/');
    return;
  }
  // if either emil or password not supplied render to 400 page
  res.status(400).redirect('400');
});

// Create a new tinyURL by getting this form
app.get("/urls/new", (req, res) => {
  if(typeof res.locals.user !== "undefined"){
    res.render("urls_new");
    return;
  }
  res.redirect('/');
});

// Create a new tinyURL by posting here
app.post("/urls", (req, res) => {
  if(typeof res.locals.user !== "undefined"){
    const bigURL = req.body.longURL;
    const randURL = generateRandomString();
    urlDatabase[randURL] = {url: bigURL, userid: typeof res.locals.user !== "undefined"};
    res.redirect(`/urls/${randURL}`);
  }
  res.redirect('/');
});

// Our Homepage
app.get("/", (req, res) => {
  let userURLS = {};
  if(typeof res.locals.user !== "undefined"){
    userURLS = urlsForUserId(typeof res.locals.user !== "undefined");
  }
  res.locals.urlDatabase = userURLS;
  console.log(res.locals.urlDatabase);
  res.render("urls_index");
});

// List all the URLs
app.get("/urls", (req, res) => {
  let userURLs = {};
  if(typeof res.locals.user !== "undefined"){
    userURLS = urlsForUserId(typeof res.locals.user !== "undefined");
  }
  res.locals.urlDatabase = userURLS;
  console.log(res.locals.user);
  res.render("urls_index");
});

// Show a tinyURL and allow user to edit the original
app.get("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  if(typeof res.locals.user !== "undefined" && typeof res.locals.user !== "undefined" === urlDatabase[short].userid) {
    res.locals.shortURL = short;
    res.locals.bigURL = urlDatabase[short].url;
    res.render("urls_show");
  }
  res.redirect("/");
});

// Update the Long or Original of the specified URL
app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  if(typeof res.locals.user !== "undefined" && typeof res.locals.user !== "undefined" === urlDatabase[short].userid) {
    const big = req.body.update_input;
    urlDatabase[short].url = big;
    res.redirect("/urls/" + short);
  }
  res.redirect('/');
});

// Delete the specified URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL;
  if(typeof res.locals.user !== "undefined" && typeof res.locals.user !== "undefined" === urlDatabase[short].userid) {
    delete urlDatabase[short];
    res.redirect("/urls");
  }
  res.redirect('/');
});

// a Nod to technology buffs everywhere
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

// Our REST implementation
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});