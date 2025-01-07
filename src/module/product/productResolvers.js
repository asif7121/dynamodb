import { dynamoDB, marshall, unmarshall } from "../../../db.js";
import { authMiddleware } from "../auth/authMiddleware.js";

export const createProduct = authMiddleware(
  async (_, { name, price, stock }, context) => {
    try {
      const user = context.user;
      const id = Math.floor(Math.random() * 1000000 * 100).toString();
      const item = marshall({
        id,
        name,
        price,
        stock,
        createdBy: user.id,
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
  }
);

export const getAllProducts = authMiddleware(async (_,{},context) => {
  try {
    // Get table information
    const tableDetails = await dynamoDB
      .describeTable({ TableName: "Products" })
      .promise();
    const tableSizeBytes = tableDetails.Table.TableSizeBytes;

    // Calculate totalSegments based on table size (1 MB per segment)
    const segmentSizeBytes = 1 * 1024 * 1024; // 1 MB in bytes
    const totalSegments = Math.ceil(tableSizeBytes / segmentSizeBytes);

    console.log(
      `Table size: ${tableSizeBytes} bytes, Total Segments: ${totalSegments}`
    );

    // Limit totalSegments to avoid overloading DynamoDB
    const maxSegments = 1000; // AWS recommends a reasonable upper limit
    const effectiveSegments = Math.min(totalSegments, maxSegments);

    const scanPromises = [];

    // Initiate parallel scans
    for (let segment = 0; segment < effectiveSegments; segment++) {
      const scanParams = {
        TableName: "Products",
        Segment: segment,
        TotalSegments: effectiveSegments,
      };
      scanPromises.push(dynamoDB.scan(scanParams).promise());
    }

    // Resolve all parallel scan promises
    const results = await Promise.all(scanPromises);

    // Combine all items from each segment
    const allItems = results
      .flatMap((result) => result.Items)
      .map((item) => unmarshall(item));

    return allItems;
  } catch (error) {
    console.log(error);
    return { statusCode: 500, error: error.message };
  }
});

export const getProduct = authMiddleware(async (_, { id }, context) => {
  try {
    const product = await dynamoDB
      .getItem({
        TableName: "Products",
        Key: marshall({ id: id }),
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
});

export const getProductOwner = authMiddleware(async (userId,{},context) => {
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
});
