"use strict";

const { sendResponse, validateBody } = require("../functions/index");
const dynamoDb = require("../config/dynamoDb");

module.exports.delete = async event => {
  try {
    const body = JSON.parse(event.body);
    const isValid = validateBody(body);
    if (!isValid) return sendResponse(400, "Invalid input details.");
    const userData = event.requestContext.authorizer.principalId;
    const { userid } = userData;
    const { postid } = body;
    if (postid) {
      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          userid,
          postid: `post-${postid}`
        }
      };

      const data = await dynamoDb.delete(params).promise();
    } else {
      return sendResponse(400, "Invalid post id.");
    }
  } catch (e) {
    return sendResponse(444, "Cannot delete this blog post.");
  }
};
