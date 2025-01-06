import { dynamoDB, marshall, unmarshall } from "../../../../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../middleware/generateToken.js";

export const addUser = async (_, args) => {
  const id = Math.floor(Math.random() * 1000000 * 100).toString();
  const item = marshall({
    id,
    username: args.username,
    email: args.email,
    password: bcrypt.hashSync(args.password, 10),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await dynamoDB
    .putItem({
      TableName: "Users",
      Item: item,
    })
    .promise();
  const token = await generateToken( { id } )
  const response = {
    ...unmarshall( item ),
    authToken: {token}
  }
  return {
    statusCode: 201,
    message: "User created successfully.",
    data: response,
  };
};


export const loginUser = async (_, { input: { email, password } }) => {
  try {
    // Query user by email using the GSI
    const result = await dynamoDB
      .query({
        TableName: "Users",
        IndexName: "email",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: marshall({
          ":email": email,
        }),
      })
      .promise();

    if (result.Items.length === 0) {
      return {
        statusCode: 404,
        message: "User not found.",
        error: "Invalid email or password.",
      };
    }

    const user = unmarshall(result.Items[0]);

    // Compare password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        message: "Authentication failed.",
        error: "Invalid email or password.",
      };
    }

    // Generate token
    const token = await generateToken({ id: user.id });

    const response = {
      ...user,
      authToken: { token },
    };

    return {
      statusCode: 200,
      message: "Login successful.",
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal server error.",
      error: error.message,
    };
  }
};