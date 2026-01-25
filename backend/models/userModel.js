
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

// Find user by email with student details
exports.findUserByEmail = (email, callback) => {
    const sql = `
    SELECT u.UID, u.uname, u.uemail, u.upassword, u.role, s.sphone
    FROM users u
    LEFT JOIN students s ON u.uemail = s.semail
    WHERE u.uemail = ?`;
    db.query(sql, [email], callback);
};

// Find user by ID for dashboard profile
exports.findUserById = (id, callback) => {
    const sql = `
    SELECT u.UID, u.uname, u.uemail, u.role, s.sphone
    FROM users u
    LEFT JOIN students s ON u.uemail = s.semail
    WHERE u.UID = ?`;
    db.query(sql, [id], callback);
};

// Insert student
exports.createStudent = (data, callback) => {
    const sql = `
    INSERT INTO students (sname, semail, sphone)
    VALUES (?, ?, ?)`;
    db.query(sql, data, callback);
};


