

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    checkStudentStatus();
    fetchAllCourses();
    loadAccountSettings();
    initializeNotifications();
    loadStudentSectionInfo();
});


// ================= FAQ TOGGLES =================
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.classList.toggle('active');
    });
});

// let currentStudentId = null;
let availableCourses = [];
let selectedCourseId = null;
// const API_BASE = "http://localhost:3000";
// const API_BASE = "http://localhost:3000";

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

        // if (!studentForm || !courseForm) return;

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


// ================= FETCH ALL COURSES =================
async function fetchAllCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`);
        const result = await response.json();
        const allCoursesContainer = document.querySelector('#courses-section .cards-grid');
        if (result.success && allCoursesContainer) {
            allCoursesContainer.innerHTML = '';
            availableCourses = []; // Reset list
            // Clear static content 
            result.data.forEach(course => {
                // Check uppercase or lowercase keys from DB 
                // const mappedCourse = {
                //     cname: course.Cname || course.cname || 'Untitled Course',
                //     code: course.Ccode || course.code || 'N/A',
                //     duration: course.duration || 'N/A',
                //     description: course.description || '',
                //     price: course.price || 'N/A',
                //     CID: course.CID || course.cid
                // };
                const mappedCourse = {
                    CID: course.CID,
                    cname: course.cname,
                    code: course.code,
                    duration: course.duration,
                    description: course.description,
                    price: course.price
                };
                availableCourses.push(mappedCourse);
                allCoursesContainer.appendChild(createCourseCard(mappedCourse, false));
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
              onclick="enrollNow(${course.CID})">Enroll Now</button>`;

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

function enrollNow(courseId) {
    selectedCourseId = courseId; // store selected course

    // 🔁 SWITCH TO STUDENT DETAILS SECTION
    // showSection('student-details-section');
    // 1️⃣ Open Student Details section
    switchSection('student-details');

    // // 2️⃣ Hide student form ONLY if already submitted
    // document.getElementById('courseDetailsFormContainer').style.display = 'block';

    // Switch to student details
    const studentDetailsMenu = document.querySelector('[data-section="student-details"]');
    if (studentDetailsMenu) {
        studentDetailsMenu.click();
    }
    // // Wait slightly for DOM or just fill it
    setTimeout(() => {
        fillCourseForm(courseId);
    }, 100);

    // Optional: scroll nicely
    document.getElementById('student-details-section')
        .scrollIntoView({ behavior: 'smooth' });
}
// function showSection(sectionId) {
//     // Hide all sections
//     document.querySelectorAll('.content-section').forEach(sec => {
//         sec.classList.remove('active');
//     });

//     // Show only selected section
//     document.getElementById(sectionId).classList.add('active');
// }


// ================= FILL COURSE FORM =================
function fillCourseForm(cid) {
    const course = availableCourses.find(c => c.CID == cid);
    if (!course) return;

    selectedCourseId = cid;

    // Populate Form Fields
    const form = document.getElementById('courseDetailsForm');
    if (form) {
        document.getElementById('cname').value = course.cname;
        document.getElementById('ccode').value = course.code;
        document.getElementById('cduration').value = course.duration;
        document.getElementById('cprice').value = course.price;
        document.getElementById('cdescription').value = course.description;
    }

    // Show container if hidden (though it should be visible for existing students)
    const container = document.getElementById('courseDetailsFormContainer');
    if (container) {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
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

    const token = localStorage.getItem("token");

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
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                loggedInUser = result.user;
                FindName();
                alert("Details submitted successfully");
                document.getElementById("studentDetailsForm").reset();

                // Hide Student Form and Show Course Form
                document.getElementById('studentDetailsForm').style.display = 'none';

                const courseFormContainer = document.getElementById('courseDetailsFormContainer');
                if (courseFormContainer) {
                    courseFormContainer.style.display = 'block';
                }
                // Refresh Account Settings immediately
                loadAccountSettings();

                if (selectedCourseId) {
                    fillCourseForm(selectedCourseId);
                }
            } else {
                alert("Failed to submit details: " + result.message);
            }
        })
        .catch(err => {
            console.error("Error adding student: ", err);
            alert("Failed to submit details");
        });

}

// ================= COURSE DETAILS FORM =================
document.getElementById('courseDetailsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1️⃣ Course must be selected
    if (!selectedCourseId) {
        alert("Please select a course first.");
        return;
    }

    // 2️⃣ Get token safely
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "../Login.html";
        return;
    }

    // 3️⃣ Confirm enrollment
    if (!confirm("Are you sure you want to enroll/buy this course?")) return;

    try {
        const response = await fetch(`${API_BASE}/student/enroll`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ REQUIRED
            },
            body: JSON.stringify({ courseId: selectedCourseId })
        });

        const result = await response.json();

        if (result.success) {
            alert("Course enrollment submitted successfully!");
            e.target.reset();
            selectedCourseId = null;
        } else {
            alert("Enrollment failed: " + result.message);
        }
    } catch (error) {
        console.error("Error enrolling:", error);
        alert("An error occurred during enrollment.");
    }
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
    document.getElementById('demail').value = loggedInUser.email;
    // document.getElementById('dphone').value = loggedInUser.phone;
}
function FindName() {
    if (!loggedInUser) return;

    // Sidebar user info
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsRole = document.getElementById('settingsRole');

    if (settingsName) settingsName.textContent = loggedInUser.name;
    if (settingsEmail) settingsEmail.textContent = loggedInUser.email;
    document.getElementById('settingsEmail').value = loggedInUser.email;
    if (settingsRole) settingsRole.textContent = capitalize(loggedInUser.role);


    // document.getElementById('dname').value = loggedInUser.name;
    // document.getElementById('dphone').value = loggedInUser.phone;
}

// ================= ACCOUNT SETTINGS =================



// ================= LOAD ACCOUNT SETTINGS =================
async function loadAccountSettings() {
    const token = localStorage.getItem("token");
    // console.log("JWT Token12:", token);

    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/settings`, { // fetch from API_BASE
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        console.log("API RESULT:", result);

        if (result.success && result.data) {
            const d = result.data;

            const settingsID = document.getElementById('settingsID');
            const settingsName = document.getElementById('settingsName');
            const settingsEmail = document.getElementById('settingsEmail');
            const settingsPhone = document.getElementById('settingsPhone');
            const settingsAddress = document.getElementById('settingsAddress');
            const displayName = document.getElementById('displayName');

            if (settingsID) settingsID.value = d.SID || '';
            if (displayName) displayName.textContent = d.sname || '';
            if (settingsName) settingsName.value = d.sname || '';
            if (settingsEmail) settingsEmail.value = d.uemail || '';
            if (settingsPhone) settingsPhone.value = d.phone || '';
            if (settingsAddress) settingsAddress.value = d.address;
        }
    } catch (error) {
        console.error("Error loading account settings:", error);
    }
}

// document.addEventListener("DOMContentLoaded", loadAccountSettings);

// ================= ENABLE EDIT =================
window.enableEdit = function () {

    // Enable all fields
    document.getElementById("settingsName").readOnly = false;
    document.getElementById("settingsPhone").readOnly = false;

    // Address if exists
    // const settingsAddress = document.getElementById("settingsAddress");
    // if (settingsAddress) settingsAddress.readOnly = false;

    // Show password section
    const passwordSection = document.getElementById("passwordSection");
    if (passwordSection) passwordSection.style.display = "block";

    document.getElementById("editBtn").disabled = true;
    document.getElementById("saveBtn").disabled = false;
}

// ================= SAVE CHANGES =================
// ================= SAVE CHANGES =================
// ================= SAVE CHANGES (PROFILE & PASSWORD) =================
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

        const settingsID = document.getElementById('settingsID');
        // Check if SID is present
        if (!settingsID || !settingsID.value || settingsID.value.trim() === '') {
            alert("First fill the studentDetails");
            // Switch to student details
            const studentDetailsMenu = document.querySelector('[data-section="student-details"]');
            if (studentDetailsMenu) {
                studentDetailsMenu.click();
            }
            return;
        }

        const token = localStorage.getItem("token");
        const settingsName = document.getElementById('settingsName');
        const settingsEmail = document.getElementById('settingsEmail');
        const settingsPhone = document.getElementById('settingsPhone');

        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');

        // 1. UPDATE PROFILE
        const profileData = {
            sname: settingsName ? settingsName.value : '',
            uemail: settingsEmail ? settingsEmail.value : '',
            phone: settingsPhone ? settingsPhone.value : ''
        };

        let profileSuccess = false;
        try {
            const res = await fetch(`${API_BASE}/settings/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            const result = await res.json();
            if (result.success) {
                profileSuccess = true;
            } else {
                alert("Failed to update profile: " + (result.message || "Unknown error"));
                return; // Stop if profile update fails
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
            return;
        }

        // 2. UPDATE PASSWORD (Only if fields are filled)
        if (currentPassword && currentPassword.value.trim() !== '') {

            if (newPassword.value !== confirmPassword.value) {
                alert("New password and confirm password do not match");
                return;
            }

            if (newPassword.value === '') {
                alert("New password cannot be empty");
                return;
            }

            const passwordData = {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value
            };

            try {
                const resPWD = await fetch(`${API_BASE}/settings/password`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(passwordData)
                });
                const resultPWD = await resPWD.json();

                if (resultPWD.success) {
                    alert("Profile and Password updated successfully");
                    location.reload();
                } else {
                    alert("Profile updated, but Password update failed: " + resultPWD.message);
                }
            } catch (error) {
                console.error("Error updating password:", error);
                alert("Error updating password");
            }
        } else {
            // Only profile updated
            if (profileSuccess) {
                alert("Profile updated successfully");
                location.reload();
            }
        }
    });
}

// ================= NOTIFICATION SYSTEM =================
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationOverlay = document.getElementById('notificationOverlay');
    const closeNotificationBtn = document.getElementById('closeNotificationBtn');
    // Open notification sidebar
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            notificationOverlay.classList.add('active');
            loadAnnouncements();
        });
    }
    // Close notification sidebar
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            notificationOverlay.classList.remove('active');
        });
    }
    // Close on overlay click
    if (notificationOverlay) {
        notificationOverlay.addEventListener('click', (e) => {
            if (e.target === notificationOverlay) {
                notificationOverlay.classList.remove('active');
            }
        });
    }
    // Load initial count
    loadAnnouncementCount();
}
// Load announcements
async function loadAnnouncements() {
    const token = localStorage.getItem('token');
    const announcementsList = document.getElementById('announcementsList');
    const loadingSpinner = document.getElementById('notificationLoading');
    const noNotifications = document.getElementById('noNotifications');
    console.log('🔔 Loading announcements...');
    console.log('Token exists:', !!token);
    console.log('announcementsList element:', announcementsList);
    if (!token) {
        console.error('❌ No token found');
        return;
    }
    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (announcementsList) announcementsList.innerHTML = '';
    if (noNotifications) noNotifications.style.display = 'none';
    try {
        console.log('📡 Fetching from:', `${API_BASE}/announcements/all`);
        const response = await fetch(`${API_BASE}/announcements/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('📥 Response status:', response.status);
        const result = await response.json();
        console.log('📦 Response data:', result);
        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (result.success && result.announcements && result.announcements.length > 0) {
            console.log(`✅ Found ${result.announcements.length} announcements`);
            announcementsList.innerHTML = '';
            result.announcements.forEach(announcement => {
                const card = createAnnouncementCard(announcement);
                announcementsList.appendChild(card);
            });
        } else {
            console.log('ℹ️ No announcements found');
            if (noNotifications) noNotifications.style.display = 'block';
        }
    } catch (error) {
        console.error('❌ Error loading announcements:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (noNotifications) {
            noNotifications.style.display = 'block';
            noNotifications.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Error loading announcements</p>';
        }
    }
}
// Create announcement card
function createAnnouncementCard(announcement) {
    const card = document.createElement('div');
    card.className = 'announcement-card';
    const date = new Date(announcement.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    card.innerHTML = `
        <div class="announcement-card-header">
            <h4 class="announcement-card-title">${announcement.title}</h4>
        </div>
        <div class="announcement-card-content">
            ${announcement.content}
        </div>
        <div class="announcement-card-meta">
            <span class="announcement-card-author">
                <i class="fas fa-user-circle"></i>
                ${announcement.creator_email || 'Faculty'}
            </span>
            <span class="announcement-card-date">${formattedDate}</span>
        </div>
    `;
    return card;
}
// Load announcement count for badge
async function loadAnnouncementCount() {
    const token = localStorage.getItem('token');
    const badge = document.getElementById('notificationBadge');
    if (!token || !badge) return;
    try {
        const response = await fetch(`${API_BASE}/announcements/count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            badge.textContent = result.total;
            badge.style.display = result.total > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error loading announcement count:', error);
    }
}

//student Sections
async function loadStudentSectionInfo() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(
            `${API_BASE}/student/sections`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await res.json();
        const tbody = document.getElementById("sectionInfoBody");

        tbody.innerHTML = "";

        if (result.success && result.data.length > 0) {
            result.data.forEach(row => {
                tbody.innerHTML += `
                    <tr>
                        <td>${row.section_name}</td>
                        <td>${row.faculty_name}</td>
                        <td>${row.course_name}</td>
                        <td>${row.course_code}</td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">No section/course assigned yet</td>
                </tr>
            `;
        }
    } catch (err) {
        console.error("Failed to load section info", err);
    }
}

// Call on dashboard load
// document.addEventListener("DOMContentLoaded", loadStudentSectionInfo);
