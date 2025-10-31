import jwt from "jsonwebtoken";

export const authMiddleware = (jwtSecret: string) => {
  return async ({ req }: any) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return { userId: null };
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      return { userId: decoded.userId };
    } catch (error) {
      return { userId: null };
    }
  };
};
