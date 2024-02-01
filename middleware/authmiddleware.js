import JWT from "jsonwebtoken";

// Protected routes token base
export const requireSignIn = async (req, res, next) => {
    // console.log(req.headers.authorization);
    try {
      const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }
  };
  