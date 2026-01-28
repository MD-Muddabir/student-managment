const db = require("./config/db");

// Enroll student in course
exports.enrollStudent = (SID, CID, callback) => {
    const sql = `
        INSERT INTO enrolled_courses (SID, CID)
        VALUES (?, ?)
    `;
    db.query(sql, [SID, CID], callback);
};

// Get enrolled courses for student
exports.getStudentCourses = (SID, callback) => {
    const sql = `
        SELECT c.CID, c.Cname, c.code, c.duration
        FROM enrolled_courses ec
        JOIN courses c ON ec.CID = c.CID
        WHERE ec.SID = ?
    `;
    db.query(sql, [SID], callback);
};

