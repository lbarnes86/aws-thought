//  import dependencies
const AWS = require("aws-sdk");
const fs = require("fs");

// create the interface with DynamoDB, but with DocumentClient this time to create service object
AWS.config.update({
    region: "us-east-2"
  });
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// use fs package to read the users.json and assign the object to the allUsers constant
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

// loop over allUsers array and create params object
allUsers.forEach(user => {
    const params = {
      TableName: "Thought",
      Item: {
        "username": user.username,
        "createdAt": user.createdAt,
        "thought": user.thought
      }
    };
  //   make a call to the database with the service interface object
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
});
})