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


export const getAllOrders = async (_, { orderedBy }) => {
    try {
      const orders = await dynamoDB
        .query({
          TableName: "Orders",
          IndexName: "orderedBy", // Replace with the actual index name
          KeyConditionExpression: "orderedBy = :orderedBy", // Query condition
          ExpressionAttributeValues: marshall({
            ":orderedBy": orderedBy, // Passing the userId as a value
          }),
        })
        .promise();
      // Check if items exist; otherwise, return an empty array
      const result = orders.Items
        ? orders.Items.map((item) => unmarshall(item))
        : [];

      return result; // This will ensure GraphQL gets an array
    } catch (error) {
    console.log(error);
    return { statusCode: 500, error: error.message };
  }
};

export const getConsumer = async( consumerId ) => {
    try {
          const consumer = await dynamoDB
      .getItem({
        TableName: "Users",
        Key: marshall({ id:consumerId  }),
      })
      .promise();
    return {
      data: unmarshall(consumer.Item),
    };
    } catch (error) {
           console.log(error);
           return { statusCode: 500, error: error.message }; 
    }
}

export const getOrderedProducts = async ( items ) => {
    try {
      const productsArray = await Promise.all(
        items.map(async (item) => {
          const product = await dynamoDB
            .getItem({
              TableName: "Products",
              Key: marshall({ id: item.id }),
            })
            .promise();
          return unmarshall(product.Item); // Unmarshall the product data before returning
        })
      );

      return { data: productsArray }; // Return the array of unmarshalled product
    } catch (error) {
        console.log(error);
        return { statusCode: 500, error: error.message }; 
    }
}