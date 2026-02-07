

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});


// ================= FAQ TOGGLES =================
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.classList.toggle('active');
    });
});

const API_BASE = 'http://localhost:3000';
let currentStudentId = null;

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    checkStudentStatus(); // Check if student details already exist

    const params = new URLSearchParams(window.location.search);
    currentStudentId = params.get('id');

    if (currentStudentId) {
        // fetchEnrolledCourses();
    }
    fetchAllCourses();
});

// ================= CHECK STUDENT STATUS =================
async function checkStudentStatus() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE}/student/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();

        const studentForm = document.getElementById('studentDetailsForm');
        const courseFormContainer = document.getElementById('courseDetailsFormContainer');

        if (result.success && result.exists) {
            // Student details exist -> Show Course Details Form
            if (studentForm) studentForm.style.display = 'none';
            if (courseFormContainer) courseFormContainer.style.display = 'block';
        } else {
            // Student details NOT exist -> Show Student Details Form
            if (studentForm) studentForm.style.display = 'block';
            if (courseFormContainer) courseFormContainer.style.display = 'none';
        }
    } catch (error) {
        console.error("Error checking student status:", error);
    }
}

// ================= FETCH ENROLLED COURSES =================
// async function fetchEnrolledCourses() {
//     try {
//         const response = await fetch(`${API_BASE}/students/${currentStudentId}/courses`);
//         const result = await response.json();

//         const analyticsSection = document.getElementById('studentAnalytics');
//         const container = document.getElementById('enrolledCoursesContainer');

//         if (!container) return;
//         container.innerHTML = '';

//         if (result.success && result.courses.length > 0) {
//             analyticsSection.style.display = 'block';

//             result.courses.forEach(course => {
//                 container.appendChild(createCourseCard(course, true));
//             });
//         } else {
//             analyticsSection.style.display = 'none';
//         }
//     } catch (err) {
//         console.error("Error fetching enrolled courses:", err);
//     }
// }

// ================= FETCH ALL COURSES =================
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
                    description: course.description || '', price: course.price || 'N/A',
                    CID: course.CID || course.cid
                }; allCoursesContainer.appendChild(createCourseCard(mappedCourse, false));
            });
        }
    } catch (error) { console.error('Error fetching all courses:', error); }
}

// ================= COURSE CARD =================
function createCourseCard(course, isEnrolled) {
    const card = document.createElement('div');
    card.className = 'info-card';

    const color = getColorForCourse(course.code || 'DEF');
    card.style.borderLeft = `5px solid ${color}`;

    const button = isEnrolled
        ? `<button class="btn-secondary" style="width:100%;margin-top:1rem">Continue Learning</button>`
        : `<button class="btn-primary" style="width:100%;margin-top:1rem"
              onclick="enrollInCourse(${course.CID}, '${course.cname}')">Enroll Now</button>`;

    card.innerHTML = `
        <h3>${course.cname}</h3>
        <p><strong>Code:</strong> ${course.code}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <b style="color: #ff6b6b;"><strong>Price:</strong> ${course.price}</b>
        ${button}
    `;
    return card;
}

// ================= ENROLL COURSE =================
async function enrollInCourse(CID, cname) {
    if (!confirm(`Enroll in ${cname}?`)) return;

    try {
        const response = await fetch(`${API_BASE}/student/SID/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CID })
        });

        const result = await response.json();

        if (result.success) {
            alert('Enrolled successfully!');
            fetchEnrolledCourses();
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error(err);
        alert("Enrollment failed");
    }
}

// ================= COLORS =================
function getColorForCourse(code) {
    const colors = ['#4f7cff', '#ff6b6b', '#1dd1a1', '#feca57', '#5f27cd'];
    return colors[(code.charCodeAt(0) || 0) % colors.length];
}

// --- Form Logic & Validation ---

function setInputError(input, isError, msg) {
    const group = input.closest('.form-group');
    const errText = group.querySelector('.error-text');
    if (isError) {
        input.classList.add('error');
        errText.innerText = msg || 'Invalid input';
        errText.style.display = 'block';
    } else {
        input.classList.remove('error');
        errText.style.display = 'none';
    }
}

// ================= STUDENT DETAILS FORM =================
document.getElementById('studentDetailsForm').addEventListener('submit', submitDetails);

function submitDetails(e) {
    e.preventDefault();

    const nameIn = document.getElementById('dname');
    const genderIn = document.getElementById('dgender');
    const dobIn = document.getElementById('dob');
    const phoneIn = document.getElementById('dphone');
    const addressIn = document.getElementById('address');

    const name = nameIn.value.trim();
    const gender = genderIn.value.trim();
    const dob = dobIn.value.trim();
    const phone = phoneIn.value.trim();
    const address = addressIn.value.trim();

    // const gender = document.querySelector("input[name='gender']:checked")?.value || "";

    let valid = true;

    setInputError(nameIn, false);
    setInputError(genderIn, false);
    setInputError(dobIn, false);
    setInputError(phoneIn, false);
    setInputError(addressIn, false);

    // Validation
    if (!name) { setInputError(nameIn, true, "Name required"); valid = false; }
    if (!gender) { setInputError(genderIn, true, "Gender required"); valid = false; }
    if (!dob) { setInputError(dobIn, true, "Birthday required"); valid = false; }
    if (!phone) { setInputError(phoneIn, true, "Phone required"); valid = false; }
    if (!address) { setInputError(addressIn, true, "Address required"); valid = false; }

    if (!valid) return;

    // Data for backend
    const data = {
        sname: name,
        gender,
        dob,
        sphone: phone,
        address
    };

    // Backend signup
    // localStorage.removeItem("token");

    const token = localStorage.getItem("token");

    // console.log("JWT Token:", token);

    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "../Login.html";
        return;
    }

    // console.log("JWT Token:", localStorage.getItem("token"));

    fetch(`${API_BASE}/student/add`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}` // 🔥 REQUIRED
        },
        // credentials: "include",   // 🔥 REQUIRED
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Details submitted successfully");
                document.getElementById("studentDetailsForm").reset();

                // Hide Student Form and Show Course Form
                document.getElementById('studentDetailsForm').style.display = 'none';
                document.getElementById('courseDetailsFormContainer').style.display = 'block';
            }
            else {
                alert("Failed to submit details: " + result.message);
            }
        })
        .catch(err => {
            console.error("Error adding student: ", err);
            alert("Failed to submit details");
        });

}

// ================= COURSE DETAILS FORM =================
document.getElementById('courseDetailsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Course enrollment submitted successfully!");
    e.target.reset();
});



function loadUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        fetch(`http://localhost:3000/profile/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loggedInUser = data.user;
                    studentEmailandName();
                } else {
                    console.error('Failed to load user profile');
                    alert('Session expired or invalid user');
                    window.location.href = LOGIN_PATH;
                }
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }
}



// fetch("http://localhost:3000/login", {
//     method: "POST",
//     headers: {
//         "content-type": "application/json"
//     },
//     body: JSON.stringify({ email, password, role })
// })
// .then(res => res.json())
// .then(result => {
//     if (result.success) {
//         loggedInUser = result.user;
//         studentEmailandName();
//     } else {
//         alert("Login failed: " + result.message);
//     }
// })
// .catch(err => {
//     console.error(err);
//     alert("Login error");
// });


function studentEmailandName() {
    if (!loggedInUser) return;

    // Sidebar user info
    const sidebarUserEmail = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');

    if (sidebarUserEmail) sidebarUserEmail.textContent = loggedInUser.email;
    if (sidebarUserRole) sidebarUserRole.textContent = capitalize(loggedInUser.role);

    // Welcome banner
    const welcomeUserName = document.getElementById('welcomeUserName');
    const welcomeUserRole = document.getElementById('welcomeUserRole');

    if (welcomeUserName) welcomeUserName.textContent = loggedInUser.email;
    if (welcomeUserRole) welcomeUserRole.textContent = capitalize(loggedInUser.role);

    // document.getElementById('dname').value = loggedInUser.name;
    // document.getElementById('demail').value = loggedInUser.email;
    // document.getElementById('dphone').value = loggedInUser.phone;
}


