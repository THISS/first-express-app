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
app.use((req, res, next) => {
  const templateVars = {};
  req.templateVars = templateVars;
  res.templateVars = templateVars;
  next();
});

// The URL Database that will allllllllways persist these three urls 
// When delete has not been used
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "9sm5xL": "http://www.castawayswatersports.com"
};

// User Database
const userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "useremail1@g.com",
    passhash: "fluffybunny"
  },
  "userRandomID2": {
    id: "userRandomID2",
    email: "useremail2@g.com",
    passhash: "password"
  }
};

// redirect our client to the URL in our URL DB
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  // console.log(longURL);
  res.redirect(longURL);
});

// Our Homepage
app.get("/", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urlDatabase: urlDatabase
  };
  res.render("urls_index", templateVars);
});


// Login via post
app.post("/login", (req, res) => {
  const email = req.body.email;
  const userID = req.body.user_id;
  res.cookie("user_id", userID);
  res.redirect('/');
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/');
});

// Registration form
app.get("/register", (req, res) => {
  if(req.cookies.user_id){
    res.redirect('/');
  }
  res.render('register_user');
});

// helper function to check emails
// returns true if it exists
function emailCheck(emailAddress) {
  for(let i in userDatabase) {
    if(userDatabase[i].email === emailAddress) {
      return true;
    }
  }
  return false;
}

app.post("/register", (req, res) => {
  const form = req.body;
  // Check if all forms have been filled out
  if(form.email && form.password) {
    // If the users email is already registered 
    // (shitty lookup check for bigger project)
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
    // Set user_id as cookie
    res.cookie('user_id', userID);
    // Check the user_id cookie has been set
    console.log(req.cookies);
    // redirect to '/' path 
    res.redirect('/');
    
  }
  // Otherwise redirect to the 400 page
  res.status(400).render('400');
});

// Our REST implementation
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Create a new tinyURL by getting this form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Create a new tinyURL by posting here
app.post("/urls", (req, res) => {
  // console.log(req.body);
  const bigURL = req.body.longURL;
  const randURL = generateRandomString();
  urlDatabase[randURL] = bigURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${randURL}`);
});

// List all the URLs
app.get("/urls", (req, res) => {
  const templateVars = { urlDatabase: urlDatabase };
  res.render("urls_index", templateVars);
});

// Show a tinyURL and allow user to edit the original
app.get("/urls/:shortURL", (req, res) => {
  // console.log(req.params.shortURL)
  const short = req.params.shortURL;
  let templateVars = { 
    shortURL: short,
    bigURL: urlDatabase[short]
   };
  res.render("urls_show", templateVars);
});

// Update the Long or Original of the specified URL
app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const big = req.body.update_input;
  urlDatabase[short] = big;
  res.redirect("/urls/" + short);
});

// Delete the specified URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// a Nod to technology buffs everywhere
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});