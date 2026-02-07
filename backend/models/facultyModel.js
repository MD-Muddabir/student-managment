
const db = require("../config/db");


exports.getFacultyCount = (callback) => {
    const sql = "SELECT COUNT(*) AS totalFaculty FROM users WHERE role = 'faculty'";
    db.query(sql, callback);
};


exports.getStudentCount = (callback) => {
    const sql = "SELECT COUNT(*) AS totalStudents FROM students";
    db.query(sql, callback);
};

exports.getStudentDetails = (callback) => {
    const sql = `SELECT s.SID,s.sname,u.uemail,s.gender,s.dob,s.phone,s.address,s.profile_completed,COUNT(e.CID) AS total_courses
    FROM students s
    JOIN users u 
        ON s.UID = u.UID
    LEFT JOIN enrollments e 
        ON s.SID = e.SID
    GROUP BY 
    	s.SID,s.sname,u.uemail,s.gender,s.dob,s.phone,s.address,s.profile_completed;`;
    db.query(sql, callback);
};

