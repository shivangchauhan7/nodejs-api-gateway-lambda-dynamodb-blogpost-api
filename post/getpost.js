"use strict";

const { sendResponse } = require("../functions/index");
const dynamoDb = require("../config/dynamoDb");

module.exports.getpost = async event => {
  try {
    const { id } = event.pathParameters;
    if (id) {
      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Index: "index",
        KeyConditionExpression: "postid = :postId",
        ExpressionAttributeValues: {
          ":postId": id
        },
        ScanIndexForward: true,
        Select: "ALL_ATTRIBUTES"
      };

      const data = await dynamoDb.query(params).promise();
      return sendResponse(200, JSON.stringify(data.Items));
    } else {
      return sendResponse(400, "Invalid post id.");
    }
  } catch (e) {
    console.log(e);
    return sendResponse(444, "Cannot fetch this blog post.");
  }
};
