const db = require('../config/db');

const announcementModel = {
    // Create new announcement
    create: (title, content, createdBy, callback) => {
        const query = `
            INSERT INTO announcements (title, content, created_by, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        db.query(query, [title, content, createdBy], callback);
    },

    // Get all announcements
    getAll: (callback) => {
        const query = `
            SELECT a.*, u.uemail as creator_email, u.role as creator_role
            FROM announcements a
            LEFT JOIN users u ON a.created_by = u.UID
            ORDER BY a.created_at DESC
        `;
        db.query(query, callback);
    },

    // Get announcement by ID
    getById: (id, callback) => {
        const query = `
            SELECT a.*, u.uemail as creator_email, u.role as creator_role
            FROM announcements a
            LEFT JOIN users u ON a.created_by = u.UID
            WHERE a.AID = ?
        `;
        db.query(query, [id], callback);
    },

    // Delete announcement
    delete: (id, callback) => {
        const query = 'DELETE FROM announcements WHERE AID = ?';
        db.query(query, [id], callback);
    },

    // Get count of announcements
    getCount: (callback) => {
        const query = 'SELECT COUNT(*) as total FROM announcements';
        db.query(query, callback);
    }
};

module.exports = announcementModel;
