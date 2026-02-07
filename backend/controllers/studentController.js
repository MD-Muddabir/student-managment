const courseModel = require("../models/courseModel");
const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");
const enrollmentModel = require("../setup_enrollments");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");


// Get studnet name
exports.getStudentName = (req, res) => {
    const id = req.params.id;
    studentModel.getStudentName(id, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
        res.json({ success: true, data: results });
    });
};

// Get current student details by Token UID
exports.getCurrentStudent = (req, res) => {
    const UID = req.user.UID;
    studentModel.findStudentByUID(UID, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        if (results.length > 0) {
            // Student exists, get full details
            studentModel.getStudentById(results[0].SID, (err2, studentData) => {
                if (err2) return res.status(500).json({ success: false, message: err2.sqlMessage });
                res.json({ success: true, exists: true, data: studentData[0] });
            });
        } else {
            res.json({ success: true, exists: false });
        }
    });
};

// post add student details
exports.addStudentDetails = (req, res) => {

    const UID = req.user.UID; // 🎯 FROM TOKEN
    console.log("UID from token:", UID);

    if (!UID) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // const data = results[0];

    // // ✅ CREATE TOKEN
    // const token = jwt.sign(
    //     { SID: data.SID },
    //     JWT_SECRET,
    //     { expiresIn: "2h" }
    // );
    const { sname, gender, dob, sphone, address } = req.body;

    studentModel.addStudentDetails([UID, sname, gender, dob, sphone, address, 1],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
            res.json({
                success: true,
                message: "Student details added successfully",
                SID: results.insertId   // 🎯 AUTO-GENERATED
            });
        });
};

// Get all courses
exports.getAllCourses = (req, res) => {
    courseModel.getAllCourses((err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
        res.json({ success: true, data: results });
    });
};

// Get student enrolled Courses
exports.getEnrolledCourses = (req, res) => {

    const SID = req.data.SID; // 🎯 FROM TOKEN

    if (!SID) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    studentModel.getEnrolledCourses(SID, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
        res.json({
            success: true,
            data: results
        });
    });
};

// Enroll student
exports.enrollStudent = (req, res) => {
    const studentId = req.params.id;
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID required" });
    }

    studentModel.enrollStudent(studentId, courseId, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "This course is already enrolled." });
            }
            return res.status(500).json({ success: false, message: err.sqlMessage });
        }
        res.json({ success: true, message: "Enrolled successfully" });
    });
};

// Get all students
exports.getAllStudents = (req, res) => {
    studentModel.getAllStudents((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage || "Database error"
            });
        }
        res.json({
            success: true,
            data: results
        });
    });
};

// Get single student
exports.getStudentById = (req, res) => {
    const id = req.params.id;
    studentModel.getStudentById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.sqlMessage });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        res.json({
            success: true,
            data: results[0]
        });
    });
};

// Create student
exports.createStudent = (req, res) => {
    // Expect: { sname, semail, gender, dob, sphone, cid }
    const { sname, semail, gender, dob, sphone, cid } = req.body;

    if (!sname || !semail) {
        return res.status(400).json({ success: false, message: "Name and Email are required" });
    }

    // Default cid to null if not provided
    const courseId = cid || null;

    studentModel.createStudent([sname, semail, gender, dob, sphone, courseId], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
            return res.status(500).json({ success: false, message: err.sqlMessage });
        }
        res.json({
            success: true,
            message: "Student created successfully",
            id: result.insertId
        });
    });
};

// Update student
exports.updateStudent = (req, res) => {
    const id = req.params.id;
    const { sname, semail, gender, dob, sphone, cid } = req.body;

    studentModel.updateStudent(id, [sname, semail, gender, dob, sphone, cid], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, message: "Student updated successfully" });
    });
};

// Delete student
exports.deleteStudent = (req, res) => {
    const id = req.params.id;
    studentModel.deleteStudent(id, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, message: "Student deleted successfully" });
    });
};

// Get enrolled courses
exports.getEnrolledCourses = (req, res) => {
    const studentId = req.params.id;
    studentModel.getEnrolledCourses(studentId, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.sqlMessage || "Database error" });
        }
        res.json({
            success: true,
            data: results // Returns array of courses
        });
    });
};

// ================= Student Details =================

exports.studentDetails = (req, res) => {
    const { gender, dob, phone, cid } = req.body;
    const UID = req.user?.UID || req.body.UID; // from auth middleware or frontend

    if (!UID || !cid) {
        return res.status(400).json({
            success: false,
            message: "UID and Course ID are required"
        });
    }

    studentModel.findStudentByUID(UID, (err, existing) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.sqlMessage });
        }

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Student profile already exists"
            });
        }

        studentModel.createStudentDetails(
            [UID, gender, dob, phone],
            (err2, result) => {
                if (err2) {
                    console.error("Student insert error:", err2);
                    return res.status(500).json({
                        success: false,
                        message: err2.sqlMessage
                    });
                }

                const SID = result.insertId;

                enrollmentModel.enrollStudent(SID, cid, (err3) => {
                    if (err3) {
                        return res.status(500).json({
                            success: false,
                            message: "Course enrollment failed"
                        });
                    }

                    // ✅ SEND SUCCESS ONLY ONCE
                    return res.json({
                        success: true,
                        message: "Student details saved successfully",
                        studentId: SID
                    });
                });
            }
        );
    });
}


// ================= Student Courses =================


exports.getMyCourses = (req, res) => {
    const SID = req.params.sid;

    enrollmentModel.getStudentCourses(SID, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        res.json({
            success: true,
            courses: results
        });
    });
};


// ================= Student Details =================

exports.getStudentDetails = (req, res) => {
    const id = req.params.id;

    userModel.findUserById(id, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        res.json({
            success: true,
            user: {
                id: user.UID,
                name: user.uname,
                email: user.uemail,
                role: user.role,
                phone: user.sphone || 'N/A'
            }
        });
    });
};
