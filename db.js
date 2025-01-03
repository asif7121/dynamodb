// Import the AWS SDK
import AWS from "aws-sdk"; // Use "import  as" to properly import the module
const { marshall, unmarshall } = AWS.DynamoDB.Converter;

// Configure AWS SDK to connect to DynamoDB Local
export const dynamoDB = new AWS.DynamoDB({
  endpoint: "http://localhost:8000", // DynamoDB Local endpoint
  region: "us-west-2", // Region (can be any, doesn't matter for local)
  accessKeyId: "fakeMyKeyId", // Fake credentials for local use
  secretAccessKey: "fakeSecretAccessKey",
});
// List all tables in the local DynamoDB instance
export const listTables = async () => {
  try {
    const data = await dynamoDB.listTables().promise();
    console.log("Tables:", data.TableNames);
  } catch (error) {
    console.error("Error listing tables:", error);
  }
};

export {marshall, unmarshall}