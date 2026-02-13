
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

// Total User
exports.getTotalUser = (callback) => {
    const sql = `SELECT COUNT(*) AS totalUsers FROM users`;
    db.query(sql, callback);
}

// Total Enrolled Students
exports.getTotalEnrolledStudents = (callback) => {
    const sql = `SELECT COUNT(*) AS totalEnrolledStudents FROM enrollments`;
    db.query(sql, callback);
}

// Get Faculty Details
exports.getFacultyDetails = (callback) => {
    const sql = `
SELECT f.FID, f.fname, u.uemail, f.gender, f.dob, f.phone, f.address,
 f.department, f.qualification, COUNT(DISTINCT fc.CID) AS total_courses,
	GROUP_CONCAT(
        DISTINCT c.cname 
        ORDER BY c.cname 
        SEPARATOR ', '
    ) AS course_names

	FROM faculty f
    JOIN users u 
    ON f.UID = u.UID
    AND u.role = 'faculty'  

    LEFT JOIN faculty_courses fc 
		ON f.FID = fc.FID

	LEFT JOIN courses c
		ON fc.CID = c.CID

	GROUP BY 
		f.FID, f.fname, u.uemail, f.gender, f.dob, f.phone, f.address,
        f.department, f.qualification, f.experience_years 
    ORDER BY f.FID DESC;
    `;
    db.query(sql, callback);
};

// Add Faculty
exports.addFaculty = (data, callback) => {

    // 1️⃣ Insert into users table
    const insertUser = `
        INSERT INTO users (uemail, upassword, role, status)
        VALUES (?, ?, 'faculty', 'active')
    `;

    const defaultPassword = "321"; // or generate random


    db.query(insertUser, [data.uemail, defaultPassword], (err, userResult) => {
        if (err) return callback(err);

        const UID = userResult.insertId;

        // 2️⃣ Insert into faculty table
        const insertFaculty = `
            INSERT INTO faculty (UID, fname, gender, dob, phone, address, department, qualification,experience_years)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            insertFaculty,
            [UID, data.fname, data.gender, data.dob, data.phone, data.address, data.department, data.qualification, data.experience_years || null],
            (err2, facultyResult) => {
                if (err2) return callback(err2);

                callback(null, {
                    UID,
                    FID: facultyResult.insertId
                });
            }
        );
    });
};

// update faculty 
exports.updateFaculty = (data) => {
    return new Promise((resolve, reject) => {

        // 1️⃣ Get UID using FID
        const getUID = `
            SELECT UID FROM faculty WHERE FID = ?
        `;

        db.query(getUID, [data.fid], (err, result) => {
            if (err || result.length === 0) return reject(err);

            const uid = result[0].UID;

            const updateFaculty = `
            UPDATE faculty
            SET fname = ?, phone = ?, gender = ?, dob = ?, address = ?, department = ?, qualification = ?, course_names = ?
            where FID = ?;
            `;

            const updateUser = `
            UPDATE users
            SET uemail = ?
            where UID = ?;
            `;

            db.query(updateFaculty, [
                data.fname,
                data.phone,
                data.gender,
                data.dob,
                data.address,
                data.department,
                data.qualification,
                data.course_names,
                data.fid
            ], (err1) => {
                if (err1) return reject(err1);

                db.query(updateUser, [
                    data.uemail,
                    uid
                ], (err2) => {
                    if (err2) return reject(err2);

                    // 4️⃣ Update faculty_courses
                    // updateFacultyCourses(data.fid, data.courses)
                    //     .then(() => resolve(true))
                    //     .catch(reject);
                });
            });
        });
    });
};

// update faculty courses
// function updateFacultyCourses(FID, courses = []) {
//     return new Promise((resolve, reject) => {

//         // Remove old course mappings
//         const deleteOld = `DELETE FROM faculty_courses WHERE FID = ?`;

//         db.query(deleteOld, [FID], (err) => {
//             if (err) return reject(err);

//             if (!courses.length) return resolve(true);

//             // Insert new course mappings
//             const values = courses.map(cid => [FID, cid]);

//             const insertNew = `
//                 INSERT INTO faculty_courses (FID, CID)
//                 VALUES ?
//             `;

//             db.query(insertNew, [values], (err2) => {
//                 if (err2) return reject(err2);
//                 resolve(true);
//             });
//         });
//     });
// }


// Delete faculty + mappings + user
exports.deleteFaculty = (UID) => {
    return new Promise((resolve, reject) => {
        // Reassign courses created by faculty to Admin
        db.query(
            "UPDATE courses SET created_by = 1 WHERE created_by = ?",
            [UID],
            (err) => {
                if (err) return db.rollback(() => reject(err));
                // continue delete flow
            }
        );

        db.beginTransaction(err => {
            if (err) return reject(err);

            // 1️⃣ Get FID from UID
            db.query(
                "SELECT FID FROM faculty WHERE UID = ?",
                [UID],
                (err, result) => {
                    if (err || result.length === 0) {
                        return db.rollback(() =>
                            reject(new Error("Faculty not found"))
                        );
                    }

                    const FID = result[0].FID;

                    // 2️⃣ Reassign courses to Admin
                    db.query(
                        "UPDATE courses SET created_by = 1 WHERE created_by = ?",
                        [UID],
                        (err) => {
                            if (err) return db.rollback(() => reject(err));

                            // 3️⃣ Delete faculty_courses
                            db.query(
                                "DELETE FROM faculty_courses WHERE FID = ?",
                                [FID],
                                (err) => {
                                    if (err) return db.rollback(() => reject(err));

                                    // 4️⃣ Delete faculty_sections
                                    db.query(
                                        "DELETE FROM faculty_sections WHERE FID = ?",
                                        [FID],
                                        (err) => {
                                            if (err) return db.rollback(() => reject(err));

                                            // 5️⃣ Delete faculty
                                            db.query(
                                                "DELETE FROM faculty WHERE FID = ?",
                                                [FID],
                                                (err) => {
                                                    if (err) return db.rollback(() => reject(err));

                                                    // 6️⃣ Delete user
                                                    db.query(
                                                        "DELETE FROM users WHERE UID = ?",
                                                        [UID],
                                                        (err) => {
                                                            if (err) return db.rollback(() => reject(err));

                                                            db.commit(err => {
                                                                if (err) {
                                                                    return db.rollback(() => reject(err));
                                                                }
                                                                resolve(true);
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};
