const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get('/course-count', adminController.getCourseCount);
router.get('/faculty-count', adminController.getFacultyCount);
router.get('/student-count', adminController.getStudentCount);
router.get('/total-count', adminController.getTotalCount);

module.exports = router;