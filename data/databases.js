// The URL Database that will allllllllways persist these three urls 
// When delete has not been used
const urlDatabase = {
      "b2xVn2": {url: "http://www.lighthouselabs.ca", userid: "userRandomID"},
      "9sm5xL": {url: "http://www.castawayswatersports.com", userid: "userRandomID"},
      "9sm5xK": {url: "http://www.google.com", userid: "userRandomID"}
};

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

module.exports = {
  urlDatabase: urlDatabase, 
  userDatabase: userDatabase, 
  userEmailDatabase: userEmailDatabase
};