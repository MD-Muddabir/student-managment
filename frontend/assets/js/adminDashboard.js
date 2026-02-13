

// const API_BASE = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    currentStudentId = params.get('id');

    if (!currentStudentId) {
        console.error("Student ID missing in URL");
        return;
    }

    loadCourseCount();
    loadFacultyCount();
    loadStudentCount();
    loadTotalCount();
    loadTotalEnrolledStudents();
    loadStudentDetails();
    loadCourses();
    loadSections();
    loadUserData();
    loadAnnouncements();
    initializeFacultyNotifications();
    loadFacultyDetails();

});

const token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "../../component/Login.html";
}

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

// ================= TOTAL ENROLLED STUDENTS =================
async function loadTotalEnrolledStudents() {
    try {
        const response = await fetch(`${API_BASE}/enrolled-students`);
        const result = await response.json();

        if (result.success) {
            document.getElementById("totalEnrollStudents").textContent = result.data;
        }
    } catch (err) {
        console.error("Error loading total enrolled students", err);
    }
}

// ================= ANNOUNCEMENTS SYSTEM =================
const btnPost = document.querySelector('.btn-post');
const announcementsList = document.getElementById('announcementsList');

// Post new announcement
if (btnPost) {
    btnPost.addEventListener('click', async () => {
        const title = prompt('Enter announcement title:');
        if (!title || title.trim() === '') return;

        const content = prompt('Enter announcement content:');
        if (!content || content.trim() === '') return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/announcements/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            const result = await response.json();

            if (result.success) {
                alert('Announcement posted successfully!');
                loadAnnouncements(); // Reload announcements
            } else {
                alert('Failed to post announcement: ' + result.message);
            }
        } catch (error) {
            console.error('Error posting announcement:', error);
            alert('Error posting announcement');
        }
    });
}

// Load all announcements
async function loadAnnouncements() {
    const token = localStorage.getItem('token');
    if (!token || !announcementsList) return;

    try {
        const response = await fetch(`${API_BASE}/announcements/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success && result.announcements) {
            announcementsList.innerHTML = '';

            if (result.announcements.length === 0) {
                announcementsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No announcements yet</p>';
                return;
            }

            result.announcements.forEach(announcement => {
                const date = new Date(announcement.created_at);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const div = document.createElement('div');
                div.className = 'announcement-item';
                div.innerHTML = `
                    <div class="announcement-header">
                        <h4>${announcement.title}</h4>
                        <button class="btn-delete" onclick="deleteAnnouncement(${announcement.AID})">Delete</button>
                    </div>
                    <p class="announcement-text">${announcement.content}</p>
                    <p class="announcement-meta">${announcement.creator_email || 'Faculty'} on ${formattedDate} at ${formattedTime}</p>
                `;
                announcementsList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// Delete announcement
async function deleteAnnouncement(announcementId) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/announcements/delete/${announcementId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            alert('Announcement deleted successfully!');
            loadAnnouncements(); // Reload announcements
        } else {
            alert('Failed to delete announcement: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Error deleting announcement');
    }
}

// Make deleteAnnouncement globally accessible
window.deleteAnnouncement = deleteAnnouncement;

// ================= FACULTY NOTIFICATION SYSTEM =================

function initializeFacultyNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationOverlay = document.getElementById('notificationOverlay');
    const closeNotificationBtn = document.getElementById('closeNotificationBtn');

    // Open notification sidebar
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            notificationOverlay.classList.add('active');
            loadFacultyNotifications();
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
    loadFacultyAnnouncementCount();
}

// Load announcements for notification sidebar
async function loadFacultyNotifications() {
    const token = localStorage.getItem('token');
    const announcementsListNotification = document.getElementById('announcementsListNotification');
    const loadingSpinner = document.getElementById('notificationLoading');
    const noNotifications = document.getElementById('noNotifications');

    console.log('🔔 Faculty loading notifications...');

    if (!token) {
        console.error('❌ No token found');
        return;
    }

    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (announcementsListNotification) announcementsListNotification.innerHTML = '';
    if (noNotifications) noNotifications.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/announcements/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('📦 Faculty notifications:', result);

        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        if (result.success && result.announcements && result.announcements.length > 0) {
            announcementsListNotification.innerHTML = '';
            result.announcements.forEach(announcement => {
                const card = createFacultyAnnouncementCard(announcement);
                announcementsListNotification.appendChild(card);
            });
        } else {
            if (noNotifications) noNotifications.style.display = 'block';
        }
    } catch (error) {
        console.error('❌ Error loading faculty notifications:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (noNotifications) {
            noNotifications.style.display = 'block';
            noNotifications.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Error loading announcements</p>';
        }
    }
}

// Create announcement card for notification sidebar
function createFacultyAnnouncementCard(announcement) {
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
async function loadFacultyAnnouncementCount() {
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

// Load user data
function loadUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        fetch(`http://localhost:3000/profile/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loggedInUser = data.user;
                    facultyEmailandName();
                } else {
                    console.error('Failed to load user profile');
                    alert('Session expired or invalid user');
                    window.location.href = LOGIN_PATH;
                }
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }
}
function facultyEmailandName() {
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
    document.getElementById('femail').value = loggedInUser.email;
    // document.getElementById('dphone').value = loggedInUser.phone;
}


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
        <td> ${student.id}</td>
        <td> ${student.name}</td>
        <td> ${student.email}</td>
        <td> ${student.gender}</td>
        <td> ${student.dob}</td>
        <td> ${student.phone}</td>  
        <td>${student.total_courses ?? 0}</td>
        <td><button id="editBtn1" onclick='openEditStudentModal(${JSON.stringify(student)})'>Edit</button> <br> <br>
        <button class="btn-delete1" onclick="openDeleteStudentModal(${student.id})">Delete</button></td>
        `;
    // <td>${student.profile_completed}</td>
    // <td>${student.address}</td>

    tdata.appendChild(row);
}
function openEditStudentModal(student) {
    document.getElementById("editStudentModal").style.display = "flex";

    document.getElementById("editStudentId").value = student.id;
    document.getElementById("editName").value = student.name;
    document.getElementById("editEmail").value = student.email;
    document.getElementById("editGender").value = student.gender;
    document.getElementById("editDob").value = student.dob.split("T")[0];
    document.getElementById("editPhone").value = student.phone;
}
function closeEditStudentModal() {
    document.getElementById("editStudentModal").style.display = "none";
}

// Add Student
function openAddStudentModal() {
    document.getElementById("addStudentModal").style.display = "flex";
}
function closeAddStudentModal() {
    document.getElementById("addStudentModal").style.display = "none";
    document.getElementById("addStudentForm").reset();
}
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const data = {
        sname: addName.value.trim(),
        uemail: addEmail.value.trim(),
        gender: addGender.value,
        dob: addDob.value,
        phone: addPhone.value.trim()
    };

    // Validation safety
    if (!Object.values(data).every(v => v)) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/faculty/student/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert("Student added successfully");
            closeAddStudentModal();
            location.reload();
        } else {
            alert(result.message || "Failed to add student");
        }
    } catch (error) {
        console.error("Add student error:", error);
        alert("Server error");
    }
});

// Update Student
document.getElementById("editStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const sid = document.getElementById("editStudentId").value;
    const token = localStorage.getItem("token");

    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");
    const editGender = document.getElementById("editGender");
    const editDob = document.getElementById("editDob");
    const editPhone = document.getElementById("editPhone");

    // 1. UPDATE PROFILE
    const profileData = {
        sname: editName.value.trim(),
        uemail: editEmail.value.trim(),
        phone: editPhone.value.trim(),
        gender: editGender.value,
        dob: editDob.value
    };

    try {
        const res = await fetch(`${API_BASE}/faculty/student/update/${sid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        const result = await res.json();
        if (result.success) {
            alert("Student updated successfully");
            closeEditStudentModal();
            location.reload();
        } else {
            alert("Failed to update profile: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
    }
});

let deleteStudentId = null;

// Delete Student
function openDeleteStudentModal(studentId) {
    deleteStudentId = studentId;
    document.getElementById("deleteStudentModal").style.display = "flex";
}
function closeDeleteStudentModal() {
    deleteStudentId = null;
    document.getElementById("deleteStudentModal").style.display = "none";
}
document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    if (!deleteStudentId) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_BASE}/student/delete/${deleteStudentId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();

        if (result.success) {
            alert("Student deleted successfully");
            closeDeleteStudentModal();
            location.reload(); // refresh list
        } else {
            alert(result.message || "Delete failed");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error while deleting student");
    }
});

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

// ================= MANAGE SECTIONS =================

// Load Sections
function loadSections() {
    fetch(`${API_BASE}/faculty/sections`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(result => {
            if (!result.success) return;

            const container = document.getElementById("sectionsContainer");
            container.innerHTML = "";

            result.data.forEach(sec => {
                container.innerHTML += `
          <div class="info-card">
            <h3>${sec.section_name}</h3>
            <p>Students: ${sec.student_count}</p>
            <button class="btn-secondary"
              onclick="viewSection(${sec.section_id})">
              View Details
            </button>
          </div>
        `;
            });
        });
}

// Add Section
document.getElementById("addSectionBtn").addEventListener("click", () => {
    const name = prompt("Enter Section Name");
    if (!name) return;

    fetch(`${API_BASE}/faculty/sections/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ section_name: name })
    }).then(() => loadSections());
});

// View Section
function viewSection(id) {
    fetch(`${API_BASE}/faculty/sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(result => {
            const students = result.data
                .map(s => `${s.sname} (${s.gender})`)
                .join("\n");
            alert(students || "No students");
        });
}

// ================= MANAGE COURSES =================
function createCourseCard(course, isEnrolled) {
    const card = document.createElement('div');
    card.className = 'info-card';

    const color = getColorForCourse(course.code || 'DEF');
    card.style.borderLeft = `5px solid ${color}`;

    const button = isEnrolled
        ? `<button class="btn-secondary" style="width:100%;margin-top:1rem">Continue Learning</button>`
        : `<button class="btn-primary" style="width:100%;margin-top:1rem"
              onclick="enrollNow()">Enroll Now</button>`;

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

function enrollNow() {
    alert("Enrollment feature only for Students!");
}

// Load Courses
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/admin/courses`, {
            headers: token
                ? { Authorization: `Bearer ${token}` }
                : {}
        });

        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) return;

        /* ================= FACULTY DASHBOARD ================= */
        const container =
            document.querySelector('#courses-section .cards-grid')
            || document.getElementById("facultyCoursesContainer");

        if (!container) return;

        container.innerHTML = '';
        availableCourses = [];

        result.data.forEach(course => {
            const mappedCourse = {
                CID: course.CID,
                cname: course.cname,
                code: course.code,
                duration: course.duration,
                description: course.description,
                price: course.price
            };

            availableCourses.push(mappedCourse);
            container.appendChild(createCourseCard(mappedCourse));
        });

    } catch (error) {
        console.error("❌ Error loading courses:", error);
    }
}

// Course Card
function createCourseCard(course, role) {
    const card = document.createElement('div');
    card.className = 'info-card';

    const color = getColorForCourse(course.code || 'DEF');
    card.style.borderLeft = `5px solid ${color}`;

    card.innerHTML = `
        <h3>${course.cname}</h3>
        <p><strong>Code:</strong> ${course.code}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <b style="color: #ff6b6b;"><strong>Price:</strong> ${course.price}</b>

        <div class="card-actions" style="margin-top:1rem;">
            <button class="btn-secondary"
                onclick='openEditCourseModal(${JSON.stringify(course)})'>
                Edit
            </button>
            <button class="btn-delete"
                onclick="deleteCourse(${course.CID})">
                Delete
            </button>
        </div>
    `;

    return card;
}
function enrollNow(courseId) {
    alert(`Enroll flow for course ID: ${courseId}`);
}

// Colors
function getColorForCourse(code) {
    const colors = ['#4f7cff', '#ff6b6b', '#1dd1a1', '#feca57', '#5f27cd'];
    return colors[(code.charCodeAt(0) || 0) % colors.length];
}
function enrollNow(courseId) {
    alert(`Enroll flow for course ID: ${courseId}`);
}

// Add Course
function openAddCourseModal() {
    document.getElementById("addCourseModal").style.display = "flex";
}
function closeAddCourseModal() {
    document.getElementById("addCourseModal").style.display = "none";
    document.getElementById("addCourseForm").reset();
}

document.getElementById("addCourseForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        cname: courseName.value,
        code: courseCode.value,
        duration: courseDuration.value,
        price: coursePrice.value,
        description: courseDescription.value
    };

    const res = await fetch(`${API_BASE}/faculty/courses/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
        closeAddCourseModal();
        loadFacultyCourses();
    } else alert(result.message);
});

// Edit Course
function openEditCourseModal(course) {
    editCourseId.value = course.CID;
    editCourseName.value = course.cname;
    editCourseCode.value = course.code;
    editCourseDuration.value = course.duration;
    editCoursePrice.value = course.price;
    editCourseDescription.value = course.description;

    document.getElementById("editCourseModal").style.display = "flex";
}

function closeEditCourseModal() {
    document.getElementById("editCourseModal").style.display = "none";
}

document.getElementById("editCourseForm").addEventListener("submit", async e => {
    e.preventDefault();

    const id = editCourseId.value;
    const data = {
        cname: editCourseName.value,
        code: editCourseCode.value,
        duration: editCourseDuration.value,
        price: editCoursePrice.value,
        description: editCourseDescription.value
    };

    const res = await fetch(`${API_BASE}/faculty/courses/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
        closeEditCourseModal();
        loadFacultyCourses();
    } else alert(result.message);
});

// Delete Course
async function deleteCourse(cid) {
    if (!confirm("Delete this course?")) return;

    const res = await fetch(`${API_BASE}/faculty/courses/delete/${cid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    if (result.success) loadFacultyCourses();
    else alert(result.message);
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


// Faculty
const tdata1 = document.getElementById("facultyTableBody");
const check1 = document.getElementById("selectAll");

check1.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = check1.checked;
    });
});

function createFacultyRow(faculty) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="checkbox" name="faculty" id="faculty"></td>
        <td> ${faculty.id}</td>
        <td> ${faculty.name}</td>
        <td> ${faculty.email}</td>
        <td> ${faculty.gender}</td>
        <td> ${formatDate(faculty.dob)}</td>
        <td> ${faculty.phone}</td>  
        <td>${faculty.total_courses ?? 0}</td>
        <td>${faculty.course_names || "-"}</td>
        <td><button id="editBtn1" onclick='openEditFacultyModal(${JSON.stringify(faculty)})'>Edit</button> <br> <br>
        <button class="btn-delete1" onclick="openDeleteFacultyModal(${faculty.id})">Delete</button></td>
        `;
    // <td>${student.profile_completed}</td>
    // <td>${student.address}</td>

    tdata1.appendChild(row);
}
function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
}
function openEditFacultyModal(faculty) {
    document.getElementById("editFacultyModal").style.display = "flex";

    document.getElementById("editFacultyId").value = faculty.id;
    document.getElementById("editFacultyName").value = faculty.name;
    document.getElementById("editFacultyEmail").value = faculty.email;
    document.getElementById("editFacultyGender").value = faculty.gender;
    document.getElementById("editFacultyDob").value = faculty.dob.split("T")[0];
    document.getElementById("editFacultyPhone").value = faculty.phone;
}
function closeEditFacultyModal() {
    document.getElementById("editFacultyModal").style.display = "none";
}

// Get Faculty
async function loadFacultyDetails() {
    try {
        const response = await fetch(`${API_BASE}/admin/faculty/details`);
        const result = await response.json();

        console.log("API RESULT 👉", result);

        if (result.success && Array.isArray(result.data)) {
            tdata1.innerHTML = "";
            result.data.forEach(faculty => {
                createFacultyRow(faculty);
            });
        } else {
            console.warn("No faculty data found");
        }
    } catch (err) {
        console.error("Error loading faculty details", err);
    }
}

// Add Faculty
function openAddFacultyModal() {
    document.getElementById("addFacultyModal").style.display = "flex";
}
function closeAddFacultyModal() {
    document.getElementById("addFacultyModal").style.display = "none";
    document.getElementById("addFacultyForm").reset();
}
document.getElementById("addFacultyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Safety check
    if (!addfacultyName || !addfacultyEmail || !addfacultyGender || !addfacultyDob ||
        !addfacultyPhone || !addfacultyDepartment || !addfacultyQualification || !addfacultyExperience) {
        alert("Form inputs not found. Check input IDs.");
        return;
    }

    const data = {
        fname: addfacultyName.value.trim(),
        uemail: addfacultyEmail.value.trim(),
        gender: addfacultyGender.value,
        dob: addfacultyDob.value,
        phone: addfacultyPhone.value.trim(),
        department: addfacultyDepartment.value.trim(),
        qualification: addfacultyQualification.value.trim(),
        experience: addfacultyExperience.value.trim()
    };

    // Validation safety
    if (!Object.values(data).every(v => v)) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/admin/faculty/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert("Faculty added successfully");
            closeAddFacultyModal();
            location.reload();
        } else {
            alert(result.message || "Failed to add Faculty");
        }
    } catch (error) {
        console.error("Add Faculty error:", error);
        alert("Server error");
    }
});

// Update Faculty
document.getElementById("editFacultyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fid = document.getElementById("editFacultyId").value;
    const token = localStorage.getItem("token");

    const editName = document.getElementById("editFacultyName");
    const editEmail = document.getElementById("editFacultyEmail");
    const editGender = document.getElementById("editFacultyGender");
    const editDob = document.getElementById("editFacultyDob");
    const editPhone = document.getElementById("editFacultyPhone");
    const editDepartment = document.getElementById("editFacultyDepartment");
    const editQualification = document.getElementById("editFacultyQualification");
    const editExperience = document.getElementById("editFacultyExperience");
    const editCourseNames = document.getElementById("editFacultyCourseNames");

    // 1. UPDATE PROFILE
    const profileData = {
        fname: editName.value.trim(),
        uemail: editEmail.value.trim(),
        phone: editPhone.value.trim(),
        gender: editGender.value,
        dob: editDob.value,
        department: editDepartment.value.trim(),
        qualification: editQualification.value.trim(),
        experience: editExperience.value.trim(),
        course_names: editCourseNames.value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/admin/faculty/update/${fid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        const result = await res.json();
        if (result.success) {
            alert("Faculty updated successfully");
            closeEditFacultyModal();
            location.reload();
        } else {
            alert("Failed to update Faculty: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating Faculty:", error);
        alert("Error updating Faculty");
    }
});

let deleteFacultyId = null;

// Delete Faculty
function openDeleteFacultyModal(facultyId) {
    deleteFacultyId = facultyId;
    document.getElementById("deleteFacultyModal").style.display = "flex";
}
function closeDeleteFacultyModal() {
    deleteFacultyId = null;
    document.getElementById("deleteFacultyModal").style.display = "none";
}
document.getElementById("fconfirmDeleteBtn").addEventListener("click", async () => {
    if (!deleteFacultyId) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_BASE}/admin/faculty/delete/${deleteFacultyId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();

        if (result.success) {
            alert("Faculty deleted successfully");
            closeDeleteFacultyModal();
            location.reload(); // refresh list
        } else {
            alert(result.message || "Delete failed");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error while deleting Faculty");
    }
});