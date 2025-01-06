import jwt from "jsonwebtoken"


export const generateToken = async ( payload ) => {
    const {id} = payload
        const token = jwt.sign(
          { id }, // Payload
          process.env.JWT_SECRET_KEY, // Secret key
          {
            algorithm: "HS256", 
            expiresIn: process.env.JWT_EXPIRATION, // Expiration time
          }
        );
    return token
}