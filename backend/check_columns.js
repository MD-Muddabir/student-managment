const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger",
    database: "student_management_db"
});

db.connect(err => {
    if (err) {
        console.error('Connect error:', err);
        return;
    }
    console.log('Connected!');

    db.query("SHOW COLUMNS FROM students", (err, results) => {
        if (err) console.error(err);
        else {
            console.log("Columns:", results.map(r => r.Field));
            db.end();
        }
    });
});
