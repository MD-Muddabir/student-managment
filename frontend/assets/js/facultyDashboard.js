

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    currentStudentId = params.get('id');

    if (!currentStudentId) {
        console.error("Student ID missing in URL");
        return;
    }

    // fetchEnrolledCourses();
    loadAccountSettings();
    loadStudentDetails();
    loadSections();
    loadCourses();
    loadUserData();
    // fetchAllCourses();
    loadCourseCount();
    loadFacultyCount();
    loadStudentCount();
    // loadFacultyCourses();
});

// ================= ANNOUNCEMENTS SYSTEM =================
const btnPost = document.querySelector('.btn-post');
const announcementsList = document.getElementById('announcementsList');

// Load announcements on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
    initializeFacultyNotifications();
});

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

// ================= COLORS =================
function getColorForCourse(code) {
    const colors = ['#4f7cff', '#ff6b6b', '#1dd1a1', '#feca57', '#5f27cd'];
    return colors[(code.charCodeAt(0) || 0) % colors.length];
}

// ================= FACULTY STATUS =================
async function checkFacultyStatus() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE}/faculty/status`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();

    if (result.success && !result.exists) {
        alert("Please complete your faculty profile first");

        // Redirect to Faculty Details page
        document
            .querySelector('[data-section="faculty-details"]')
            ?.click();
    }
}
checkFacultyStatus();

// ================= LOAD ACCOUNT SETTINGS =================
async function loadAccountSettings() {
    const token = localStorage.getItem("token");
    // console.log("JWT Token12:", token);

    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/faculty/settings`, { // fetch from API_BASE
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        // console.log("API RESULT:", result);

        if (result.success && result.data) {
            const d = result.data;

            const settingsID = document.getElementById('settingsID');
            const settingsName = document.getElementById('settingsName');
            const settingsEmail = document.getElementById('settingsEmail');
            const settingsPhone = document.getElementById('settingsPhone');
            const settingsAddress = document.getElementById('settingsAddress');
            const displayName = document.getElementById('displayName');

            if (settingsID) settingsID.value = d.FID || '';
            if (displayName) displayName.textContent = d.fname || '';
            if (settingsName) settingsName.value = d.fname || '';
            if (settingsEmail) settingsEmail.value = d.uemail || '';
            if (settingsPhone) settingsPhone.value = d.phone || '';
            if (settingsAddress) settingsAddress.value = d.address;
        }
    } catch (error) {
        console.error("Error loading account settings:", error);
    }
}
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
// ================= SAVE CHANGES (PROFILE & PASSWORD) =================
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

        const settingsID = document.getElementById('settingsID');
        // Check if SID is present
        if (!settingsID || !settingsID.value || settingsID.value.trim() === '') {
            alert("First fill the Faculty Details");
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
            fname: settingsName ? settingsName.value : '',
            uemail: settingsEmail ? settingsEmail.value : '',
            phone: settingsPhone ? settingsPhone.value : ''
        };

        let profileSuccess = false;
        try {
            const res = await fetch(`${API_BASE}/faculty/settings/update`, {
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

// ================= FETCH ALL COURSES =================
// async function fetchAllCourses() {
//     try {
//         const response = await fetch(`${API_BASE}/courses`);
//         const result = await response.json();
//         const allCoursesContainer = document.querySelector('#courses-section .cards-grid');
//         if (result.success && allCoursesContainer) {
//             allCoursesContainer.innerHTML = '';
//             availableCourses = []; // Reset list
//             // Clear static content 
//             result.data.forEach(course => {
//                 // Check uppercase or lowercase keys from DB 
//                 const mappedCourse = {
//                     cname: course.Cname || course.cname || 'Untitled Course', code: course.Ccode || course.code || 'N/A', duration: course.duration || 'N/A',
//                     description: course.description || '', price: course.price || 'N/A',
//                     CID: course.CID || course.cid
//                 };
//                 availableCourses.push(mappedCourse);
//                 allCoursesContainer.appendChild(createCourseCard(mappedCourse, false));
//             });
//         }
//     } catch (error) { console.error('Error fetching all courses:', error); }
// }
// ================= COURSE CARD =================
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

// // ================= ENROLL COURSE =================
// async function enrollInCourse(courseId, courseName) {
//     if (!confirm(`Upcoming Feature Enroll in ${courseName}?`)) return;

//     // try {
//     //     const response = await fetch(`${API_BASE}/students/${currentStudentId}/enroll`, {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify({ courseId })
//     //     });

//     //     const result = "success";

//     //     if (result.success) {
//     //         alert('Enrolled successfully!');
//     //         fetchEnrolledCourses();
//     //     } else {
//     //         alert(result.message);
//     //     }
//     // } catch (err) {
//     //     console.error(err);
//     //     alert("Enrollment failed");
//     // }
// }

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

// // ================= Add Courses =================
// document.addEventListener("DOMContentLoaded", () => {
//     loadFacultyCourses();

//     document.getElementById("addCourseBtn")
//         .addEventListener("click", () => {
//             document.getElementById("addCourseModal").style.display = "block";
//         });
// });

// document.getElementById("addCourseModal")
//     ?.addEventListener("click", (e) => {
//         if (e.target.id === "addCourseModal") {
//             closeCourseModal();
//         }
//     });

// // function closeCourseModal() {
// //     document.getElementById("addCourseModal").style.display = "none";
// // }

// // 🔹 LOAD COURSES
// // function loadFacultyCourses() {
// //     fetch(`${API_BASE}/faculty/courses`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //     })
// //         .then(res => res.json())
// //         .then(result => {
// //             const container = document.getElementById("facultyCoursesContainer");
// //             container.innerHTML = "";

// //             if (!result.success || result.data.length === 0) {
// //                 container.innerHTML = "<p>No courses assigned yet</p>";
// //                 return;
// //             }

// //             result.data.forEach(c => {
// //                 container.innerHTML += `
// //                     <div class="info-card">
// //                         <h3>${c.cname}</h3>
// //                         <p>Code: ${c.code}</p>
// //                         <p>Duration: ${c.duration}</p>
// //                     </div>
// //                 `;
// //             });
// //         });
// // }
// function openAddCourseModal() {
//     document.getElementById("addCourseModal").style.display = "flex";
// }
// function closeCourseModal() {
//     document.getElementById("addCourseModal").style.display = "none";
//     document.getElementById("addCourseForm").reset();
// }


// function loadFacultyCourses() {
//     fetch(`${API_BASE}/faculty/courses`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(res => res.json())
//         .then(result => {
//             const container = document.getElementById("facultyCoursesContainer");
//             container.innerHTML = "";

//             if (!result.success || result.data.length === 0) {
//                 container.innerHTML = "<p>No courses assigned yet</p>";
//                 return;
//             }

//             result.data.forEach(course => {
//                 container.innerHTML += `
//                     <div class="info-card">
//                         <h3>${course.cname}</h3>
//                         <p><b>Code:</b> ${course.code}</p>
//                         <p><b>Duration:</b> ${course.duration}</p>
//                         <p><b>Price:</b> ${course.price}</p>

//                         <div class="card-actions">
//                             <button class="btn-secondary"
//                                 onclick='openEditCourseModal(${JSON.stringify(course)})'>
//                                 Edit
//                             </button>
//                             <button class="btn-delete1"
//                                 onclick="deleteCourse(${course.CID})">
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 `;
//             });
//         })
//         .catch(err => console.error("Load faculty courses error:", err));
// }

// // 🔹 SAVE COURSE
// // function saveCourse() {
// //     const data = {
// //         cname: courseName.value,
// //         code: courseCode.value,
// //         duration: courseDuration.value,
// //         price: coursePrice.value,
// //         description: courseDescription.value
// //     };

// //     fetch(`${API_BASE}/faculty/courses/add`, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`
// //         },
// //         body: JSON.stringify(data)
// //     })
// //         .then(res => res.json())
// //         .then(result => {
// //             if (result.success) {
// //                 alert("Course added successfully");
// //                 closeCourseModal();
// //                 loadFacultyCourses();
// //                 // fetchAllCourses();
// //             } else {
// //                 alert(result.message || "Failed to add course");
// //             }
// //         });
// // }
// document.getElementById("addCourseForm").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const data = {
//         cname: courseName.value.trim(),
//         code: courseCode.value.trim(),
//         duration: courseDuration.value.trim(),
//         price: coursePrice.value,
//         description: courseDescription.value.trim()
//     };

//     if (!Object.values(data).every(v => v)) {
//         alert("All fields are required");
//         return;
//     }

//     const res = await fetch(`${API_BASE}/faculty/courses/add`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(data)
//     });

//     const result = await res.json();

//     if (result.success) {
//         alert("Course added successfully");
//         closeCourseModal();
//         loadFacultyCourses();
//     } else {
//         alert(result.message || "Failed to add course");
//     }
// });

// // Edit Course
// function openEditCourseModal(course) {
//     document.getElementById("editCourseModal").style.display = "flex";

//     editCourseId.value = course.CID;
//     editCourseName.value = course.cname;
//     editCourseCode.value = course.code;
//     editCourseDuration.value = course.duration;
//     editCoursePrice.value = course.price;
//     editCourseDescription.value = course.description;
// }

// // Update Course
// document.getElementById("editCourseForm").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const id = editCourseId.value;

//     const data = {
//         cname: editCourseName.value.trim(),
//         code: editCourseCode.value.trim(),
//         duration: editCourseDuration.value.trim(),
//         price: editCoursePrice.value,
//         description: editCourseDescription.value.trim()
//     };

//     const res = await fetch(`${API_BASE}/faculty/courses/update/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(data)
//     });

//     const result = await res.json();

//     if (result.success) {
//         alert("Course updated");
//         document.getElementById("editCourseModal").style.display = "none";
//         loadFacultyCourses();
//     } else {
//         alert(result.message || "Update failed");
//     }
// });

// // Delete Course
// async function deleteCourse(courseId) {
//     if (!confirm("Are you sure you want to delete this course?")) return;

//     const res = await fetch(`${API_BASE}/faculty/courses/delete/${courseId}`, {
//         method: "DELETE",
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });

//     const result = await res.json();

//     if (result.success) {
//         alert("Course deleted");
//         loadFacultyCourses();
//     } else {
//         alert(result.message || "Delete failed");
//     }
// }










/* ================= LOAD COURSES ================= */
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/faculty/courses`, {
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

// ================= COURSE CARD =================
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

/* ================= ADD COURSE ================= */
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

/* ================= EDIT COURSE ================= */
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

/* ================= DELETE COURSE ================= */
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



// document.addEventListener("DOMContentLoaded", loadCourseCount);
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

// document.addEventListener("DOMContentLoaded", loadFacultyCount);
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

// document.addEventListener("DOMContentLoaded", loadStudentCount);


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

// document.addEventListener("DOMContentLoaded", loadStudentDetails);

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

// Faculty Details

document.getElementById('facultyDetailsForm').addEventListener('submit', submitDetails);

function submitDetails(e) {
    e.preventDefault();

    const nameIn = document.getElementById('fname');
    const genderIn = document.getElementById('fgender');
    const dobIn = document.getElementById('dob');
    const phoneIn = document.getElementById('fphone');
    const addressIn = document.getElementById('faddress');
    const departmentIn = document.getElementById('department');
    const qualificationIn = document.getElementById('qualification');
    const experienceIn = document.getElementById('experience');

    const name = nameIn.value.trim();
    const gender = genderIn.value.trim();
    const dob = dobIn.value.trim();
    const phone = phoneIn.value.trim();
    const address = addressIn.value.trim();
    const department = departmentIn.value.trim();
    const qualification = qualificationIn.value.trim();
    const experience = experienceIn.value.trim();

    let valid = true;

    setInputError(nameIn, false);
    setInputError(genderIn, false);
    setInputError(dobIn, false);
    setInputError(phoneIn, false);
    setInputError(addressIn, false);
    setInputError(departmentIn, false);
    setInputError(qualificationIn, false);
    setInputError(experienceIn, false);

    // Validation
    if (!name) { setInputError(nameIn, true, "Name required"); valid = false; }
    if (!gender) { setInputError(genderIn, true, "Gender required"); valid = false; }
    if (!dob) { setInputError(dobIn, true, "Date of Birth required"); valid = false; }
    if (!phone) { setInputError(phoneIn, true, "Phone required"); valid = false; }
    if (!address) { setInputError(addressIn, true, "Address required"); valid = false; }
    if (!department) { setInputError(departmentIn, true, "Department required"); valid = false; }
    if (!qualification) { setInputError(qualificationIn, true, "Qualification required"); valid = false; }
    if (!experience) { setInputError(experienceIn, true, "Experience required"); valid = false; }

    if (!valid) return;

    // Data for backend
    const data = {
        fname: name,
        gender: gender,
        dob: dob,
        phone: phone,
        address: address,
        department: department,
        qualification: qualification,
        experience_years: experience
    };

    const token = localStorage.getItem('token');

    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "../Login.html";
        return;
    }

    fetch(`${API_BASE}/faculty/details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                loggedInUser = result.user;
                FindName();
                alert("Details updated successfully");
                document.getElementById('facultyDetailsForm').reset();

                // Refresh Account Settings immediately
                loadAccountSettings();

            } else {
                alert("Failed to submit details: " + result.message);
            }
        })
    // .catch(err => {
    //     console.error("Error adding faculty: ", err);
    //     alert("Failed to submit details");
    // });
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

const token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "../../component/Login.html";
}

// Sections
// fetch(`${API_BASE}/faculty/sections`, {
//     method: 'GET',
//     headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//     }
// })
//     .then(res => res.json())
//     .then(result => {
//         if (result.success) {
//             result.data.forEach(section => {
//                 console.log(section);
//                 // render section card here
//             });
//         }
//     });

// function loadSections() {
//     fetch(`${API_BASE}/faculty/sections`, {
//         headers: { Authorization: `Bearer ${token}` }
//     })
//         .then(res => res.json())
//         .then(result => {
//             if (!result.success) return;

//             const container = document.getElementById("sectionsContainer");
//             container.innerHTML = "";

//             result.data.forEach(sec => {
//                 container.innerHTML += `
//             <div class="info-card">
//                 <h3>${sec.section_name}</h3>
//                 <p>Students: ${sec.student_count}</p>
//                 <button class="btn-secondary"
//                     onclick="viewSection(${sec.section_id})">
//                     View Details
//                 </button>
//             </div>`;
//             });
//         });
// }
//
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


