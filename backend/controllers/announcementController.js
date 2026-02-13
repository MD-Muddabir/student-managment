const announcementModel = require('../models/announcementModel');

const announcementController = {
    // Create new announcement (Faculty only)
    createAnnouncement: (req, res) => {
        const { title, content } = req.body;
        const userId = req.user.UID; // From JWT middleware (UID property)

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        announcementModel.create(title, content, userId, (err, result) => {
            if (err) {
                console.error('Error creating announcement:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create announcement'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Announcement created successfully',
                announcementId: result.insertId
            });
        });
    },

    // Get all announcements
    getAllAnnouncements: (req, res) => {
        announcementModel.getAll((err, results) => {
            if (err) {
                console.error('Error fetching announcements:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch announcements'
                });
            }

            res.json({
                success: true,
                announcements: results,
                count: results.length
            });
        });
    },

    // Delete announcement (Faculty only)
    deleteAnnouncement: (req, res) => {
        const { id } = req.params;

        announcementModel.delete(id, (err, result) => {
            if (err) {
                console.error('Error deleting announcement:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete announcement'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Announcement not found'
                });
            }

            res.json({
                success: true,
                message: 'Announcement deleted successfully'
            });
        });
    },

    // Get announcement count
    getAnnouncementCount: (req, res) => {
        announcementModel.getCount((err, results) => {
            if (err) {
                console.error('Error getting announcement count:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to get announcement count'
                });
            }

            res.json({
                success: true,
                total: results[0].total
            });
        });
    }
};

module.exports = announcementController;
