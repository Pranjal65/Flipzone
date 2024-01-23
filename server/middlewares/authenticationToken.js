const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    
  const token = req.header('Authorization');
 // console.log("token",token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token.split(' ')[1], 'Flipzone2023', async (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    const decoded = jwt.verify(token.split(' ')[1], 'Flipzone2023');
    const userModel = require("../models/userModel.js");
    const existingUser = await userModel.findOne({ email: decoded.email });
    req.user = existingUser;
   // console.log(req.user);
   // req.user = user;
    next();
  });
};

module.exports = authenticateToken;
