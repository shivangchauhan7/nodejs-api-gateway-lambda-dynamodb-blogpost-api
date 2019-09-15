"use strict";

const dynamoDb = require("../config/dynamoDb");
const { sendResponse } = require("../functions/index");

module.exports.listall = async event => {
  try {
    const userData = event.requestContext.authorizer.principalId;
    const parsedData = JSON.parse(userData);
    const { userid } = parsedData;
    if (!userid) return sendResponse(400, "Invalid user id.");
    const params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression:
        "userid = :userId AND begins_with(postid,:postId)",
      ExpressionAttributeValues: {
        ":userId": userid,
        ":postId": "post"
      },
      ScanIndexForward: true,
      Select: "ALL_ATTRIBUTES"
    };

    const posts = await dynamoDb.query(params).promise();
    return sendResponse(200, JSON.stringify(posts.Items));
  } catch (e) {
    return sendResponse(444, "Cannot get user posts.");
  }
};
