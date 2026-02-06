const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            success : false,
            message : "Not authenticated!"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error verifying token : ", err);
        return res.status(400).json({
            success : false,
            message : "Invalid token."
        });
    }
}

module.exports = verifyToken;