"use strict";

const dynamoDb = require("../config/dynamoDb");
const {
  validateBody,
  sendResponse,
  signJwt,
  checkHash
} = require("../functions/index");

module.exports.login = async event => {
  const body = JSON.parse(event.body);
  const isValid = validateBody(body);
  if (isValid) {
    const checkEmailParams = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      IndexName: process.env.INDEX1,
      KeyConditionExpression: "email = :emailId AND postid = :postId",
      ExpressionAttributeValues: { ":emailId": body.email, ":postId": "user" },
      ScanIndexForward: true,
      Select: "ALL_ATTRIBUTES"
    };
    try {
      const data = await dynamoDb.query(checkEmailParams).promise();
      if (data.Count > 0) {
        const Item = data.Items[0];
        const passwordHash = Item.password;
        const userid = Item.userid;
        const isPassValid = await checkHash(body.password, passwordHash);

        if (isPassValid) {
          const token = await signJwt({ userid });
          return sendResponse(200, JSON.stringify({ token }));
        } else {
          return sendResponse(401, "Wrong password!");
        }
      } else {
        return sendResponse(404, "User not found!");
      }
    } catch (e) {
      return sendResponse(401, "Cannot authenticate");
    }
  } else {
    return sendResponse(400, "Invalid input details.");
  }
};
