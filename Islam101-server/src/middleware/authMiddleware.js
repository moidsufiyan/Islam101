const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // 1. Check if Authorization header exists and starts with "Bearer"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
        }

        // 2. Extract the token
        const token = authHeader.split(' ')[1];

        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user from the token's payload
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        // 5. Attach user to the request object for downstream handlers
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
        }
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { protect };
