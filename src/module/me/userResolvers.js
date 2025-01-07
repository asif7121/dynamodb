import { dynamoDB, marshall, unmarshall } from "../../../db.js";



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
    return data.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users");
  }
};


export const getUser = async (_, {}, context) => {
    try {
      const {user} = context
    const data = await dynamoDB
      .getItem({
        TableName: "Users",
        Key: marshall({ id: user.id }),
      })
      .promise();
    if (!data.Item) {
      return { statusCode: 404, error: "Cannot find user" };
    }
    return {
      statusCode: 200,
      message: "User fetched successfully.",
      data: unmarshall(data.Item),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Could not fetch user");
  }
};