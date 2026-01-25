const db = require("../config/db");


// Get all students
exports.getAllStudents = (callback) => {
    const sql = `
        SELECT 
            s.SID, 
            s.sname, 
            s.semail, 
            s.gender, 
            s.dob, 
            s.sphone, 
            c.Cname as course_name, 
            s.created_at
        FROM students s
        LEFT JOIN courses c ON s.CID = c.CID
        ORDER BY s.SID DESC
    `;
    db.query(sql, callback);
};

// Get student by ID
exports.getStudentById = (id, callback) => {
    const sql = `SELECT * FROM students WHERE SID = ?`;
    db.query(sql, [id], callback);
};

// Create student (Admin)
exports.createStudent = (data, callback) => {
    // data = [sname, semail, gender, dob, sphone, CID]
    const sql = `
        INSERT INTO students (sname, semail, gender, dob, sphone, CID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, data, callback);
};

// Update student
exports.updateStudent = (id, data, callback) => {
    // data = [sname, semail, gender, dob, sphone, CID, id]
    const sql = `
        UPDATE students 
        SET sname = ?, semail = ?, gender = ?, dob = ?, sphone = ?, CID = ?
        WHERE SID = ?
    `;
    const params = [...data, id];
    db.query(sql, params, callback);
};

// Delete student
exports.deleteStudent = (id, callback) => {
    const sql = `DELETE FROM students WHERE SID = ?`;
    db.query(sql, [id], callback);
};

// Count Student
// exports.countStudent = (callback) => {
//     const sql = `
//     SELECT COUNT(*)
//     FROM students`;
//     db.query(sql, callback);
// };
