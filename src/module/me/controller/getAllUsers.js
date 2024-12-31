import { dynamoDB } from "../../../../db.js";

export const getAllUsers = async () => {
  try {
    const data = await dynamoDB
      .scan({
        TableName: "Users",
      })
      .promise();
    return data.Items.map((item) => ({
      id: item.id.S,
      username: item.username.S,
      email: item.email.S,
      createdAt: item.createdAt.S,
      updatedAt: item.updatedAt.S,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users");
  }
};
