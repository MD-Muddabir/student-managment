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

// Total Enrolled Students

exports.getTotalEnrolledStudents = (req, res) => {
    userModel.getTotalEnrolledStudents((err, result) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.sqlMessage
            })
        }
        res.json({
            success: true,
            data: result[0].totalEnrolledStudents
        })
    })
}

// Get Faculty Details

exports.getFacultyDetails = (req, res) => {
    userModel.getFacultyDetails((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch faculty details"
            });
        }

        const faculty = result.map(f => ({
            id: f.FID,
            name: f.fname,
            email: f.uemail,
            gender: f.gender,
            dob: f.dob,
            phone: f.phone,
            address: f.address,
            department: f.department,
            qualification: f.qualification,
            total_courses: f.total_courses,
            course_names: f.course_names
        }))

        res.json({
            success: true,
            data: faculty
        })
    })
};

// Add Faculty
exports.addFaculty = (req, res) => {
    const { fname, uemail, gender, dob, phone, address } = req.body;
    // Basic validation
    if (!fname || !uemail || !gender || !dob || !phone) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
        });
    }

    userModel.addFaculty(
        { fname, uemail, gender, dob, phone, address },
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
                message: "Faculty added successfully",
                FID: result.FID,
                UID: result.UID
            });
        });
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
    try {
        const fid = req.params.fid;

        await userModel.updateFaculty({
            fid,
            fname: req.body.fname,
            phone: req.body.phone,
            uemail: req.body.uemail,
            gender: req.body.gender,
            dob: req.body.dob,
            address: req.body.address,
            department: req.body.department,
            qualification: req.body.qualification,
            course_names: req.body.course_names
        });
        res.json({
            success: true,
            message: "Faculty details updated successfully"
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Failed to update faculty details"
        });
    }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
    try {
        const uid = req.params.id; // UID, not FID

        await userModel.deleteFaculty(uid);

        res.json({
            success: true,
            message: "Faculty deleted successfully"
        });
    } catch (err) {
        console.error(err.message);
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};
