
// 👉 Business logic (brain of app)

// 🧠 Controller rule
// ✔ Takes req, res
// ✔ Calls model
// ✔ Handles success & error
// ❌ No SQL here

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");



// ================= GENERATE TOKEN =================
// const token = jwt.sign(
//     { UID: user.UID },
//     secretKey,
//     { expiresIn: "2h" }
// );



// ================= SIGNUP =================
exports.signup = (req, res) => {
    const { email, password, role, status } = req.body;

    userModel.createUser(
        [email, password, role, status],
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

            // userModel.createStudent(
            //     [email, phone],
            //     (err) => {
            //         if (err) {
            //             return res.status(500).json({
            //                 success: false,
            //                 message: "Student insert failed"
            //             });
            //         }

            res.json({
                success: true,
                message: "Signup successful",
                id: uId
            });
        }
    );
}
//     );
// };

// ================= LOGIN =================
exports.login = (req, res) => {
    const { email, password, role, status } = req.body;

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
                message: "Invalid password"
            });
        }
        if (user.role !== role) {
            return res.json({
                success: false,
                message: "Invalid role"
            });
        }

        if (user.status == 'blocked') {
            return res.json({
                success: false,
                message: "User is blocked ... !"
            });
        }
        if (user.status == 'inactive') {
            return res.json({
                success: false,
                message: "User is inactive ... !"
            });
        }

        // ✅ CREATE TOKEN
        // const token = jwt.sign(
        //     { UID: user.UID },
        //     JWT_SECRET,
        //     { expiresIn: "2h" }
        // );

        // ✅ CREATE TOKEN (ONLY HERE)
        const token = jwt.sign(
            { UID: user.UID, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.UID,
                email: user.uemail,
                role: user.role,
                status: user.status
            }
        });
    });
};

// ================= GET PROFILE =================
exports.getProfile = (req, res) => {
    const id = req.params.id;

    userModel.findUserById(id, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        res.json({
            success: true,
            user: {
                id: user.UID,
                email: user.uemail,
                role: user.role,
                status: user.status
            }
        });
    });
};

