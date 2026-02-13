const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const auth = require("../middleware/authMiddleware");

router.get("/courses/count", facultyController.getCourseCount);
router.get("/faculty/count", facultyController.getFacultyCount);
router.get("/student/count", facultyController.getStudentCount);
router.get("/student/details", facultyController.getStudentDetails);
router.post("/faculty/details", auth, facultyController.addFacultyDetails);

// 🔹 FACULTY COURSES
router.get("/faculty/courses", auth, facultyController.getCourses);
router.get("/faculty/courses", auth, facultyController.getMyCourses);
router.post("/faculty/courses/add", auth, facultyController.addCourse);
router.put("/faculty/courses/update/:cid", auth, facultyController.updateCourse);
router.delete("/faculty/courses/delete/:cid", auth, facultyController.deleteCourse);

// Student CRUD
router.delete("/student/delete/:id", auth, facultyController.deleteStudent);
router.put("/faculty/student/update/:sid", auth, facultyController.updateStudent);
router.post("/faculty/student/add", auth, facultyController.addStudent);

// 🔐 Protected route
router.get("/faculty/sections", auth, facultyController.getMySections);
router.post("/faculty/sections/add", auth, facultyController.addSection);
router.get("/faculty/sections/:id", auth, facultyController.getSectionDetails);

// 🔐 Account Settings
router.get("/faculty/status", auth, facultyController.getFacultyStatus);
router.put("/faculty/settings/update", auth, facultyController.updateAccountSettings);
router.get("/faculty/settings", auth, facultyController.getAccountSettings);

module.exports = router;
