import { dynamoDB } from "../../../../db.js";

export const getUser = async (_, args) => {
  try {
    const data = await dynamoDB
      .getItem({
        TableName: "Users",
          Key: { id: args.id },
      })
          .promise();
      if ( !data ) {
          return {message: 'Cannot find user'}
      }
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Could not fetch user");
  }
};
