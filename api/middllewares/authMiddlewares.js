const jwt = require("jsonwebtoken");
const User = require("../User/UserModel");

exports.protect = async (req, res, next) => {
  try {
    // בדיקת קיום הדר Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format:', authHeader); // לוג לדיבוג
      return res.status(401).json({ 
        message: "No authorization header",
        error: "Authentication required" 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in header'); // לוג לדיבוג
      return res.status(401).json({ 
        message: "No token provided",
        error: "Authentication required" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('Decoded token:', decoded); // לוג לדיבוג

      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not found for id:', decoded.userId); // לוג לדיבוג
        return res.status(401).json({ 
          message: "User not found",
          error: "Invalid token" 
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.log('JWT verification error:', jwtError); // לוג לדיבוג
      return res.status(401).json({ 
        message: "Invalid token",
        error: jwtError.message 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error); // לוג לדיבוג
    res.status(500).json({ 
      message: "Server error in auth middleware",
      error: error.message 
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.permission !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
