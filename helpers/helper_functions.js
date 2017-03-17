// Generate a random string
function generateRandomString() {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for(let i = 0; i < 6; ++i) {
    result.push( alpha.charAt(Math.floor(Math.random() * alpha.length)));
  }
  return result.join('');
}

// Helper function to get the users URLs
function urlsForUserId(userID) {
  const userURLS = {};
  for(let key in urlDatabase) {
    if(userID === urlDatabase[key].userid) {
      userURLS[key] = urlDatabase[key].url;
      console.log(urlDatabase[key]);
    }
  }
  return userURLS;
}

module.exports = {
  generateRandomString: generateRandomString, 
  urlsForUserId: urlsForUserId
};