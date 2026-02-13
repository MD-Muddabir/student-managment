const db = require("../config/db");

// Get course by ID
exports.getCourseById = (id, callback) => {
    const sql = "SELECT * FROM courses WHERE CID = ?";
    db.query(sql, [id], callback);
};

// Get course count
exports.getCourseCount = (callback) => {
    const sql = "SELECT COUNT(*) AS totalCourses FROM courses";
    db.query(sql, callback);
};

// CURD Courses

// Get all courses
exports.getAllCourses = (callback) => {
    const sql = "SELECT * FROM courses ORDER BY CID DESC";
    db.query(sql, callback);
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