
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

// Add faculty details
exports.addFacultyDetails = (data, callback) => {
    const sql = `
        INSERT INTO faculty
        (UID, fname, gender, dob, phone, address, department, qualification, experience_years)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
    db.query(sql, data, callback);
};

// Delete student 
exports.deleteStudent = (id, callback) => {
    const sql = `
    DELETE FROM students WHERE SID = ?;
    `;
    db.query(sql, [id], callback);
};

// Add Students 
exports.addStudent = (data, callback) => {

    // 1️⃣ Insert into users table
    const insertUser = `
        INSERT INTO users (uemail, upassword, role, status)
        VALUES (?, ?, 'student', 'active')
    `;

    const defaultPassword = "123456"; // or generate random


    db.query(insertUser, [data.uemail, defaultPassword], (err, userResult) => {
        if (err) return callback(err);

        const UID = userResult.insertId;

        // 2️⃣ Insert into students table
        const insertStudent = `
            INSERT INTO students (UID, sname, gender, dob, phone, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            insertStudent,
            [UID, data.sname, data.gender, data.dob, data.phone, data.address || null],
            (err2, studentResult) => {
                if (err2) return callback(err2);

                callback(null, {
                    UID,
                    SID: studentResult.insertId
                });
            }
        );
    });
};

// update students 
exports.updateStudent = (data) => {
    return new Promise((resolve, reject) => {

        // 1️⃣ Get UID using SID
        const getUID = `
            SELECT UID FROM students WHERE SID = ?
        `;

        db.query(getUID, [data.sid], (err, result) => {
            if (err || result.length === 0) return reject(err);

            const uid = result[0].UID;

            const updateStudent = `
            UPDATE students
            SET sname = ?, phone = ?, gender = ?, dob = ?
            where SID = ?;
            `;

            const updateUser = `
            UPDATE users
            SET uemail = ?
            where UID = ?;
            `;

            db.query(updateStudent, [
                data.sname,
                data.phone,
                data.gender,
                data.dob,
                data.sid
            ]);

            db.query(updateUser, [
                data.uemail,
                uid
            ], (err2) => {
                if (err2) reject(err2);
                else resolve(true);
            });
        });
    });
};

// Sections
// exports.getMySections = (FID, callback) => {
//     // const FID = req.user.FID; // from JWT

//     const sql = `
//         SELECT s.section_id, s.section_name
//         FROM faculty_sections fs
//         JOIN sections s ON fs.section_id = s.section_id
//         WHERE fs.FID = ?
//     `;

//     db.query(sql, [FID], (err, results) => {
//         if (err) return callback(err);
//         callback(null, results);
//     });
// };

// students in section
exports.getSectionsByUID = (UID, cb) => {
    const sql = `
        SELECT 
            s.section_id,
            s.section_name,
            COUNT(DISTINCT e.SID) AS student_count
        FROM faculty f
        JOIN faculty_sections fs ON f.FID = fs.FID
        JOIN sections s ON fs.section_id = s.section_id
        LEFT JOIN enrollments e ON e.section_id = s.section_id
        WHERE f.UID = ?
        GROUP BY s.section_id, s.section_name
    `;
    db.query(sql, [UID], cb);
};

// exports.getSectionsByUID = (UID, cb) => {
//     const sql = `
//         SELECT s.section_id, s.section_name,
//                COUNT(st.SID) AS student_count
//         FROM faculty f
//         JOIN faculty_sections fs ON f.FID = fs.FID
//         JOIN sections s ON fs.section_id = s.section_id
//         LEFT JOIN students st ON st.section_id = s.section_id
//         WHERE f.UID = ?
//         GROUP BY s.section_id
//     `;
//     db.query(sql, [UID], cb);
// };


/* ADD SECTION */
exports.addSection = (UID, sectionName, cb) => {
    db.query(
        "SELECT FID FROM faculty WHERE UID = ?",
        [UID],
        (err, rows) => {
            if (err || !rows.length) return cb(err);

            const FID = rows[0].FID;

            db.query(
                "INSERT INTO sections (section_name, created_by) VALUES (?, ?)",
                [sectionName, UID],
                (err, result) => {
                    if (err) return cb(err);

                    db.query(
                        "INSERT INTO faculty_sections (FID, section_id) VALUES (?, ?)",
                        [FID, result.insertId],
                        err2 => {
                            if (err2) return cb(err2);
                            cb(null, {
                                section_id: result.insertId,
                                section_name: sectionName,
                                student_count: 0
                            });
                        }
                    );
                }
            );
        }
    );
};


/* SECTION DETAILS */
exports.getSectionDetails = (sectionId, cb) => {
    const sql = `
        SELECT DISTINCT
            st.sname,
            st.gender,
            st.phone
        FROM enrollments e
        JOIN students st ON e.SID = st.SID
        WHERE e.section_id = ?
    `;
    db.query(sql, [sectionId], cb);
};

// GET FACULTY COURSES
exports.getCoursesByUID = (UID, cb) => {
    const sql = `
        SELECT c.CID, c.cname, c.code, c.duration
        FROM faculty f
        JOIN faculty_courses fc ON f.FID = fc.FID
        JOIN courses c ON fc.CID = c.CID
        WHERE f.UID = ?
    `;
    db.query(sql, [UID], cb);
};

// ================= GET ALL COURSES =================
exports.getAllCourses = (cb) => {
    const sql = `SELECT * FROM courses ORDER BY CID DESC`;
    db.query(sql, cb);
};

// ADD COURSE + LINK TO FACULTY
exports.addCourse = (UID, course, cb) => {

    // 1️⃣ GET FID FROM UID
    db.query(`SELECT FID FROM faculty WHERE UID = ?`, [UID], (err, rows) => {
        if (err) return cb(err);
        if (rows.length === 0) return cb(new Error("Faculty not found"));

        const FID = rows[0].FID;

        // 2️⃣ INSERT COURSE
        const courseSql = `
            INSERT INTO courses (cname, code, duration, price, description, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(courseSql, [
            course.cname,
            course.code,
            course.duration,
            course.price,
            course.description,
            UID
        ], (err2, result) => {
            if (err2) return cb(err2);

            // 3️⃣ LINK FACULTY → COURSE
            db.query(
                `INSERT INTO faculty_courses (FID, CID) VALUES (?, ?)`,
                [FID, result.insertId],
                cb
            );
        });
    });
};

// Update Course
exports.updateCourse = (data, cb) => {
    const sql = `
        UPDATE courses c
        JOIN faculty_courses fc ON c.CID = fc.CID
        JOIN faculty f ON fc.FID = f.FID
        SET c.cname = ?, c.code = ?, c.duration = ?, c.price = ?, c.description = ?
        WHERE c.CID = ? AND f.UID = ?
    `;

    db.query(
        sql,
        [
            data.cname,
            data.code,
            data.duration,
            data.price,
            data.description,
            data.CID,
            data.UID
        ],
        (err, result) => {
            if (err) return cb(err);
            cb(null, result.affectedRows);
        }
    );
};

// Delete Course
// exports.deleteCourse = (data, cb) => {
//     const sql = `
//         DELETE fc
//         FROM faculty_courses fc
//         JOIN faculty f ON fc.FID = f.FID
//         WHERE fc.CID = ? AND f.UID = ?
//     `;

//     db.query(sql, [data.CID, data.UID], (err, result) => {
//         if (err) return cb(err);
//         cb(null, result.affectedRows);
//     });
// };

exports.deleteCourse = (data, cb) => {

    // 1️⃣ Get FID from UID
    const getFID = `
        SELECT FID FROM faculty WHERE UID = ?
    `;

    db.query(getFID, [data.UID], (err, rows) => {
        if (err || rows.length === 0) return cb(err);

        const FID = rows[0].FID;

        // 2️⃣ Verify ownership
        const checkOwnership = `
            SELECT * FROM faculty_courses
            WHERE FID = ? AND CID = ?
        `;

        db.query(checkOwnership, [FID, data.CID], (err2, rows2) => {
            if (err2 || rows2.length === 0) {
                return cb(null, 0); // Not allowed
            }

            // 3️⃣ Delete mapping
            db.query(
                "DELETE FROM faculty_courses WHERE CID = ?",
                [data.CID],
                err3 => {
                    if (err3) return cb(err3);

                    // 4️⃣ Delete course itself
                    db.query(
                        "DELETE FROM courses WHERE CID = ?",
                        [data.CID],
                        (err4, result) => {
                            if (err4) return cb(err4);
                            cb(null, result.affectedRows);
                        }
                    );
                }
            );
        });
    });
};

// Find Faculty By UID
exports.findFacultyByUID = (UID, cb) => {
    const sql = `SELECT * FROM faculty WHERE UID = ?`;
    db.query(sql, [UID], cb);
};

// Get Account Settings
exports.getAccountSettings = (UID, cb) => {
    const sql = `
        SELECT
            f.FID,
            f.fname,
            f.gender,
            f.dob,
            f.phone,
            f.address,
            f.department,
            f.qualification,
            u.uemail
        FROM faculty f
        JOIN users u ON f.UID = u.UID
        WHERE f.UID = ?
    `;
    db.query(sql, [UID], cb);
};

// Update Account Settings
exports.updateAccountSettings = (data) => {
    return new Promise((resolve, reject) => {

        const updateFaculty = `
            UPDATE faculty 
            SET fname = ?, phone = ?
            WHERE UID = ?
        `;

        const updateUser = `
            UPDATE users 
            SET uemail = ?
            WHERE UID = ?
        `;

        db.query(updateFaculty, [
            data.fname,
            data.phone,
            data.uid
        ]);

        db.query(updateUser, [
            data.uemail,
            data.uid
        ],
            (err) => {
                if (err) reject(err);
                else resolve(true);
            });
    });
};
