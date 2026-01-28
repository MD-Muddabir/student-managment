/* ========================================
   STUDENT MANAGEMENT SYSTEM - SCRIPT
   Interactive Dashboard Functionality
   ======================================== */
'use strict';

// ========== GLOBAL STATE ==========
let currentSection = 'dashboard';
let studentsData = [];
let loggedInUser = null;

// ========== DOM ELEMENTS ==========
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
    // fetchStudents(); // This handles updating analytics too

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
        fetch(`http://localhost:3000/profile/${userId}`)
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
}

function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Faculty Portal',
        'students': 'Manage Students',
        'personnel': 'Add Personnel',
        'sections': 'Manage Sections',
        'subjects': 'Manage Subjects',
        'strands': 'Manage Strands',
        'teachers': 'Manage Teachers',
        'inactive': 'Inactive Students',
        'account': 'Account Settings'
    };
    if (pageTitle) pageTitle.textContent = titles[section] || 'Faculty Portal';
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

// ========== STUDENTS DATA & ANALYTICS ==========
// async function fetchStudents() {
//     try {
//         const response = await fetch('http://localhost:3000/students');
//         const result = await response.json();

//         if (result.success) {
//             studentsData = result.data;
//             renderStudentsTable();
//             updateAnalytics(); // Update counts after fetching data
//         } else {
//             console.error('Failed to fetch students:', result.message);
//             loadSampleData();
//         }
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         loadSampleData();
//     }
// }

// function updateAnalytics() {
//     // Calculate total students from the fetched data
//     const totalStudentsCount = studentsData.length;

//     // Update the DOM element
//     const totalStudentsEl = document.getElementById('totalStudents');
//     if (totalStudentsEl) {
//         totalStudentsEl.textContent = totalStudentsCount;
//     }

//     // Static placeholders for other stats
//     const teachersCard = document.getElementById('totalTeachers');
//     const coursesCard = document.getElementById('totalCoursses');

//     if (teachersCard) teachersCard.textContent = '2';
//     if (coursesCard) coursesCard.textContent = '1';
// }

// function loadSampleData() {
//     studentsData = [
//         { SID: 1, sname: 'John Doe', semail: 'john@example.com', gender: 'Male', dob: '2000-05-15', sphone: '1234567890', Cname: 'Computer Science' },
//         // ... (keep sample data concise or expanded as needed)
//     ];
//     renderStudentsTable();
//     updateAnalytics();
// }

// function renderStudentsTable() {
//     const tbody = document.getElementById('studentsTableBody');
//     if (!tbody) return;

//     tbody.innerHTML = '';

//     if (studentsData.length === 0) {
//         tbody.innerHTML = `<tr><td colspan="9" class="text-center">No students found</td></tr>`;
//         return;
//     }

//     studentsData.forEach(student => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td><input type="checkbox" class="student-checkbox" data-id="${student.SID}"></td>
//             <td>${student.SID}</td>
//             <td>${student.sname}</td>
//             <td>${student.semail}</td>
//             <td>${student.gender || 'N/A'}</td>
//             <td>${formatDate(student.dob)}</td>
//             <td>${student.sphone || 'N/A'}</td>
//             <td>${student.Cname || 'N/A'}</td>
//             <td>
//                 <button class="btn-icon" onclick="editStudent(${student.SID})"><i class="fas fa-edit"></i></button>
//                 <button class="btn-icon delete" onclick="deleteStudent(${student.SID})"><i class="fas fa-trash"></i></button>
//             </td>
//         `;
//         tbody.appendChild(row);
//     });
// }

// ========== CRUD OPERATIONS ==========
function editStudent(id) {
    const student = studentsData.find(s => s.SID === id);
    if (!student) return alert('Student not found!');
    alert(`Edit Student: ${student.sname}\n\nFeature coming soon.`);
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) { // consistent with backend response
            alert('Student deleted successfully!');
            fetchStudents();
        } else {
            // Also handle message-based success check if backend is inconsistent
            if (result.message === 'Student deleted' || result.message === 'Student deleted successfully') {
                alert('Student deleted successfully!');
                fetchStudents();
            } else {
                alert('Failed to delete student: ' + result.message);
            }
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
    }
}

// ========== UTILS ==========
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ========== UI INTERACTION (Activities, Announcements, etc.) ==========
const addStudentBtn = document.getElementById('addStudentBtn');
if (addStudentBtn) {
    addStudentBtn.addEventListener('click', () => alert('Add Student feature coming soon!'));
}

const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = e.target.checked);
    });
}

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

// Announcements
const btnPost = document.querySelector('.btn-post');
const announcementsList = document.getElementById('announcementsList');
if (btnPost && announcementsList) {
    btnPost.addEventListener('click', () => {
        const text = prompt('Enter announcement text:');
        if (!text) return;
        const now = new Date();
        const div = document.createElement('div');
        div.className = 'announcement-item';
        div.innerHTML = `
            <div class="announcement-header">
                <h4>New Announcement</h4>
                <button class="btn-delete" onclick="this.closest('.announcement-item').remove()">Delete</button>
            </div>
            <p class="announcement-text">${text}</p>
            <p class="announcement-meta">Posted on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</p>
        `;
        announcementsList.insertBefore(div, announcementsList.firstChild);
    });
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

// Exports
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

console.log('%c🎓 Student Management System Loaded', 'color: #4f7cff; font-weight: bold;');
