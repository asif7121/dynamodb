import { dynamoDB, unmarshall } from "../../../../db.js";

export const getUser = async ( _, { id } ) => {
  try {
    const data = await dynamoDB
      .getItem({
        TableName: "Users",
        Key: { id: { S: id } },
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
  } catch ( error ) {
      console.error( "Error fetching user:", error );
      throw new Error( "Could not fetch user" );
    }
}
