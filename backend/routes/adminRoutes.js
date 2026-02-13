const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const facultyController = require("../controllers/facultyController");
const auth = require("../middleware/authMiddleware");


router.get('/course-count', adminController.getCourseCount);
router.get('/faculty-count', adminController.getFacultyCount);
router.get('/student-count', adminController.getStudentCount);
router.get('/total-count', adminController.getTotalCount);
router.get('/enrolled-students', adminController.getTotalEnrolledStudents);

// 🔹 ADMIN COURSES
router.get("/admin/courses", auth, facultyController.getCourses);
router.get("/admin/courses", auth, facultyController.getMyCourses);
router.post("/admin/courses/add", auth, facultyController.addCourse);
router.put("/admin/courses/update/:cid", auth, facultyController.updateCourse);
router.delete("/admin/courses/delete/:cid", auth, facultyController.deleteCourse);

// 🔹 ADMIN FACULTY
router.get("/admin/faculty/details", adminController.getFacultyDetails);
router.post("/admin/faculty/add", adminController.addFaculty);
router.put("/admin/faculty/update/:fid", adminController.updateFaculty);
router.delete("/admin/faculty/delete/:id", adminController.deleteFaculty);

module.exports = router;