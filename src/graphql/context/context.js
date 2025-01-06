import jwt from "jsonwebtoken";

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return user;
    }
    return null;
  } catch (error) {
    throw new Error("Invalid token.");
  }
};

export const context = async ({ req }) => {
  if (
    req.body.operationName === "addUser" ||
    req.body.operationName === "loginUser"
  )
    return {};

  const token = req.headers.authorization || "";
  const user = await getUser(token);
  if (!user) {
    throw new Error("Unauthorized");
  }

  return { user };
};
