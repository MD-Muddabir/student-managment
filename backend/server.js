
// 👉 App entry point

// 🧠 server.js rule
// ✔ Setup app
// ✔ Load routes
// ❌ No business logic


const express = require("express");
const cors = require("cors");
// const session = require("express-session");

;
const authRoutes = require("./routes/authRouters");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const server = express();
const port = 3000;



server.use(cors());
// server.use(cors({
//     origin: "http://127.0.0.1:5500",
//     credentials: true
// }));


// ✅ 2. Body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// server.use(express.static(path.join(__dirname, "../frontend/component/Login.html")));

// server.use(session({
//     name: "sms.sid",           // optional but good practice
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: false,  // 🔥 IMPORTANT
//     cookie: {
//         secure: false,         // true only for HTTPS
//         httpOnly: true,
//         sameSite: "lax"
//     }
// }));

// server.use(express.json());
// server.use(courseRoutes);
server.use(facultyRoutes);
server.use(studentRoutes);

// Routes
server.use("/", authRoutes);
server.use("/", studentRoutes);
server.use("/", adminRoutes);
server.use("/", facultyRoutes);
server.use("/announcements", announcementRoutes);



// 5. Global Error Handler
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!"
    });
});

// server.get("/test-session", (req, res) => {
//     req.session.test = "SESSION_OK";
//     res.json(req.session);
// });

server.listen(port, () => {
    console.log(`Server running at http://localhost: ${port}`);
});
