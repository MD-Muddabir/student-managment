
// 👉 API endpoints

const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController");


const auth = require("../middleware/authMiddleware");
router.get("/courses", studentController.getAllCourses); // Get all courses
router.get("/student/me", auth, studentController.getCurrentStudent); // Check if student exists
router.post("/student/add", auth, studentController.addStudentDetails);

router.get("/settings", auth, studentController.getAccountSettings);
router.put("/settings/update", auth, studentController.updateAccountSettings);
router.put("/settings/password", auth, studentController.updatePassword);

router.post("/student/enroll", auth, studentController.enrollStudent);
router.get("/student/sections", auth, studentController.getStudentSections);

// router.get("/student/SID/courses", studentController.getEnrolledCourses); // Get student enrolled Courses

// Student CRUD
// router.get("/student/name", auth, studentController.getStudentName);
// router.get("/students", auth, studentController.getAllStudents);
// router.get("/students/:id", auth, studentController.getStudentById);
// router.post("/students", auth, studentController.createStudent);
// router.put("/students/:id", studentController.updateStudent);
// router.delete("/students/:id", studentController.deleteStudent);
// router.post("/students/:id/enroll", studentController.enrollStudent); // Enroll
// router.post("/students-details", studentController.studentDetails);

// router.get("/students/:sid/courses", studentController.getMyCourses);
// router.get("/students/:id/courses", studentController.getMyCourses);



// Dashboards
// router.get("/students/:id/courses", studentController.getEnrolledCourses);

module.exports = router;
