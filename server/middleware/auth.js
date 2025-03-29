const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.id; // Ensure this is set
      console.log('Decoded userId:', req.userId);
      next();
    } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
    }
  };

module.exports = authenticateToken;