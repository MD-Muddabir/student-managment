const courseModel = require("../models/courseModel");
const facultyModel = require("../models/facultyModel");


exports.getCourseCount = (req, res) => {
    courseModel.getCourseCount((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch course count"
            });
        }
        res.json({
            success: true,
            total: result[0].totalCourses
        });
    });
};


// GET ALL COURSES
exports.getCourses = (req, res) => {
    facultyModel.getAllCourses((err, rows) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, data: rows });
    });
};

// GET FACULTY COURSES
exports.getMyCourses = (req, res) => {
    const UID = req.user.UID;

    facultyModel.getCoursesByUID(UID, (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
};

// ADD COURSE
exports.addCourse = (req, res) => {
    const UID = req.user.UID;
    const { cname, code, duration, price, description } = req.body;

    if (!cname || !code || !duration || !price) {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    facultyModel.addCourse(UID, {
        cname, code, duration, price, description
    }, (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.json({ success: false, message: "Course code already exists" });
            }
            return res.status(500).json({
                success: false,
                message: "Failed to add course"
            });
        }
        res.json({
            success: true,
            message: "Course added successfully"
        });
    });
};

// Update Course
exports.updateCourse = (req, res) => {
    const UID = req.user.UID;
    const CID = req.params.cid;
    const { cname, code, duration, price, description } = req.body;

    facultyModel.updateCourse(
        { UID, CID, cname, code, duration, price, description },
        (err, affectedRows) => {
            if (err) {
                console.error(err);
                return res.json({
                    success: false,
                    message: "Update failed"
                });
            }

            if (affectedRows === 0) {
                return res.json({
                    success: false,
                    message: "Unauthorized or course not found"
                });
            }

            res.json({
                success: true,
                message: "Course updated successfully"
            });
        }
    );
};

// Delete Course
// exports.deleteCourse = (req, res) => {
//     const UID = req.user.UID;
//     const CID = req.params.cid;

//     facultyModel.deleteCourse({ UID, CID }, (err, affectedRows) => {
//         if (err) {
//             console.error(err);
//             return res.json({
//                 success: false,
//                 message: "Delete failed"
//             });
//         }

//         if (affectedRows === 0) {
//             return res.json({
//                 success: false,
//                 message: "Unauthorized or course not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Course deleted successfully"
//         });
//     });
// };
exports.deleteCourse = (req, res) => {
    const UID = req.user.UID;
    const CID = req.params.cid;

    facultyModel.deleteCourse({ UID, CID }, (err, affectedRows) => {
        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: "Unauthorized or course not found"
            });
        }

        res.json({
            success: true,
            message: "Course deleted successfully"
        });
    });
};

exports.getFacultyCount = (req, res) => {
    facultyModel.getFacultyCount((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch faculty count"
            });
        }

        res.json({
            success: true,
            total: result[0].totalFaculty
        });
    });
};


exports.getStudentCount = (req, res) => {
    facultyModel.getStudentCount((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch student count"
            });
        }

        res.json({
            success: true,
            total: result[0].totalStudents
        });
    });
};

exports.getStudentDetails = (req, res) => {
    facultyModel.getStudentDetails((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch student details"
            });
        }

        const student = result.map(student => ({
            id: student.SID,
            name: student.sname,
            email: student.uemail,
            gender: student.gender,
            dob: student.dob,
            phone: student.phone,
            address: student.address,
            profile_completed: student.profile_completed,
            total_courses: student.total_courses
        }))

        res.json({
            success: true,
            students: student
        })
    })
};

// Add faculty details
exports.addFacultyDetails = (req, res) => {

    const UID = req.user.UID;

    if (!UID) {
        return res.status(401).json({ message: "Unauthorized !" });
    }

    const { fname, gender, dob, phone, address, department, qualification, experience_years } = req.body;

    facultyModel.addFacultyDetails([UID, fname, gender, dob, phone, address, department, qualification, experience_years],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
            res.json({
                success: true,
                message: "Faculty details added successfully",
                FID: results.insertId   // 🎯 AUTO-GENERATED
            });

        });
};

// Get Faculty Status
exports.getFacultyStatus = (req, res) => {
    facultyModel.findFacultyByUID(req.user.UID, (err, rows) => {
        if (err) return res.status(500).json({ success: false });

        if (!rows.length) {
            return res.json({
                success: true,
                exists: false
            });
        }

        res.json({
            success: true,
            exists: true,
            data: rows[0]
        });
    });
};

// Get Account Settings
exports.getAccountSettings = (req, res) => {
    facultyModel.getAccountSettings(req.user.UID, (err, rows) => {
        if (err) return res.status(500).json({ success: false });

        if (!rows.length) {
            return res.json({ success: true, data: null });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    });
};

// Update Account Settings
exports.updateAccountSettings = async (req, res) => {

    try {
        const uid = req.user.UID;
        await facultyModel.updateAccountSettings({
            uid,
            fname: req.body.fname,
            phone: req.body.phone,
            // address: req.body.address,
            uemail: req.body.uemail
        });

        res.json({
            success: true,
            message: "Account settings updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to update account settings"
        });
    }
};


// Add Student
exports.addStudent = (req, res) => {
    const { sname, uemail, gender, dob, phone, address } = req.body;
    // Basic validation
    if (!sname || !uemail || !gender || !dob || !phone) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
        });
    }

    facultyModel.addStudent(
        { sname, uemail, gender, dob, phone, address },
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Failed to add student"
                });
            }

            res.json({
                success: true,
                message: "Student added successfully",
                SID: result.SID,
                UID: result.UID
            });
        });
};

// Update Student
exports.updateStudent = async (req, res) => {
    try {
        const sid = req.params.sid;

        await facultyModel.updateStudent({
            sid,
            sname: req.body.sname,
            phone: req.body.phone,
            uemail: req.body.uemail,
            gender: req.body.gender,
            dob: req.body.dob
        });
        res.json({
            success: true,
            message: "Student details updated successfully"
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Failed to update student details"
        });
    }
};

// Delete Student
exports.deleteStudent = (req, res) => {
    const { id } = req.params;

    facultyModel.deleteStudent(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete student"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        res.json({
            success: true,
            message: "Student deleted successfully"
        });
    });
};

// Section 

// exports.getMySections = (req, res) => {
//     const FID = req.user.FID; // coming from JWT

//     facultyModel.getMySections(FID, (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: err.sqlMessage
//             });
//         }

//         res.json({
//             success: true,
//             data: results
//         });
//     });
// };

// GET MY SECTIONS
exports.getMySections = (req, res) => {
    facultyModel.getSectionsByUID(req.user.UID, (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
};


// ADD NEW SECTION
exports.addSection = (req, res) => {
    facultyModel.addSection(
        req.user.UID,
        req.body.section_name,
        (err, section) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, section });
        }
    );
};

// VIEW SECTION DETAILS

exports.getSectionDetails = (req, res) => {
    facultyModel.getSectionDetails(req.params.id, (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
};

