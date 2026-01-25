
const studentModel = require("../models/studentModel");

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

// Fetch student count
// exports.fetchStudentCount = (req, res) => {
//     studentModel.countStudent((err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: err.sqlMessage
//             });
//         }

//         res.json({
//             success: true,
//             count: result[0].count
//         });
//     });
// };
