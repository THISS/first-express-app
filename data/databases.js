// The URL Database that will allllllllways persist these three urls 
// When delete has not been used
const urlDatabase = {
      "b2xVn2": {url: "http://www.lighthouselabs.ca", userid: "userRandomID", datecreated: Date.now()},
      "9sm5xL": {url: "http://www.castawayswatersports.com", userid: "userRandomID", datecreated: Date.now()},
      "9sm5xK": {url: "http://www.google.com", userid: "userRandomID", datecreated: Date.now()}
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
};

// Tracking Database
const trackingDatabase = {
  "stats": {"shorturl": [
      {
        userID: "uniqueID",
        timestamp: 90886555667
      }
    ]
  },
  "unique": {
    "url": {
      "userID": 1
    }
  }
};

// TODO: make the userLink db so it is more simple
// const userShort = {
//   user: [fasdfjk,fadslfkkdjas],
//   user2: []
// };

module.exports = {
  urlDatabase: urlDatabase, 
  userDatabase: userDatabase, 
  userEmailDatabase: userEmailDatabase,
  trackingDatabase: trackingDatabase
};