
// 👉 App entry point

// 🧠 server.js rule
// ✔ Setup app
// ✔ Load routes
// ❌ No business logic


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRouters");
const studentRoutes = require("./routes/studentRoutes");

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

// Routes
server.use("/", authRoutes);
server.use("/", studentRoutes);

// Global Error Handler
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
