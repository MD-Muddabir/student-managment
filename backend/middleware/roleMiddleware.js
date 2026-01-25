
// 👉 Security & role checks

// if (role === 'admin') location.href = 'dashboards/admin/admin-dashboard.html';
// if (role === 'faculty') location.href = 'dashboards/faculty/faculty-dashboard.html';
// if (role === 'student') location.href = 'dashboards/student/student-dashboard.html';

exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
