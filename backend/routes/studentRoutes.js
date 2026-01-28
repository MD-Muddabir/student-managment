
// 👉 API endpoints

const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController");


const auth = require("../middleware/authMiddleware");
// Student CRUD
router.get("/student/name", auth, studentController.getStudentName);
router.post("/student/add", auth, studentController.addStudentDetails);
router.get("/students", auth, studentController.getAllStudents);
router.get("/students/:id", auth, studentController.getStudentById);
router.post("/students", auth, studentController.createStudent);
router.put("/students/:id", studentController.updateStudent);
router.delete("/students/:id", studentController.deleteStudent);
router.post("/students/:id/enroll", studentController.enrollStudent); // Enroll
router.get("/courses", studentController.getAllCourses); // Get all courses
router.post("/students-details", studentController.studentDetails);
// router.get("/students/:sid/courses", studentController.getMyCourses);
router.get("/students/:id/courses", studentController.getMyCourses);



// Dashboards
router.get("/students/:id/courses", studentController.getEnrolledCourses);

module.exports = router;
