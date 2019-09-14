"use strict";

const dynamoDb = require("../config/dynamoDb");
const { sendResponse, validateBody } = require("../functions/index");
const uuidv1 = require("uuid/v1");

module.exports.create = async event => {
  const body = JSON.parse(event.body);
  const isValid = validateBody(body);
  if (isValid) {
    try {
      const userData = event.requestContext.authorizer.principalId;
      const { userid } = userData;
      const { postTitle, postBody, imgUrl, tags } = body;
      if (userid) {
        const postid = uuidv1();
        const TableName = process.env.DYNAMO_TABLE_NAME;
        const isUserExistsParams = {
          TableName,
          KeyConditionExpression: "userid = :userId",
          ExpressionAttributeValues: {
            ":userId": userid
          },
          ScanIndexForward: true,
          Select: "ALL_ATTRIBUTES"
        };

        const isUserIdExists = await dynamoDb
          .query(isUserExistsParams)
          .promise();
        if (isUserIdExists.Count > 0) {
          const params = {
            TableName,
            Item: {
              userid,
              postid: `post-${postid}`,
              postTitle,
              postBody,
              imgUrl,
              tags
            },
            ConditionExpression: "attribute_not_exists(postid)"
          };
          await dynamoDb.put(params).promise();
          return sendResponse(200, "Post created successfully.");
        } else {
          return sendResponse(444, "Cannot find this user.");
        }
      } else {
        return sendResponse(404, "Data not found.");
      }
    } catch (e) {
      return sendResponse(444, "Cannot create a post.");
    }
  } else {
    return sendResponse(400, "Invalid input details.");
  }
};
