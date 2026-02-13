/* ========================================
   STUDENT MANAGEMENT SYSTEM - SCRIPT
   Interactive Dashboard Functionality
   ======================================== */
'use strict';

// ========== GLOBAL STATE ==========
let currentSection = 'dashboard';
let studentsData = [];
let loggedInUser = null;
let currentStudentId = null;

// ========== DOM ELEMENTS ==========
const API_BASE = 'http://localhost:3000';

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutBtn');


// ========== CONSTANTS ==========
// Determine correct path to login based on current directory depth
const isInDashboardDir = window.location.pathname.includes('/dashboards/');
const LOGIN_PATH = isInDashboardDir ? '../../component/Login.html' : './component/Login.html';

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadUserData();
    initializeClock();
    initializeNavigation();
    initializeLogout();

    const params = new URLSearchParams(window.location.search);
    currentStudentId = params.get('id');

    if (!currentStudentId) {
        console.error("Student ID missing in URL");
        return;
    }

    // fetchEnrolledCourses();
    // fetchAllCourses();
    // Start clock update
    setInterval(updateClock, 1000);
});

// ========== AUTHENTICATION ==========
function checkAuthentication() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        alert('Please login to access the dashboard');
        window.location.href = LOGIN_PATH;
    }
}

function loadUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        fetch(`${API_BASE}/profile/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loggedInUser = data.user;
                    updateUserDisplay();
                } else {
                    console.error('Failed to load user profile');
                    alert('Session expired or invalid user');
                    window.location.href = LOGIN_PATH;
                }
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }
}

function updateUserDisplay() {
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

    // Account Settings form
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsPhone = document.getElementById('settingsPhone');
    const settingsRole = document.getElementById('settingsRole');

    if (settingsName) settingsName.value = loggedInUser.name;
    if (settingsEmail) settingsEmail.value = loggedInUser.email;
    if (settingsPhone) settingsPhone.value = loggedInUser.phone || 'N/A';
    if (settingsRole) settingsRole.value = capitalize(loggedInUser.role);

    updateGreeting();

    console.log('✅ User data loaded:', loggedInUser);
}

// ========== CLOCK FUNTIONALITY ==========
function initializeClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const timeDisplay = document.getElementById('currentTime');
    const dateDisplay = document.getElementById('currentDate');

    if (timeDisplay) timeDisplay.textContent = timeString;
    if (dateDisplay) dateDisplay.textContent = dateString;
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    if (menuToggle) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);

            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            if (window.innerWidth <= 992) sidebar.classList.remove('active');
        });
    });
}

function switchSection(sectionName) {
    currentSection = sectionName;
    contentSections.forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) targetSection.classList.add('active');

    updatePageTitle(sectionName);
    // 🔒 SAFETY: hide course form unless Student Details
    if (sectionName !== 'student-details') {
        const courseForm = document.getElementById('courseDetailsFormContainer');
        if (courseForm) courseForm.style.display = 'none';
    }
}

function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Student Portal',
        'students': 'Manage Students',
        'personnel': 'Add Personnel',
        'sections': 'Manage Sections',
        'subjects': 'Manage Subjects',
        'strands': 'Manage Strands',
        'teachers': 'Manage Teachers',
        'inactive': 'Inactive Students',
        'account': 'Account Settings'
    };
    if (pageTitle) pageTitle.textContent = titles[section] || 'Student Portal';
}

// ========== LOGOUT ==========
function initializeLogout() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
                window.location.href = LOGIN_PATH;
            }
        });
    }
}

// // ========== CRUD OPERATIONS ==========
// function editStudent(id) {
//     const student = studentsData.find(s => s.SID === id);
//     if (!student) return alert('Student not found!');
//     alert(`Edit Student: ${student.sname}\n\nFeature coming soon.`);
// }

// async function deleteStudent(id) {
//     if (!confirm('Are you sure you want to delete this student?')) return;

//     try {
//         const response = await fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' });
//         const result = await response.json();

//         if (result.success) { // consistent with backend response
//             alert('Student deleted successfully!');
//             fetchStudents();
//         } else {
//             // Also handle message-based success check if backend is inconsistent
//             if (result.message === 'Student deleted' || result.message === 'Student deleted successfully') {
//                 alert('Student deleted successfully!');
//                 fetchStudents();
//             } else {
//                 alert('Failed to delete student: ' + result.message);
//             }
//         }
//     } catch (error) {
//         console.error('Error deleting student:', error);
//         alert('Error deleting student. Please try again.');
//     }
// }

// ========== UTILS ==========
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// // ========== UI INTERACTION (Activities, Announcements, etc.) ==========
// const addStudentBtn = document.getElementById('addStudentBtn');
// if (addStudentBtn) {
//     addStudentBtn.addEventListener('click', () => alert('Add Student feature coming soon!'));
// }

// const selectAllCheckbox = document.getElementById('selectAll');
// if (selectAllCheckbox) {
//     selectAllCheckbox.addEventListener('change', (e) => {
//         document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = e.target.checked);
//     });
// }

// Activities
const activityInput = document.querySelector('.activity-input input');
const btnAdd = document.querySelector('.btn-add');
const activitiesList = document.getElementById('activitiesList');

if (btnAdd && activityInput && activitiesList) {
    const addActivity = () => {
        const text = activityInput.value.trim();
        if (!text) return;
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `<span>${text}</span>
            <div class="activity-actions">
                <button class="btn-check" onclick="this.closest('.activity-item').remove()"><i class="fas fa-check"></i></button>
                <button class="btn-trash" onclick="this.closest('.activity-item').remove()"><i class="fas fa-trash"></i></button>
            </div>`;
        activitiesList.appendChild(item);
        activityInput.value = '';
    };
    btnAdd.addEventListener('click', addActivity);
    activityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addActivity(); });
}

// Responsive Sidebar
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) sidebar.classList.remove('active');
});

// Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const greetingCard = document.querySelector('.greeting-card h3');
    if (greetingCard) {
        const email = document.getElementById('sidebarUserName')?.textContent.split(' ')[0] || 'User';
        greetingCard.textContent = `${greeting}, ${email}!`;
    }
}

// Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.analytics-card, .dashboard-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// // Exports
// window.editStudent = editStudent;
// window.deleteStudent = deleteStudent;

console.log('%c🎓 Student Management System Loaded', 'color: #4f7cff; font-weight: bold;');


