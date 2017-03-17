// Generate a random string
function generateRandomString() {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for(let i = 0; i < 6; ++i) {
    result.push( alpha.charAt(Math.floor(Math.random() * alpha.length)));
  }
  return result.join('');
}

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
  console.log("response.locals", typeof response.locals);
  console.log("response.locals.user", typeof response.locals.user);
  console.log("response.locals.user.id", typeof response.locals.user.id);
  if(typeof response.locals.user !== "undefined" && typeof response.locals.user.id !== "undefined") {
    return true;
  }
  return false;
}

module.exports = {
  generateRandomString: generateRandomString, 
  urlsForUserId: urlsForUserId,
  emailCheck: emailCheck,
  userLoggedIn: userLoggedIn,
  idCheck: idCheck
};