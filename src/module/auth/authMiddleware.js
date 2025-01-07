import { verifyToken } from "../../core/utils.js";


export const authMiddleware =
  (resolver, requireAuth = true) =>
  async (parent, args, context, info) => {
    if (!requireAuth) {
      return resolver(parent, args, context, info);
      }
      if (!context.req) {
        throw new Error("Request object missing in context");
      }
    const token = context.req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication token missing");
    }

    try {
      const user = verifyToken(token);
      context.user = user;
      return resolver(parent, args, context, info);
    } catch ( error ) {
        console.log(error.message)
      throw new Error("Invalid or expired token");
    }
  };
