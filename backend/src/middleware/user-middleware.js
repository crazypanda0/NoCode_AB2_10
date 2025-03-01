const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access denied. No token provided." 
            });
        }

        const decoded = jwt.verify(token, 'twitter_secret');

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Please login..." 
        });
    }
};

module.exports = authenticateUser;
