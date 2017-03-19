const router = require("express").Router();
const helper = require("../helpers/helper_functions.js");

// Databases
const userDatabase = require("../data/databases").userDatabase;
const userEmailDatabase = require("../data/databases").userEmailDatabase;// Databases
const urlDatabase = require("../data/databases").urlDatabase;
const trackingDatabase = require("../data/databases").trackingDatabase;


// TODO: make some checking functions for email, and websites
// redirect our client to the URL in our URL DB
router.get('/u/:shortURL', (req, res) => {
  // if the shortURL exists redirect to the long url otherwise render a 404
  const shortURL = req.params.shortURL;
  if(helper.tinyUrlCheck(shortURL, urlDatabase)){
    const uniqueID = helper.userTracker(req, res);
    // uniqueURLcount url will be a shortURL with an object 
    // that will be a letter count of userids with one as the value (obj.keys().length)
    helper.checkUniqueUser(shortURL, uniqueID, trackingDatabase);
    // a second function will be used to get the unique count
    helper.setUrlTracker(shortURL, uniqueID, trackingDatabase);
    let longURL = urlDatabase[shortURL].url;
    // TODO: make a well formed (http://)url making sure it has http:// or https:// at front
    res.redirect(longURL);
    return;
  }
  res.status(404).render("404");
});

// Create a new tinyURL by getting this form
router.get("/urls/new", (req, res) => {
  if(res.locals.userLoggedIn) {
    res.render("urls_new");
    return;
  }
  // Make sure view can render the message and a link to login
  const error = "log in before trying... gosh, it's like trying to teach the alphabet to a turd";
  req.session.error = error;
  res.locals.error = error;
  res.status(401).render("401");
});

// Create a new tinyURL by posting here
router.post("/urls", (req, res) => {
  if(res.locals.userLoggedIn){
    const bigURL = req.body.longURL;
    const shortURL = helper.generateRandomString();
    const date = Date.now();
    urlDatabase[shortURL] = {url: bigURL, userid: res.locals.user.id, datecreated: date};
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  const error = "Why would you feel like you could do that, log in and post to YOUR urls, not ours";
  res.locals.error = error
  req.session.error = error;
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
    res.locals.urlDatabase = helper.urlsForUserId(res.locals.user.id, urlDatabase, trackingDatabase);
    // number of visits, number of unique visits
    res.render("urls_index");
    return;
  }
  const error = "You need to log in to see YOUR urls";
  res.locals.error = error
  req.session.error = error;
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
        res.locals.dateCreated = urlDatabase[short].datecreated;
        res.locals.stats = helper.getStats(short, trackingDatabase);
        res.locals.uCount = helper.getUniqueCount(short, trackingDatabase);
        res.render("urls_show");
        return;
      }
      const error = "The page you requested could not be found, check yoself";
      res.locals.error = error
      req.session.error = error;
      res.status(404).render("404");
      return;
    }
    const error = "You do not have access to this website link page, seriously, we don't want you trying these things";
    req.session.error = error;
    res.locals.error = error;
    res.status(403).render("403");
    return;
  }
  const error = "You need to be logged in to view a website links page - are you a brick wall, cos I feel like I am talking to one";
  req.session.error = error;
  res.locals.error = error;
  res.status(401).render("401");
});

// Update the Long or Original of the specified URL
// Changed to PUT
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
      const error = "it does not exist. Your bad, not ours";
      req.session.error = error;
      res.locals.error = error;
      res.status(404).return("404");
      return;
    }
    const error = "seriously, why are you even trying - you get the participation medal but I feel I have wasted this much of my time on you so i am gonna go...";
    req.session.error = error;
    res.locals.error = error;
    res.status(403).render("403");
    return;
  }
  const error = "You must login to access url pages otherwise enjoy the login and registration pages, try googling how to enter bit.chi";
  req.session.error = error;
  res.locals.error = error;
  res.status(401).render("401");
});

// Delete the specified URL
router.delete("/urls/:shortURL/delete", (req, res) => {
  if(res.locals.userLoggedIn && helper.userBelongsToUrl(req, res, urlDatabase)) {
    const short = req.params.shortURL;
    delete urlDatabase[short];
  }
  res.redirect("/urls");
});

module.exports = router;