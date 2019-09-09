"use strict";

module.exports.authCheck = (event, context, callback) => {
  if (!event.authorizationToken) {
    return callback("Not allowed!");
  }
  const authToken = event.authorizationToken.split(" ");
  const jwtToken = authToken[1];
  if (!jwtToken) {
    return callback("Not allowed!");
  }
  //verify jwt here by calling verifyJwt function from another file..
};
