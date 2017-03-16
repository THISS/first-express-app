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
  const name = req.body.username;
  res.cookie("username", name);
  res.redirect('/');
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect('/');
});

// Registration form
app.get("/register", (req, res) => {
  if(req.cookies.username){
    res.redirect('/urls');
  }
  res.render('register_user');
});

app.post("/register", (req, res) => {
  //TODO: Check if all forms have been filled out
  
  //TODO: Generate a new userRandomID
  //TODO: Add the new user to userDatabase
  //TODO: TEST / Check that the userDatabase is being appended to correctly
  //TODO: Set user_id as cookie
  //TODO: Check the user_id cookie has been set
  //TODO: redirect to '/' path 
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