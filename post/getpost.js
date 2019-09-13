"use strict";

const { sendResponse } = require("../functions/index");
const dynamoDb = require("../config/dynamoDb");

module.exports.getpost = async event => {
  try {
    const { id } = event.pathParameters;
    if (id) {
      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        IndexName: "index2",
        KeyConditionExpression: "postid = :postId",
        ExpressionAttributeValues: {
          ":postId": id
        },
        ScanIndexForward: true,
        Select: "ALL_ATTRIBUTES"
      };

      const data = await dynamoDb.query(params).promise();
      if (data.Count > 0) {
        return sendResponse(200, JSON.stringify(data.Items));
      } else {
        return sendResponse(404, "Post not found.");
      }
    } else {
      return sendResponse(400, "Invalid post id.");
    }
  } catch (e) {
    console.log(e);
    return sendResponse(444, "Cannot fetch this blog post.");
  }
};
