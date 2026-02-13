const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("JWT Token:", token);
    console.log("Auth Header:", req.headers.authorization);


    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // 🎯 UID AVAILABLE HERE
        req.user = decoded; // { UID, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
