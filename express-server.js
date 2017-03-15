'use strict';
const express = require("express");
const PORT = process.env.PORT || 8080; // default port 8080
const app = express();
const bodyParser = require('body-parser');

// Generate a random string
function generateRandomString() {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for(let i = 0; i < 6; ++i) {
    result.push( alpha.charAt(Math.floor(Math.random() * alpha.length)));
  }
  return result.join('');
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "9sm5xL": "http://www.castawayswatersports.com"
};

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  // console.log(longURL);
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.end("Hello There!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  const bigURL = req.body.longURL;
  const randURL = generateRandomString();
  urlDatabase[randURL] = bigURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${randURL}`);
});

app.get("/urls", (req, res) => {
  const wrappedDB = { urlDatabase: urlDatabase };
  res.render("urls_index", wrappedDB);
});

app.get("/urls/:id", (req, res) => {
  console.log(req.params.id)
  const short = req.params.id;
  let templateVars = { 
    shortURL: short,
    bigURL: urlDatabase[short]
   };
   console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});