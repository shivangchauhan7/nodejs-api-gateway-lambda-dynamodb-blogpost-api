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
  console.log("event dataaaa", event.authorizationToken);
  console.log("tokennn", jwtToken);
  if (!jwtToken) {
    return sendResponse(403, "Not allowed!");
  }

  try {
    const tokenData = await verifyJwt(jwtToken);
    console.log("token data", tokenData);
    return generatePolicy(tokenData, "Allow", event.methodArn);
  } catch (e) {
    console.log("error", e);
    return sendResponse(403, "Not allowed!");
  }
  //verify jwt here by calling verifyJwt function from another file..
};
