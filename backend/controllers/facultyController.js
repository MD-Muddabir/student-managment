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