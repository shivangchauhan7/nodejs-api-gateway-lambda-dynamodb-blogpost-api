"use strict";

const uuidv1 = require("uuid/v1");
const dynamoDb = require("../config/dynamoDb");
const {
  validateBody,
  sendResponse,
  createHash
} = require("../functions/index");

module.exports.signup = async event => {
  console.log("event", event);
  const body = JSON.parse(event.body);
  const userid = uuidv1();
  let isValid = validateBody(body);

  if (isValid) {
    const { name, email, password } = body;
    const tableName = process.env.DYNAMO_TABLE_NAME;

    const emailCheckParams = {
      TableName: tableName,
      IndexName: process.env.INDEX1,
      KeyConditionExpression: "email = :emailId",
      ExpressionAttributeValues: { ":emailId": email },
      ScanIndexForward: true,
      Limit: 1,
      Select: "ALL_ATTRIBUTES"
    };

    try {
      const data = await dynamoDb.query(emailCheckParams).promise();
      if (data.Count > 0) {
        return sendResponse(400, "Email already exists!");
      } else {
        const passwordHash = await createHash(password);
        const sortKey = "user";
        const params = {
          TableName: tableName,
          Item: {
            userid,
            postid: sortKey,
            name,
            email,
            password: passwordHash
          },
          ConditionExpression: "attribute_not_exists(userid)"
        };
        await dynamoDb.put(params).promise();
        return sendResponse(200, "User registered successfully.");
      }
    } catch (e) {
      console.log(e);
      return sendResponse(501, "Cannot register user");
    }
  } else {
    return sendResponse(400, "Invalid input data.");
  }
};
