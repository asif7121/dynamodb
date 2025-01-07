import { AuthTypeDefs } from "../../module/auth/authTypeDefs.js";
import { UserTypeDefs } from "../../module/me/userTypeDefs.js";
import { OrderTypeDefs } from "../../module/order/orderTypeDefs.js";
import { ProductTypeDefs } from "../../module/product/productTypeDefs.js";

export const typeDefs = `#graphql
 ${AuthTypeDefs}
 ${UserTypeDefs}
 ${ProductTypeDefs}
 ${OrderTypeDefs}
`;
