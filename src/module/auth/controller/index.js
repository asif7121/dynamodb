import { dynamoDB, marshall } from "../../../../db.js";
import bcrypt from "bcrypt";

export const addUser = async (_, args) => {
  const id = Math.floor(Math.random() * 1000000 * 100).toString();
  const item = marshall({
    id,
    username: args.username,
    email: args.email,
    password: bcrypt.hashSync(args.password, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await dynamoDB
    .putItem({
      TableName: "Users",
      Item: item,
    })
    .promise();
  return {
    statusCode: 201,
    message: "User created successfully.",
  };
};
