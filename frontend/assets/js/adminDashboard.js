

const API_BASE = 'http://localhost:3000';

// ================= COURSE COUNT =================
async function loadCourseCount() {
    try {
        const response = await fetch(`${API_BASE}/course-count`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalCoursses").textContent = result.data;
        }
    } catch (err) {
        console.error("Error loading course count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadCourseCount);


// ================= FACULTY COUNT =================
async function loadFacultyCount() {
    try {
        const response = await fetch(`${API_BASE}/faculty-count`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalTeachers").textContent = result.data;
        }
    } catch (err) {
        console.error("Error loading faculty count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadFacultyCount);


// ================= STUDENT COUNT =================
async function loadStudentCount() {
    try {
        const resposne = await fetch(`${API_BASE}/student-count`);
        const result = await resposne.json();

        if (result.success) {
            document.getElementById("totalStudents").textContent = result.data;
        }
    } catch (err) {
        console.error("Error loading student count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadStudentCount);


// ================= TOTAL COUNT =================
async function loadTotalCount() {
    try {
        const respose = await fetch(`${API_BASE}/total-count`);
        const result = await respose.json();

        if (result.success) {
            document.getElementById("totalUsers").textContent = result.data;
        }
    } catch (err) {
        console.error("Error loading total count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadTotalCount);
