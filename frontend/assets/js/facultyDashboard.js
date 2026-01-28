

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    currentStudentId = params.get('id');

    if (!currentStudentId) {
        console.error("Student ID missing in URL");
        return;
    }

    fetchEnrolledCourses();
    fetchAllCourses();
});


// ================= FETCH ALL COURSES =================

const API_BASE = 'http://localhost:3000';
let currentStudentId = null;

async function fetchAllCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`);
        const result = await response.json();
        const allCoursesContainer = document.querySelector('#courses-section .cards-grid');
        if (result.success && allCoursesContainer) {
            allCoursesContainer.innerHTML = '';
            // Clear static content 
            result.data.forEach(course => {
                // Check uppercase or lowercase keys from DB 
                const mappedCourse = {
                    cname: course.Cname || course.cname || 'Untitled Course', code: course.Ccode || course.code || 'N/A', duration: course.duration || 'N/A',
                    // description: course.description || '',
                    CID: course.CID || course.cid
                }; allCoursesContainer.appendChild(createCourseCard(mappedCourse, false));
            });
        }
    } catch (error) { console.error('Error fetching all courses:', error); }
}

function createCourseCard(course, isEnrolled) {
    const card = document.createElement('div');
    card.className = 'info-card';

    const color = getColorForCourse(course.code || 'DEF');
    card.style.borderLeft = `5px solid ${color}`;

    const button = isEnrolled
        ? `<button class="btn-secondary" style="width:100%;margin-top:1rem">Continue Learning</button>`
        : `<button class="btn-primary" style="width:100%;margin-top:1rem"
              onclick="enrollInCourse(${course.CID}, '${course.cname}')">View Details</button>`;

    card.innerHTML = `
        <h3>${course.cname}</h3>
        <p><strong>Code:</strong> ${course.code}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        ${button}
    `;
    return card;
}

// ================= COLORS =================
function getColorForCourse(code) {
    const colors = ['#4f7cff', '#ff6b6b', '#1dd1a1', '#feca57', '#5f27cd'];
    return colors[(code.charCodeAt(0) || 0) % colors.length];
}

// ================= ENROLL COURSE =================
async function enrollInCourse(courseId, courseName) {
    if (!confirm(`Upcoming Feature Enroll in ${courseName}?`)) return;

    // try {
    //     const response = await fetch(`${API_BASE}/students/${currentStudentId}/enroll`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ courseId })
    //     });

    //     const result = "success";

    //     if (result.success) {
    //         alert('Enrolled successfully!');
    //         fetchEnrolledCourses();
    //     } else {
    //         alert(result.message);
    //     }
    // } catch (err) {
    //     console.error(err);
    //     alert("Enrollment failed");
    // }
}

// ================= FETCH ENROLLED COURSES =================
async function fetchEnrolledCourses() {
    try {
        const response = await fetch(`${API_BASE}/students/${currentStudentId}/courses`);
        const result = await response.json();

        const analyticsSection = document.getElementById('studentAnalytics');
        const container = document.getElementById('enrolledCoursesContainer');

        if (!container) return;
        container.innerHTML = '';

        if (result.success && result.courses.length > 0) {
            analyticsSection.style.display = 'block';

            result.courses.forEach(course => {
                container.appendChild(createCourseCard(course, true));
            });
        } else {
            analyticsSection.style.display = 'none';
        }
    } catch (err) {
        console.error("Error fetching enrolled courses:", err);
    }
}

// ================= FETCH COURSE COUNT =================
async function loadCourseCount() {
    try {
        const response = await fetch(`${API_BASE}/courses/count`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalCoursses").textContent = result.total;
        }
    } catch (err) {
        console.error("Error loading course count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadCourseCount);
// ================= FETCH FACULTY COUNT =================

async function loadFacultyCount() {
    try {
        const response = await fetch(`${API_BASE}/faculty/count`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalTeachers").textContent = result.total;
        }
    } catch (err) {
        console.error("Error loading faculty count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadFacultyCount);
// ================= FETCH STUDENT COUNT =================

async function loadStudentCount() {
    try {
        const response = await fetch(`${API_BASE}/student/count`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalStudents").textContent = result.total;
        }
    } catch (err) {
        console.error("Error loading student count", err);
    }
}

document.addEventListener("DOMContentLoaded", loadStudentCount);


// ================= FETCH STUDENT DETAILS =================

const tdata = document.getElementById("studentsTableBody");
const check = document.getElementById("selectAll");

check.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = check.checked;
    });
});

function createStudentRow(student) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="checkbox" name="student" id="student"></td>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.gender}</td>
        <td>${student.dob}</td>
        <td>${student.phone}</td>
        <td>${student.total_courses ?? 0}</td>
        <td>${student.address}</td>
        <td>${student.profile_completed}</td>
    `;

    tdata.appendChild(row);
}

// document.getElementById("studentId").textContent = result.user.SID;
async function loadStudentDetails() {
    try {
        const response = await fetch(`${API_BASE}/student/details`);
        const result = await response.json();

        // console.log("API RESULT 👉", result);

        if (result.success && Array.isArray(result.students)) {
            tdata.innerHTML = "";
            result.students.forEach(student => {
                createStudentRow(student);
            });
        } else {
            console.warn("No student data found");
        }
    } catch (err) {
        console.error("Error loading student details", err);
    }
}

document.addEventListener("DOMContentLoaded", loadStudentDetails);



