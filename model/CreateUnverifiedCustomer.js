var silly = require('sillyname');

module.exports.create = function(context) {
  var randomInt = function(n) {return Math.floor(Math.random()*n)};
  var name = silly().split(' ');

  return {
    "firstName": name[0],
    "lastName": name[1],
    "email": name[0]+name[1]+"@dwolla.com",
    "ipAddress": randomInt(255)+'.'+randomInt(255)+'.'+randomInt(255)+'.'+randomInt(255)
  }
}