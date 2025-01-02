import { dynamoDB, unmarshall } from "../../../../db.js";

export const getAllUsers = async () => {
  try {
    const data = await dynamoDB
      .scan({
        TableName: "Users",
        FilterExpression: "isActive = :isActive",
        ExpressionAttributeValues: {
          ":isActive": { BOOL: true }, // Filter for active users
        },
      })
      .promise();
    return data.Items.map((item)=> unmarshall(item))
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users");
  }
};
