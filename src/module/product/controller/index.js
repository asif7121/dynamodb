import { dynamoDB, marshall, unmarshall } from "../../../../db.js";

export const createProduct = async (_, { name, price, stock, userId }) => {
  try {
    const id = Math.floor(Math.random() * 1000000 * 100).toString();
    const item = marshall({
      id,
      name,
      price,
      stock,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await dynamoDB
      .putItem({
        TableName: "Products",
        Item: item,
      })
      .promise();
    return {
      statusCode: 201,
      message: "Product created successfully.",
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, error: error.message };
  }
};

export const getAllProducts = async () => {
  try {
    const products = await dynamoDB.scan({ TableName: "Products" }).promise();
    return products.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch users", error);
  }
};

export const getProduct = async (_, { id }) => {
  try {
    const product = await dynamoDB
      .getItem({
        TableName: "Products",
        Key: { id: { S: id } },
      })
      .promise();
    if (!product.Item) {
      return { statusCode: 404, error: "Cannot find product" };
    }
    return {
      statusCode: 200,
      message: "Product fetched successfully.",
      data: unmarshall(product.Item),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, error: error.message };
  }
};

export const getProductOwner = async (userId) => {
  try {
    const user = await dynamoDB
      .getItem({
        TableName: "Users",
        Key: marshall({ id: userId }),
      })
      .promise();
    return {
      data: unmarshall(user.Item),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, error: error.message };
  }
};
