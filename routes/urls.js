const router = require("express").Router();
const helper = require("../helpers/helper_functions.js");

// Databases
const userDatabase = require("../data/databases").userDatabase;
const userEmailDatabase = require("../data/databases").userEmailDatabase;// Databases
const urlDatabase = require("../data/databases").urlDatabase;

// redirect our client to the URL in our URL DB
router.get('/u/:shortURL', (req, res) => {
  // TODO: if the shortURL exists redirect to the long url otherwise render a 404
  let longURL = urlDatabase[req.params.shortURL].url;
  // console.log(longURL);
  res.redirect(longURL);
});

// Create a new tinyURL by getting this form
router.get("/urls/new", (req, res) => {
  if(res.locals.userLoggedIn) {
    res.render("urls_new");
    return;
  }
  // TODO: Make sure view can render the message and a link to login
  req.session.error = "Sorry, you will need to log in to generate a tinyURL";
  res.status(401).render("401");
});

// Create a new tinyURL by posting here
router.post("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    const bigURL = req.body.longURL;
    const shortURL = helper.generateRandomString();
    urlDatabase[shortURL] = {url: bigURL, userid: res.locals.user.id};
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  req.session.error = "You need to log in to post website links";
  res.status(401).render("401");
});

// Our Homepage
router.get("/", (req, res) => {
  if(res.locals.userLoggedIn){
    res.redirect("/urls");
    return;
  }
  res.redirect("/login");
});

// List all the URLs
router.get("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase);
    res.render("urls_index");
    return;
    // TODO: add a link to create a new link in partials to add to different pages
    // TODO: remove the link around the long url
    // TODO: add a date created
    // TODO: add a counter of visits
    // TODO: number of "Unique Visits"
  }
  res.status(401).render("urls_index");
});

// Show a tinyURL and allow user to edit the original
router.get("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    if(helper.userBelongsToUrl(req, res, urlDatabase)) {
      // TODO: make a function in helpers to check if the shorturl is in the urldb
      // TODO: if it is not, then return a 404 with a relevant error message
      const short = req.params.shortURL;
      res.locals.shortURL = short;
      res.locals.bigURL = urlDatabase[short].url;
      // TODO: date created
      // TODO: number of visits
      // TODO: number of unique visits
      res.render("urls_show");
      return;
    }
    req.session.error = "You do not have access to this website link page";
    res.status(403).render("urls_index");
  }
  req.session.error = "Sorry, you need to be logged in to view a website links page";
  res.status(401).render("urls_index");
});

// Update the Long or Original of the specified URL
router.post("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    if(helper.userBelongsToUrl(req, res, urlDatabase)) {
      //TODO: Check url exists
      const short = req.params.shortURL;
      const big = req.body.update_input;
      urlDatabase[short].url = big;
      res.redirect(`/urls/${short}`);
      return;
    }
    // TODO: Test the redirect and error code, ask mentor if this is correct
    req.session.error = "Sorry, you don't have access to that url";
    res.status(403).redirect("/urls");
    return;
  }
  // TODO: Test the redirect has the correct status code, ask for help
  req.session.error = "You must login to access url pages";
  res.status(401).redirect("/urls");
});

// Delete the specified URL
router.post("/urls/:shortURL/delete", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    delete urlDatabase[short];
  }
  res.redirect("/urls");
});

module.exports = router;