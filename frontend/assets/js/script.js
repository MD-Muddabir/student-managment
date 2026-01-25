/* ========================================
   STUDENT MANAGEMENT SYSTEM - SCRIPT
   Interactive Dashboard Functionality
   ======================================== */

// ========== GLOBAL STATE ==========
let currentSection = 'dashboard';
let studentsData = [];

// ========== DOM ELEMENTS ==========
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutBtn');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeNavigation();
    initializeLogout();
    fetchStudents();
    updateAnalytics();
    
    // Start clock update
    setInterval(updateClock, 1000);
});

// ========== CLOCK FUNCTIONALITY ==========
function initializeClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    
    // Time
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    // Date
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Update DOM
    const timeDisplay = document.getElementById('currentTime');
    const dateDisplay = document.getElementById('currentDate');
    
    if (timeDisplay) timeDisplay.textContent = timeString;
    if (dateDisplay) dateDisplay.textContent = dateString;
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    // Menu toggle for mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);
            
            // Update active state
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function switchSection(sectionName) {
    currentSection = sectionName;
    
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
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
    
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Faculty Portal';
    }
}

// ========== LOGOUT ==========
function initializeLogout() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                // Clear any stored data
                localStorage.clear();
                sessionStorage.clear();
                
                // Redirect to login page
                window.location.href = './component/Login.html';
            }
        });
    }
}

// ========== STUDENTS DATA ==========
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/students');
        const result = await response.json();
        
        if (result.success) {
            studentsData = result.data;
            renderStudentsTable();
            updateAnalytics();
        } else {
            console.error('Failed to fetch students:', result.message);
            // Show sample data if API fails
            loadSampleData();
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        // Show sample data if API fails
        loadSampleData();
    }
}

function loadSampleData() {
    studentsData = [
        {
            SID: 1,
            sname: 'John Doe',
            semail: 'john@example.com',
            gender: 'Male',
            dob: '2000-05-15',
            sphone: '1234567890',
            Cname: 'Computer Science'
        },
        {
            SID: 2,
            sname: 'Jane Smith',
            semail: 'jane@example.com',
            gender: 'Female',
            dob: '2001-08-22',
            sphone: '0987654321',
            Cname: 'Mathematics'
        },
        {
            SID: 3,
            sname: 'Alice Johnson',
            semail: 'alice@example.com',
            gender: 'Female',
            dob: '2000-12-10',
            sphone: '5551234567',
            Cname: 'Physics'
        },
        {
            SID: 4,
            sname: 'Bob Williams',
            semail: 'bob@example.com',
            gender: 'Male',
            dob: '1999-03-18',
            sphone: '5559876543',
            Cname: 'Chemistry'
        },
        {
            SID: 5,
            sname: 'Emma Brown',
            semail: 'emma@example.com',
            gender: 'Female',
            dob: '2001-07-25',
            sphone: '5555555555',
            Cname: 'Biology'
        },
        {
            SID: 6,
            sname: 'Michael Davis',
            semail: 'michael@example.com',
            gender: 'Male',
            dob: '2000-11-30',
            sphone: '5554443333',
            Cname: 'English'
        },
        {
            SID: 7,
            sname: 'Sarah Wilson',
            semail: 'sarah@example.com',
            gender: 'Female',
            dob: '2001-02-14',
            sphone: '5556667777',
            Cname: 'History'
        }
    ];
    
    renderStudentsTable();
    updateAnalytics();
}

function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (studentsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">No students found</td>
            </tr>
        `;
        return;
    }
    
    studentsData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="student-checkbox" data-id="${student.SID}">
            </td>
            <td>${student.SID}</td>
            <td>${student.sname}</td>
            <td>${student.semail}</td>
            <td>${student.gender || 'N/A'}</td>
            <td>${formatDate(student.dob)}</td>
            <td>${student.sphone || 'N/A'}</td>
            <td>${student.Cname || 'N/A'}</td>
            <td>
                <button class="btn-icon" onclick="editStudent(${student.SID})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteStudent(${student.SID})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ========== ANALYTICS ==========
function updateAnalytics() {
    // Count students
    const totalStudents = studentsData.length;
    
    // Update dashboard cards
    const studentsCard = document.getElementById('totalStudents');
    const teachersCard = document.getElementById('totalTeachers');
    const CoursesCard = document.getElementById('totalCoursses');
    const totalCard = document.getElementById('totalUsers');
    
    if (studentsCard) studentsCard.textContent = totalStudents;
    if (teachersCard) teachersCard.textContent = '2'; // Static for now
    if (CoursesCard) CoursesCard.textContent = '1'; // Static for now
    if (totalCard) totalCard.textContent = totalStudents + 3; // Total
}

// ========== STUDENT CRUD OPERATIONS ==========
function editStudent(id) {
    const student = studentsData.find(s => s.SID === id);
    if (!student) {
        alert('Student not found!');
        return;
    }
    
    // For now, just show an alert
    alert(`Edit Student: ${student.sname}\n\nThis feature will open an edit modal.`);
    
    // TODO: Implement edit modal
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/students/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.message === 'Student deleted') {
            alert('Student deleted successfully!');
            fetchStudents(); // Refresh the list
        } else {
            alert('Failed to delete student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
    }
}

// Add Student Button
const addStudentBtn = document.getElementById('addStudentBtn');
if (addStudentBtn) {
    addStudentBtn.addEventListener('click', () => {
        alert('Add Student feature coming soon!\n\nThis will open a modal to add a new student.');
        // TODO: Implement add student modal
    });
}

// ========== SELECT ALL CHECKBOX ==========
const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
        });
    });
}

// ========== ACTIVITIES FUNCTIONALITY ==========
const activityInput = document.querySelector('.activity-input input');
const btnAdd = document.querySelector('.btn-add');
const activitiesList = document.getElementById('activitiesList');

if (btnAdd && activityInput) {
    btnAdd.addEventListener('click', addActivity);
    activityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addActivity();
        }
    });
}

function addActivity() {
    const text = activityInput.value.trim();
    if (!text) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <span>${text}</span>
        <div class="activity-actions">
            <button class="btn-check" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn-trash" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    activitiesList.appendChild(activityItem);
    activityInput.value = '';
}

// ========== ANNOUNCEMENTS ==========
const btnPost = document.querySelector('.btn-post');
if (btnPost) {
    btnPost.addEventListener('click', () => {
        const announcement = prompt('Enter announcement text:');
        if (!announcement) return;
        
        const announcementsList = document.getElementById('announcementsList');
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: '2-digit' 
        });
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        const newAnnouncement = document.createElement('div');
        newAnnouncement.className = 'announcement-item';
        newAnnouncement.innerHTML = `
            <div class="announcement-header">
                <h4>New Announcement</h4>
                <button class="btn-delete" onclick="this.parentElement.parentElement.remove()">Delete</button>
            </div>
            <p class="announcement-text">${announcement}</p>
            <p class="announcement-meta">Mark Calendario on ${dateStr} at ${timeStr}</p>
        `;
        
        announcementsList.insertBefore(newAnnouncement, announcementsList.firstChild);
    });
}

// ========== RESPONSIVE SIDEBAR ==========
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('active');
    }
});

// ========== SMOOTH ANIMATIONS ==========
// Add entrance animations to cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.analytics-card, .dashboard-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// ========== GREETING BASED ON TIME ==========
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    
    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    }
    
    const greetingCard = document.querySelector('.greeting-card h3');
    if (greetingCard) {
        const userName = document.getElementById('sidebarUserName')?.textContent.split(' ')[0] || 'User';
        greetingCard.textContent = `${greeting}, ${userName}!`;
    }
}

// Update greeting on load
updateGreeting();

// ========== CONSOLE LOG ==========
console.log('%c🎓 Student Management System', 'color: #4f7cff; font-size: 20px; font-weight: bold;');
console.log('%cDashboard loaded successfully!', 'color: #00c853; font-size: 14px;');
console.log('%cCurrent Section:', currentSection);

// ========== EXPORT FUNCTIONS FOR HTML ONCLICK ==========
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
