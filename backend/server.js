
// 👉 App entry point

// 🧠 server.js rule
// ✔ Setup app
// ✔ Load routes
// ❌ No business logic


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRouters");

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

// Routes
server.use("/", authRoutes);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// const express = require("express");
// const studentRouter = require("./routes/studentRoutes");
// const port = 3000;
// const cors = require("cors");
const db = require("./config/db");
// const server = express();


// server.use("/", studentRouter);

// server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });


// server.use(cors());
// server.use(express.json());


// // ***********************************  SIGNUP API **************************************************
// server.post("/signup", (req, res) => {
//     const { name, email, password, gender, dob, phone, subject } = req.body;

//     const sql = `
//     INSERT INTO users (uname, uemail, upassword, gender) VALUES (?, ?, ?, ?) `;

//     db.query(sql, [name, email, password, gender], (err, result) => {
//         if (err) {
//             console.error("User insert error:", err); // 🔥 ADD THIS
//             if (err.code === "ER_DUP_ENTRY") {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Email already exists"
//                 });
//             }
//             return res.status(500).json({
//                 success: false,
//                 message: err.sqlMessage // 🔥 SHOW REAL MYSQL ERROR
//             });
//         }

//         const uId = result.insertId;

//         const studentSql = `
//         INSERT INTO students (sname, semail, gender, dob, sphone, CID)
//         VALUES (?, ?, ?, ?, ?, ?) `;

//         db.query(studentSql, [name, email, gender, dob, phone, subject], (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "Student insert failed"
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: "Signup successful",
//                 id: uId
//             });
//         });
//     });
// });


// // ***********************************  SIGNIN API **************************************************

// server.post("/login", (req, res) => {
//     const { email, password } = req.body;

//     const sql = `
//     SELECT UID, uname, uemail, upassword
//     FROM users
//     WHERE uemail = ? `;

//     db.query(sql, [email], (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: err.sqlMessage
//             });
//         }

//         if (results.length === 0) {
//             return res.json({
//                 success: false,
//                 message: "Invalid email or password"

//             });
//         }

//         const user = results[0];

//         // ❗ Plain text check (for now)
//         if (user.upassword !== password) {
//             return res.json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }
//         res.json({
//             success: true,
//             message: "Login successful",
//             user: {
//                 id: user.UID,
//                 name: user.uname,
//                 email: user.uemail,
//                 role: user.role
//             }
//         });
//     });
// });


// ***********************************  GET API **************************************************

server.get("/students", (req, res) => {

    const sql = `
              SELECT
            s.SID,
            s.sname,
            s.semail,
            s.gender,
            s.dob,
            s.sphone,
            c.Cname,
            s.created_at
        FROM students s
        JOIN courses c ON s.CID = c.CID
        ORDER BY s.SID
`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});
















// ***********************************  GET ALL STUDENT **************************************************

server.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    })
})


// ***********************************  GET ALL STUDENt by ID **************************************************

server.get("/students/:id", (req, res) => {
    const sql = "SELECT * FROM students where SID = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});


// ***********************************  INSERT STUDENt (POST) **************************************************

server.post("/students", (req, res) => {
    const { NAME, EMAIL, AGE, GENDER, PHONE } = req.body;

    const sql = `
    INSERT INTO students (NAME,EMAIL,AGE, GENDER, PHONE)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [NAME, EMAIL, AGE, GENDER, PHONE], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Student added", id: result.insertId });
    });
});


// ***********************************  UPDATE STUDENt (PUT) **************************************************

server.put("/students/:id", (req, res) => {
    // const { NAME, EMAIL, AGE, GENDER, PHONE } = req.body;


    console.log("Request Body:", req.body); // 👈 DEBUG
    console.log("Student ID:", req.params.id);

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const { NAME, EMAIL, AGE, GENDER, PHONE } = req.body;

    if (!NAME || !EMAIL || !AGE) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    const sql = `
    UPDATE students
    SET NAME = ?, EMAIL = ?, AGE = ?, GENDER = ?, PHONE = ?
    WHERE SID = ?
    `;

    db.query(sql, [NAME, EMAIL, AGE, GENDER, PHONE, req.params.id], (err, result) => {
        if (err) {
            console.error("SQL ERROR:", err);
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student updated successfully" });
    });
});


// ***********************************  DELETE STUDENt  **************************************************

server.delete("/students/:id", (req, res) => {

    const sql = `
    DELETE FROM students WHERE SID = ? `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Student deleted" });
    });
});


// ***********************************  SERVER START  **************************************************

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


