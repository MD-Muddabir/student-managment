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
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, data, callback);
};

// get student enrolled Courses
exports.getEnrolledCourses = (SID, callback) => {
    const sql = `
        SELECT
            sec.section_name,
            f.fname AS faculty_name,
            c.cname,
            c.code,
            c.duration
        FROM enrollments e
        JOIN sections sec ON e.section_id = sec.section_id
        JOIN courses c ON e.CID = c.CID
        JOIN faculty_courses fc ON c.CID = fc.CID
        JOIN faculty f ON fc.FID = f.FID
        WHERE e.SID = ?
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
// exports.getEnrolledCourses = (studentId, callback) => {
//     const sql = `
//         SELECT c.CID, c.cname, c.code, c.duration
//         FROM enrolled_courses ec
//         JOIN courses c ON ec.CID = c.CID
//         WHERE ec.SID = ?
//     `;
//     db.query(sql, [SID], callback);
// };

// ✅ Enroll student in course (SID REQUIRED)
// exports.enrollStudent = (SID, CID, callback) => {
//     // 1️⃣ Enroll student into course
//     const enrollSql = `
//         INSERT INTO enrollments (SID, CID, payment_status)
//         VALUES (?, ?, 'paid')
//     `;

//     db.query(enrollSql, [SID, CID], (err) => {
//         if (err) return callback(err);

//         // 2️⃣ Find section via course → faculty → section
//         const sectionSql = `
//             SELECT fs.section_id
//             FROM faculty_courses fc
//             JOIN faculty_sections fs ON fc.FID = fs.FID
//             WHERE fc.CID = ?
//             LIMIT 1
//         `;

//         db.query(sectionSql, [CID], (err2, rows) => {
//             if (err2) return callback(err2);

//             if (rows.length === 0) {
//                 // No faculty/section mapped
//                 return callback(null);
//             }

//             const sectionId = rows[0].section_id;

//             // 3️⃣ Assign section to student
//             const updateStudentSql = `
//                 UPDATE students
//                 SET section_id = ?
//                 WHERE SID = ?
//             `;

//             db.query(updateStudentSql, [sectionId, SID], callback);
//         });
//     });
// };

exports.enrollStudent = (SID, CID, callback) => {

    // 1️⃣ prevent duplicate
    const checkSql = `
        SELECT EID FROM enrollments
        WHERE SID = ? AND CID = ?
    `;

    db.query(checkSql, [SID, CID], (err, rows) => {
        if (err) return callback(err);
        if (rows.length > 0) {
            return callback(new Error("ALREADY_ENROLLED"));
        }

        // 2️⃣ find section via course → faculty → section
        const sectionSql = `
            SELECT fs.section_id
            FROM faculty_courses fc
            JOIN faculty_sections fs ON fc.FID = fs.FID
            WHERE fc.CID = ?
            LIMIT 1
        `;

        db.query(sectionSql, [CID], (err2, secRows) => {
            if (err2) return callback(err2);
            if (!secRows.length) {
                return callback(new Error("NO_SECTION_ASSIGNED"));
            }

            const section_id = secRows[0].section_id;

            // 3️⃣ enroll
            const insertSql = `
                INSERT INTO enrollments (SID, CID, section_id)
                VALUES (?, ?, ?)
            `;

            db.query(insertSql, [SID, CID, section_id], callback);
        });
    });
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
    db.query(
        "SELECT SID FROM students WHERE UID = ?",
        [UID],
        callback
    );
};

// GET ACCOUNT SETTINGS
exports.getAccountSettings = (uid) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                s.SID, s.sname, s.gender, s.dob, s.phone, s.address,
                u.UID, u.uemail, u.role
            FROM students s
            JOIN users u ON s.UID = u.UID
            WHERE u.UID = ?
        `;

        db.query(sql, [uid], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
};

// UPDATE ACCOUNT SETTINGS
exports.updateAccountSettings = (data) => {
    return new Promise((resolve, reject) => {

        const updateStudent = `
            UPDATE students 
            SET sname = ?, phone = ?
            WHERE UID = ?
        `;

        const updateUser = `
            UPDATE users 
            SET uemail = ?
            WHERE UID = ?
        `;

        db.query(updateStudent, [
            data.sname,
            data.phone,
            data.uid
        ]);

        db.query(updateUser, [
            data.uemail,
            data.uid
        ], (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

// UPDATE PASSWORD
exports.updatePassword = (uid, newPassword) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET upassword = ? WHERE UID = ?`;

        db.query(sql, [newPassword, uid], (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

//student section
exports.getStudentSections = (UID, callback) => {
    const sql = `
        SELECT DISTINCT
            sec.section_name,
            f.fname AS faculty_name,
            c.cname AS course_name,
            c.code  AS course_code
        FROM students s
        JOIN enrollments e ON s.SID = e.SID
        JOIN sections sec ON e.section_id = sec.section_id
        JOIN courses c ON e.CID = c.CID
        JOIN faculty_courses fc ON c.CID = fc.CID
        JOIN faculty f ON fc.FID = f.FID
        WHERE s.UID = ?
    `;
    db.query(sql, [UID], callback);
};
