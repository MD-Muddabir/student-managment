const db = require("../config/db");


// get stduent name
exports.getStudentName = (id, callback) => {
    const sql = `SELECT uemail FROM users WHERE UID = ?`;
    db.query(sql, [id], callback);
};

// post student details
exports.addStudentDetails = (data, callback) => {
    const sql = `
        INSERT INTO students 
        (UID, sname, gender, dob, phone, address, profile_completed) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    db.query(sql, data, callback);
};

// get student enrolled Courses
exports.getEnrolledCourses = (SID, callback) => {
    const sql = `
        SELECT c.cname, c.description, c.duration,c.code
        FROM enrollments e
        JOIN courses c ON e.CID = c.CID
        WHERE e.SID = ?;
    `;
    db.query(sql, [SID], callback);
};


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
// Get enrolled courses for a specific student
// Get enrolled courses for a specific student
exports.getEnrolledCourses = (studentId, callback) => {
    const sql = `
        SELECT c.CID, c.cname, c.code, c.duration
        FROM enrolled_courses ec
        JOIN courses c ON ec.CID = c.CID
        WHERE ec.SID = ?
    `;
    db.query(sql, [SID], callback);
};

// Enroll student in a course
exports.enrollStudent = (studentId, courseId, callback) => {
    const sql = `INSERT INTO enrolled_courses (SID, CID) VALUES (?, ?)`;
    db.query(sql, [studentId, courseId], callback);
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


// Create student details
exports.createStudentDetails = (data, callback) => {
    const sql = `
        INSERT INTO students (UID, gender, dob, sphone)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, data, callback);
};

exports.findStudentByUID = (UID, callback) => {
    const sql = `SELECT SID FROM students WHERE UID = ?`;
    db.query(sql, [UID], callback);
};