"use strict";

const { sendResponse, validateBody } = require("../functions/index");
const dynamoDb = require("../config/dynamoDb");

module.exports.updatepost = async event => {
  try {
    const body = JSON.parse(event.body);
    const isValid = validateBody(body);
    if (!isValid) return sendResponse(400, "Invalid input data.");

    const { postTitle, postBody, imgUrl, tags, postid } = body;
    const userData = event.requestContext.authorizer.principalId;
    const parsedData = JSON.parse(userData);
    const { userid } = parsedData;
    const params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Key: {
        userid,
        postid: `post-${postid}`
      },
      ExpressionAttributeValues: {
        ":postTitle": postTitle,
        ":postBody": postBody,
        ":imgUrl": imgUrl,
        ":tags": tags
      },
      UpdateExpression:
        "SET postTitle = :postTitle, postBody = :postBody, imgUrl = :imgUrl, tags = :tags",
      ReturnValues: "ALL_NEW"
    };

    const data = await dynamoDb.update(params).promise();
    if (data.Attributes) {
      return sendResponse(200, JSON.stringify(data.Attributes));
    } else {
      return sendResponse(404, "Post not found.");
    }
  } catch (e) {
    return sendResponse(444, "Cannot update this blog post.");
  }
};
