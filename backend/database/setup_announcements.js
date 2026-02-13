const db = require('../config/db');

const createAnnouncementsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS announcements (
            AID INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_by INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(UID) ON DELETE SET NULL
        )
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error creating announcements table:', err);
            return;
        }
        console.log('✅ Announcements table created/verified successfully');
    });
};

// Run the setup
createAnnouncementsTable();

module.exports = createAnnouncementsTable;
