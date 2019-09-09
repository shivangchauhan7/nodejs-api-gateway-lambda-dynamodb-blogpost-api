const dynamoDb = require("../config/dynamoDb");
const uuidv1 = require("uuid/v1");

module.exports.signup = async event => {
  const body = JSON.parse(event.body);
  const userid = uuidv1();
  let isValid = true;
  Object.values(body).forEach(el => {
    if (!el) isValid = false;
  });
  if (isValid) {
    const { name, email, password } = body;
    const sortKey = "user";
    const params = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: {
        userid,
        postid: sortKey,
        name,
        email,
        password
      },
      ConditionExpression: "attribute_not_exists(email)"
    };

    try {
      await dynamoDb.put(params).promise();
      return sendResponse(200, "User registered successfully.");
    } catch (e) {
      return sendResponse(501, "Cannot create a user.");
    }
  } else {
    return sendResponse(400, "Invalid input data.");
  }
};

const sendResponse = (statusCode, message) => {
  const response = {
    statusCode: statusCode,
    body: message,
    headers: { "Content-Type": "text/plain" }
  };
  return response;
};
