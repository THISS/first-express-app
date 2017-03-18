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
    // TODO: add a date created
    // TODO: add a counter of visits
    // TODO: number of "Unique Visits"
  }
  res.status(401).render("401");
});

// Show a tinyURL and allow user to edit the original
router.get("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    if(helper.userBelongsToUrl(req, res, urlDatabase)) {
      // check if the shorturl is in the urldb
      // if it is not, then return a 404 with a relevant error message
      const short = req.params.shortURL;
      if(helper.tinyUrlCheck(short, urlDatabase)) {
        res.locals.shortURL = short;
        res.locals.bigURL = urlDatabase[short].url;
        // TODO: date created
        // TODO: number of visits
        // TODO: number of unique visits
        res.render("urls_show");
        return;
      }
      res.status(404).render(404);
      return;
    }
    req.session.error = "You do not have access to this website link page";
    res.status(403).render("403");
  }
  req.session.error = "Sorry, you need to be logged in to view a website links page";
  res.status(401).render("401");
});

// Update the Long or Original of the specified URL
// TODO: Changed to PUT
router.put("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn) {
    if(helper.userBelongsToUrl(req, res, urlDatabase)) {
      // Check if the short url exists
      const short = req.params.shortURL;
      if(helper.tinyUrlCheck(short, urlDatabase)) {
        const big = req.body.update_input;
        urlDatabase[short].url = big;
        res.redirect(`/urls/${short}`);
        return;
      }
      res.status(404).return("404");
      return;
    }
    req.session.error = "Sorry, you don't have access to that url";
    res.status(403).render("403");
    return;
  }
  req.session.error = "You must login to access url pages";
  res.status(401).render("401");
});

// Delete the specified URL
router.delete("/urls/:shortURL", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    delete urlDatabase[short];
  }
  res.redirect("/urls");
});

module.exports = router;