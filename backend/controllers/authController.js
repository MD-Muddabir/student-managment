
// 👉 Business logic (brain of app)

// 🧠 Controller rule
// ✔ Takes req, res
// ✔ Calls model
// ✔ Handles success & error
// ❌ No SQL here

const userModel = require("../models/userModel");

// ================= SIGNUP =================
exports.signup = (req, res) => {
    const { name, email, password, role, phone } = req.body;

    userModel.createUser(
        [name, email, password, role],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            const uId = result.insertId;

            userModel.createStudent(
                [name, email, phone],
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Student insert failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Signup successful",
                        id: uId
                    });
                }
            );
        }
    );
};

// ================= LOGIN =================
exports.login = (req, res) => {
    const { email, password, role } = req.body;

    userModel.findUserByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage
            });
        }

        if (results.length === 0) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        if (user.upassword !== password) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }
        if (user.role !== role) {
            return res.json({
                success: false,
                message: "Invalid role"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.UID,
                name: user.uname,
                email: user.uemail,
                role: user.role
            }
        });
    });
};

