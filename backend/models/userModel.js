
// 👉 Database queries only
// 🧠 Model rule
// ✔ SQL only
// ❌ No req, res
// ❌ No validation

const db = require("../config/db");

// Insert user
exports.createUser = (data, callback) => {
    const sql = `
    INSERT INTO users (uname, uemail, upassword, role)
    VALUES (?, ?, ?, ?)`;
    db.query(sql, data, callback);
};

// Find user by email
exports.findUserByEmail = (email, callback) => {
    const sql = `
    SELECT UID, uname, uemail, upassword, role
    FROM users
    WHERE uemail = ?`;
    db.query(sql, [email], callback);
};

// Insert student
exports.createStudent = (data, callback) => {
    const sql = `
    INSERT INTO students (sname, semail, sphone)
    VALUES (?, ?, ?)`;
    db.query(sql, data, callback);
};
