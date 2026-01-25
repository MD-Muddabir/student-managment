// DOM Elements
const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

// --- Animation / State Switching ---
if (signUpButton) {
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
}

if (signInButton) {
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}

// --- Registration Logic ---
const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        validateRegistration();
    });

    // Clear errors on input
    regForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

function validateRegistration() {
    let valid = true;

    // Validate Fields
    valid &= validateRequired('firstName', 'Type your First Name');
    valid &= validateRequired('lastName', 'Type your Last Name');
    valid &= validateRequired('dob', 'Select your Birthday');
    valid &= validateGender();
    valid &= validateEmail('regEmail');
    valid &= validatePassword('regPassword');
    valid &= validatePhone('phone');
    valid &= validateRequired('subject', 'Choose a subject');

    if (valid) {
        // Success
        alert("✅ Registration Successful!");
        regForm.reset();
        // Slide back to login automatically
        container.classList.remove("right-panel-active");
    }
}

// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        validateLogin();
    });

    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

function validateLogin() {
    let valid = true;
    valid &= validateEmail('loginEmail');
    valid &= validateRequired('loginPassword', 'Enter Password');

    if (valid) {
        // Mock Login Success
        alert("✅ Login successful");
        loginForm.reset();
        // Redirect: window.location.href = "../index.html";
    }
}

// --- Validation Helpers ---

function validateRequired(id, msg) {
    const input = document.getElementById(id);
    if (!input) return true; // Safety
    const val = input.value.trim();
    if (val === "") {
        setError(input, msg);
        return false;
    }
    return true;
}

function validateEmail(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    const val = input.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === "") {
        setError(input, "Email is required");
        return false;
    } else if (!pattern.test(val)) {
        setError(input, "Invalid email address");
        return false;
    }
    return true;
}

function validatePhone(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    const val = input.value.trim();
    // Simple 10 digit check
    const pattern = /^[0-9]{10}$/;

    if (val === "" || !pattern.test(val)) {
        setError(input, "Enter a valid 10-digit phone");
        return false;
    }
    return true;
}

function validateGender() {
    const genderGroup = document.getElementsByName('gender');
    let checked = false;
    for (const rb of genderGroup) {
        if (rb.checked) checked = true;
    }

    const container = document.querySelector('.gender-group');
    const errorText = document.getElementById('genderError');

    if (!checked) {
        if (errorText) {
            errorText.style.display = "block";
            errorText.innerText = "Please select gender";
        }
        return false;
    } else {
        if (errorText) errorText.style.display = "none";
        return true;
    }
}

function setError(input, msg) {
    input.classList.add('error');
    const group = input.closest('.input-group');
    if (group) {
        const err = group.querySelector('.error-text');
        if (err) {
            err.innerText = msg;
            err.style.display = 'block';
        }
    }
}

function clearError(input) {
    input.classList.remove('error');
    const group = input.closest('.input-group');
    if (group) {
        const err = group.querySelector('.error-text');
        if (err) {
            err.style.display = 'none';
        }
    }
}

// --- Student Management Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) return; // Only run if on the management page

    // Mock Data
    let students = [
        { id: 1, name: "Thomas Hardy", email: "thomashardy@mail.com", subject: "Mathematics", birthday: "2005-05-15" },
        { id: 2, name: "Dominique Perrier", email: "dominiqueperrier@mail.com", subject: "Physics", birthday: "2004-03-22" },
        { id: 3, name: "Maria Anders", email: "mariaanders@mail.com", subject: "Chemistry", birthday: "2005-01-10" },
        { id: 4, name: "Fran Wilson", email: "franwilson@mail.com", subject: "Computer Science", birthday: "2003-11-20" },
        { id: 5, name: "Martin Blank", email: "martinblank@mail.com", subject: "English", birthday: "2004-07-05" }
    ];

    let currentPage = 1;
    const rowsPerPage = 5;
    let selectedIds = [];
    let deleteId = null; // For single delete

    // Initialization
    renderTable();

    // Event Listeners
    const addNewBtn = document.getElementById('addNewBtn');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', () => {
            $('#addEmployeeModal').modal('show');
        });
    }

    const multiDeleteBtn = document.getElementById('multiDeleteBtn');
    if (multiDeleteBtn) {
        multiDeleteBtn.addEventListener('click', () => {
            if (selectedIds.length > 0) {
                deleteId = null; // reset single delete
                $('#deleteEmployeeModal').modal('show');
            } else {
                alert("Please select at least one student to delete.");
            }
        });
    }

    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.student-checkbox');
            checkboxes.forEach(cb => {
                cb.checked = e.target.checked;
                handleCheckboxChange(cb);
            });
        });
    }

    // Add Student
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newStudent = {
                id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
                name: document.getElementById('addName').value,
                email: document.getElementById('addEmail').value,
                subject: document.getElementById('addSubject').value,
                birthday: document.getElementById('addDob').value
            };
            students.push(newStudent);
            $('#addEmployeeModal').modal('hide');
            addStudentForm.reset();
            renderTable();
        });
    }

    // Edit Student
    const editStudentForm = document.getElementById('editStudentForm');
    if (editStudentForm) {
        editStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('editId').value);
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) {
                students[index].name = document.getElementById('editName').value;
                students[index].email = document.getElementById('editEmail').value;
                students[index].subject = document.getElementById('editSubject').value;
                students[index].birthday = document.getElementById('editDob').value;

                $('#editEmployeeModal').modal('hide');
                renderTable();
            }
        });
    }

    // Delete Student (Confirm)
    const deleteStudentForm = document.getElementById('deleteStudentForm');
    if (deleteStudentForm) {
        deleteStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (deleteId) {
                // Single Delete
                students = students.filter(s => s.id !== deleteId);
            } else {
                // Multi Delete
                students = students.filter(s => !selectedIds.includes(s.id));
            }
            deleteId = null;
            selectedIds = [];
            if (selectAll) selectAll.checked = false;
            $('#deleteEmployeeModal').modal('hide');
            renderTable();
        });
    }

    // Functions
    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = students.slice(start, end);

        if (paginatedItems.length === 0 && currentPage > 1) {
            currentPage--;
            renderTable();
            return;
        }

        paginatedItems.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" class="student-checkbox" id="checkbox${student.id}" value="${student.id}" ${selectedIds.includes(student.id) ? 'checked' : ''}>
                        <label for="checkbox${student.id}"></label>
                    </span>
                </td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.subject}</td>
                <td>${student.birthday}</td>
                <td>
                    <a href="#" class="edit" data-id="${student.id}"><i class="fas fa-pencil-alt" data-toggle="tooltip" title="Edit"></i></a>
                    <a href="#" class="delete" data-id="${student.id}"><i class="fas fa-trash" data-toggle="tooltip" title="Delete"></i></a>
                </td>
            `;
            tableBody.appendChild(row);

            // Bind events for this row
            const checkbox = row.querySelector('.student-checkbox');
            checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));

            const editBtn = row.querySelector('.edit');
            editBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                loadEditData(student.id);
            });

            const deleteBtn = row.querySelector('.delete');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                deleteId = student.id;
                $('#deleteEmployeeModal').modal('show');
            });
        });

        updatePagination();
        updateEntryInfo();
    }

    function handleCheckboxChange(checkbox) {
        const id = parseInt(checkbox.value);
        if (checkbox.checked) {
            if (!selectedIds.includes(id)) selectedIds.push(id);
        } else {
            selectedIds = selectedIds.filter(item => item !== id);
        }
    }

    function loadEditData(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('editId').value = student.id;
            document.getElementById('editName').value = student.name;
            document.getElementById('editEmail').value = student.email;
            document.getElementById('editPassword').value = student.password;
            document.getElementById('editSubject').value = student.subject;
            document.getElementById('editDob').value = student.birthday;
            $('#editEmployeeModal').modal('show');
        }
    }

    function updateEntryInfo() {
        const total = students.length;
        const start = (currentPage - 1) * rowsPerPage + 1;
        let end = start + rowsPerPage - 1;
        if (end > total) end = total;

        const currentCountEl = document.getElementById('currentCount');
        const totalCountEl = document.getElementById('totalCount');

        if (currentCountEl) {
            if (total === 0) currentCountEl.innerText = '0-0';
            else currentCountEl.innerText = `${start}-${end}`;
        }
        if (totalCountEl) totalCountEl.innerText = total;
    }

    function updatePagination() {
        const totalPages = Math.ceil(students.length / rowsPerPage);
        const pagination = document.getElementById('paginationControls');
        if (!pagination) return;
        pagination.innerHTML = '';

        // Previous
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a href="#" class="page-link">Previous</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        pagination.appendChild(prevLi);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${currentPage === i ? 'active' : ''}`;
            li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderTable();
            });
            pagination.appendChild(li);
        }

        // Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a href="#" class="page-link">Next</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        pagination.appendChild(nextLi);
    }
});

// --- Navigation Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Nav Links
    const navLinks = {
        'nav-home': 'home-section',
        'nav-about': 'about-section',
        'nav-database': 'database-section',
        'nav-profile': 'profile-section'
    };

    Object.keys(navLinks).forEach(navId => {
        const link = document.getElementById(navId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active class from all links
                document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Add active class to clicked link parent
                link.parentElement.classList.add('active');

                // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.style.display = 'none';
                });

                // Show target section
                const targetId = navLinks[navId];
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            });
        }
    });

    // Logout Logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to logout?")) {
                alert("Logged out successfully!");
                // Assuming script.js is in frontend/js/, adjust relative path
                window.location.href = "./component/Login.html";
            }
        });
    }
});











// ***********************************  FETCH STUDENT DATA   **************************************************

fetch("http://localhost:3000/students")
    .then(res => res.json())
    .then(result => {
        if (!result.success) {
            alert("Failed to load students");
            return;
        }

        const tbody = document.getElementById("studentTableBody");
        tbody.innerHTML = "";

        result.data.forEach(student => {
            const tr = document.createElement("tr");
            const row = `
            <tr>
                <td>${student.SID}</td>
                <td>${student.sname}</td>
                <td>${student.semail}</td>
                <td>${student.gender}</td>
                <td>${formatDOB(student.dob)}</td>
                <td>${student.sphone}</td>
                <td>${student.Cname}</td>
                <td>${student.created_at}</td>
                
            </tr>
        `;
            tr.innerHTML = row;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        console.error(err);
        alert("Error fetching data");
    });

function formatDOB(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN");
}


