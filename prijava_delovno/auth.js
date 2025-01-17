const jwt = require('jsonwebtoken');

// Replace with a secure, unique secret key
const SECRET_KEY = process.env.SECRET_KEY || 'Projekt';
function generateToken(user) {
    return jwt.sign(
        {
            id: user._id, // User ID from database
            username: user.Username, // User's username
        },
        SECRET_KEY, // Secret key
        { expiresIn: '1h' } // Token expiration time (1 hour)
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY); // Verifies and decodes the token
    } catch (err) {
        console.error('Invalid token:', err.message);
        throw new Error('Invalid token');
    }
}

function authenticateToken(req, res, next) {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    try {
        // Verify the token
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload; // Attach decoded user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { generateToken, verifyToken, authenticateToken };