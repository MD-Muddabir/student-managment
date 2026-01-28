
// 👉 Database queries only
// 🧠 Model rule
// ✔ SQL only
// ❌ No req, res
// ❌ No validation

const db = require("../config/db");

// Insert user
exports.createUser = (data, callback) => {
    const sql = `
    INSERT INTO users (uemail, upassword, role, status)
    VALUES (?, ?, ?, ?)`;
    db.query(sql, data, callback);
};

// Find user by email with student details
exports.findUserByEmail = (email, callback) => {
    const sql = `
SELECT u.UID, u.uemail, u.upassword, u.role, u.status
FROM users u
WHERE u.uemail = ?`;
    db.query(sql, [email], callback);
};

// Find user by ID for dashboard profile
exports.findUserById = (id, callback) => {
    const sql = `
    SELECT *
    FROM users
    WHERE UID = ?`;
    db.query(sql, [id], callback);
};

// Insert student
// exports.createStudent = (data, callback) => {
//     const sql = `
//     INSERT INTO students (sname, semail, sphone)
//     VALUES (?, ?, ?)`;
//     db.query(sql, data, callback);
// };

// Insert student details
exports.createStudentDetails = (data, callback) => {
    const sql = `
        INSERT INTO students (sname, semail, gender, dob, sphone)
        VALUES (?, ?, ?, ?, ?)
        `;
    db.query(sql, data, callback);
};

// Course Count
exports.getCourseCount = (callback) => {
    const sql = `SELECT COUNT(*) AS totalCourses FROM courses`;
    db.query(sql, callback);
}

