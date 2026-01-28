const db = require("../config/db");

// Get all courses
exports.getAllCourses = (callback) => {
    const sql = "SELECT * FROM courses";
    db.query(sql, callback);
};

// Get course by ID
exports.getCourseById = (id, callback) => {
    const sql = "SELECT * FROM courses WHERE CID = ?";
    db.query(sql, [id], callback);
};

// Get course count
exports.getCourseCount = (callback) => {
    const sql = "SELECT COUNT(*) AS totalCourses FROM courses";
    db.query(sql, callback);
};