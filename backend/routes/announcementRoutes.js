const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const verifyToken = require('../middleware/authMiddleware');

// Get all announcements (accessible to all authenticated users)
router.get('/all', verifyToken, announcementController.getAllAnnouncements);

// Create announcement (Faculty/Admin only)
router.post('/create', verifyToken, announcementController.createAnnouncement);

// Delete announcement (Faculty/Admin only)
router.delete('/delete/:id', verifyToken, announcementController.deleteAnnouncement);

// Get announcement count
router.get('/count', verifyToken, announcementController.getAnnouncementCount);

module.exports = router;
