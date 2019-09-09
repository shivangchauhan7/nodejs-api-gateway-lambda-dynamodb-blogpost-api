const AWS = require("aws-sdk");

let options = {};
console.log("sdsdsd", process.env.ENVIRONMENT);
if (process.env.ENVIRONMENT === "LOCAL") {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  };
}

const dynamo = new AWS.DynamoDB.DocumentClient(options);

module.exports = dynamo;
