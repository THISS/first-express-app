const bcrypt = require("bcrypt");


// Generate a random string
function generateRandomString() {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for(let i = 0; i < 6; ++i) {
    result.push( alpha.charAt(Math.floor(Math.random() * alpha.length)));
  }
  return result.join('');
}

// tinyURL Check

// see if the shortURL is in the urlDatabase
// if it is then return true
// otherwise return false

// Get the users URLs
function urlsForUserId(userID, urlDatabase) {
  const userURLS = [];
  for(let key in urlDatabase) {
    if(urlDatabase.hasOwnProperty(key)) {
      if(userID === urlDatabase[key].userid) {
        userURLS.push({
          shortURL: key,
          longURL: urlDatabase[key].url
        });
      }
    }
  }
  return userURLS;
}

// TODO:
// create result array (empty)
// check for email
// if not found return result (empty array)
// else if found loop the array
// check iterator against urlDatabase and push to result
// return result

// TODO:
// check for email in the link db
// if not found create it with an empty array
// add shortURL to the userid via push

// Check emails
// returns true if it exists
function emailCheck(emailAddress, userEmailDatabase) {
  if(userEmailDatabase[emailAddress]) {
    return true;
  }
  return false;
}

// Check User ID
// returns true if it exists
function idCheck(userID, userDatabase) {
  if(userDatabase[userID]) {
    return true;
  }
  return false;
}

// Returns true if the user is logged in
function userLoggedIn(response) {
  if(typeof response.locals.user !== "undefined" && typeof response.locals.user.id !== "undefined") {
    return true;
  }
  return false;
}

// needs a pre populated req, res obj
function userBelongsToUrl(request, response, database) {
  if(response.locals.user.id === database[request.params.shortURL].userid) {
    return true;
  }
  return false;
}

module.exports = {
  bcrypt: bcrypt,
  generateRandomString: generateRandomString, 
  urlsForUserId: urlsForUserId,
  emailCheck: emailCheck,
  userLoggedIn: userLoggedIn,
  idCheck: idCheck,
  userBelongsToUrl: userBelongsToUrl
};