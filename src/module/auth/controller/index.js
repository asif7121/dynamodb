import { dynamoDB } from "../../../../db.js";
import bcrypt from 'bcrypt'
export const addUser = async (_, args) => {
  await dynamoDB
    .putItem({
      TableName: "Users",
      Item: {
        id: { S: Math.floor(Math.random() * 1000000).toString() },
        username: { S: args.username },
        email: { S: args.email },
        password: { S: bcrypt.hashSync(args.password, 10) },
        createdAt: { S: Date.now().toString() },
        updatedAt: { S: Date.now().toString() },
      },
    })
    .promise();
  return "User added successfully!";
};
