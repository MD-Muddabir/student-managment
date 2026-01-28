const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

router.get("/courses/count", facultyController.getCourseCount);
router.get("/faculty/count", facultyController.getFacultyCount);
router.get("/student/count", facultyController.getStudentCount);
router.get("/student/details", facultyController.getStudentDetails);

module.exports = router;
