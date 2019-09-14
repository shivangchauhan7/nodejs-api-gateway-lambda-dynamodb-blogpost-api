"use strict";

const {
  sendResponse,
  verifyJwt,
  generatePolicy
} = require("../functions/index");

module.exports.authCheck = async event => {
  if (!event.authorizationToken) {
    return sendResponse(403, "Not allowed!");
  }
  const authToken = event.authorizationToken.split(" ");
  const jwtToken = authToken[0];
  if (!jwtToken) {
    return sendResponse(403, "Not allowed!");
  }

  try {
    const tokenData = await verifyJwt(jwtToken);
    return generatePolicy(tokenData, "Allow", event.methodArn);
  } catch (e) {
    return sendResponse(403, "Not allowed!");
  }
  //verify jwt here by calling verifyJwt function from another file..
};
