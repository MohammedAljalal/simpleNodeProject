const jwt = require('jsonwebtoken');
const Users = require('../model/Usermodel');

const authorizeToken = async (req, res, next) => {
  try {
   
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization header missing"
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization format is 'Bearer <token>'"
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    
    req.user = decoded;

  
    next();

  } catch (err) {
   
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(req.headers['authorization']?.split(' ')[1]);

      if (decoded?.id) {
        const user = await Users.findById(decoded.id);
        if (user) {
          user.isLoggedIn = false;
          await user.save();
        }
      }

      return res.status(401).json({
        status: "fail",
        message: "Token expired, user logged out"
      });
    }

    return res.status(401).json({
      status: "fail",
      message: "Invalid token"
    });
  }
};

module.exports = authorizeToken;
