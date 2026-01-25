
// 👉 API endpoints

const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController");

// Student CRUD
router.get("/students", studentController.getAllStudents);
router.get("/students/:id", studentController.getStudentById);
router.post("/students", studentController.createStudent);
router.put("/students/:id", studentController.updateStudent);
router.delete("/students/:id", studentController.deleteStudent);

// Dashboards
// router.get("/count", studentController.fetchStudentCount);

module.exports = router;
