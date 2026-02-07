const courseModel = require("../models/courseModel");
const facultyModel = require("../models/facultyModel");
const userModel = require("../models/userModel");

// Course Count

exports.getCourseCount = (req, res) => {
    courseModel.getCourseCount((err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.sqlMessage
            })
        }
        res.json({
            success: true,
            data: result[0].totalCourses
        })
    })
}

// Faculty Count

exports.getFacultyCount = (req, res) => {
    facultyModel.getFacultyCount((err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.sqlMessage
            })
        }
        res.json({
            success: true,
            data: result[0].totalFaculty
        })
    })
}

// Student Count 

exports.getStudentCount = (req, res) => {
    facultyModel.getStudentCount((err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.sqlMessage
            })
        }
        res.json({
            success: true,
            data: result[0].totalStudents
        })
    })
}

// Total Count

exports.getTotalCount = (req, res) => {
    userModel.getTotalUser((err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.sqlMessage
            })
        }
        res.json({
            success: true,
            data: result[0].totalUsers
        })
    })
}