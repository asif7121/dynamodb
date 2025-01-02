import { dynamoDB, marshall, unmarshall } from "../../../../db.js";

export const orderProducts = async (_, { products, userId }) => {
  try {
    const orderId = Math.floor(Math.random() * 1000000 * 100).toString();
    // Prepare `TransactWriteItems` requests for order creation and stock updates
    const transactItems = [];

    // Add the order creation to the transaction
    transactItems.push({
      Put: {
        TableName: "Orders",
        Item: marshall({
          id: orderId,
          items: products.map((product) => ({
            id: product.id,
            quantity: product.quantity,
          })),
          orderedBy: userId,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      },
    });

    // Add stock decrement operations for each product
    products.forEach((product) => {
      transactItems.push({
        Update: {
          TableName: "Products",
          Key: marshall({ id: product.id }),
          ConditionExpression: "stock >= :requiredStock", // Check both conditions
          UpdateExpression: "SET stock = stock - :decrement",
          ExpressionAttributeValues: marshall({
            ":decrement": product.quantity, // Decrease the stock by quantity
            ":requiredStock": product.quantity, // Ensure stock is enough for the order
          }),
        },
      });
    });

    // Execute the transaction
    await dynamoDB
      .transactWriteItems({
        TransactItems: transactItems,
      })
      .promise();

    return {
      statusCode: 201,
      message: "Order created successfully and product stocks updated.",
    };
  } catch (error) {
      console.log( error );
      if (error.code === "TransactionCanceledException") {
        // Handle specific DynamoDB transaction cancel reasons
        return {
          statusCode: 400,
          error:
            "Transaction was cancelled. Please ensure stock is sufficient for all products.",
        };
      }
    return { statusCode: 500, error: error.message };
  }
};


// export const getAllOrders = async ( _, { userId } ) => {
//     try {
//         const orders = await dynamoDB
//           .query({
//             TableName: "Orders",
//             IndexName: "orderedBy", // Replace with the actual index name
//             KeyConditionExpression: "orderedBy = :userId", // Query condition
//             ExpressionAttributeValues: marshall({
//               ":userId": userId, // Passing the userId as a value
//             }),
//           })
//           .promise();
//         return orders.Items.map((item)=> unmarshall(item))
        
//     } catch ( error ) {
//         console.log(error);
//         return { statusCode: 500, error: error.message };
//     }
// }

