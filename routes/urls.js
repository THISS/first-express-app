const router = require("express").Router();
const helper = require("../helpers/helper_functions.js");

// Databases
const userDatabase = require("../data/databases").userDatabase;
const userEmailDatabase = require("../data/databases").userEmailDatabase;// Databases
const urlDatabase = require("../data/databases").urlDatabase;

// redirect our client to the URL in our URL DB
router.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  // console.log(longURL);
  res.redirect(longURL);
});

// Create a new tinyURL by getting this form
router.get("/urls/new", (req, res) => {
  if(res.locals.userLoggedIn) {
    res.render("urls_new");
  }
  res.redirect('/');
});

// Create a new tinyURL by posting here
// TODO:
router.post("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    const bigURL = req.body.longURL;
    const randURL = helper.generateRandomString();
    urlDatabase[randURL] = {url: bigURL, userid: res.locals.user.id};
    res.redirect(`/urls/${randURL}`);
  }
  res.redirect('/');
});

// Our Homepage
router.get("/", (req, res) => {
  if(res.locals.userLoggedIn){
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase);
  }
  // TODO: Remove the log
  console.log(res.locals.urlDatabase);
  res.render("urls_index");
});

// List all the URLs
router.get("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase);
  }
  // TODO: Remove the log
  console.log(res.locals.urlDatabase);
  res.render("urls_index");
});

// Show a tinyURL and allow user to edit the original
router.get("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    const short = req.params.shortURL;
    res.locals.shortURL = short;
    res.locals.bigURL = urlDatabase[short].url;
    res.render("urls_show");
  }
  res.redirect("/");
});

// TODO: Do additional check to make sure it is the users url
// Update the Long or Original of the specified URL
router.post("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    const short = req.params.shortURL;
    const big = req.body.update_input;
    urlDatabase[short].url = big;
    res.redirect("/urls/" + short);
  }
  res.redirect('/');
});

// TODO: Do additional check to make sure it is the users url
// Delete the specified URL
router.post("/urls/:shortURL/delete", (req, res) => {
  if(res.locals.userLoggedIn) {
    const short = req.params.shortURL;
    delete urlDatabase[short];
    res.redirect("/urls");
  }
  res.redirect('/');
});

module.exports = router;