// --- Elements ---
const container = document.getElementById('container');
const signUpGhost = document.getElementById('signUpGhost'); // Button in overlay (Right)
const signInGhost = document.getElementById('signInGhost'); // Button in overlay (Left)
const slideSignupBtn = document.getElementById('slide-signup-btn'); // Link in Login Form
const slideLoginBtn = document.getElementById("slide-login-btn");

// --- Transitions ---
// Trigger slide to Sign Up
const activateSignUp = () => {
    container.classList.add("right-panel-active");
};

// Trigger slide to Login
const activateSignIn = () => {
    container.classList.remove("right-panel-active");
};

signUpGhost.addEventListener('click', activateSignUp);
signInGhost.addEventListener('click', activateSignIn);


// Also attach the small text link in the form to the slide action
slideSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    activateSignUp();
});
slideLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    activateSignIn();
});





// --- Form Logic & Validation ---

function setInputError(input, isError, msg) {
    const group = input.closest('.input-group');
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



// --- Password Toggle Logic ---
document.querySelectorAll('.password-toggle').forEach(eyeIcon => {
    eyeIcon.addEventListener('mouseenter', () => {
        const targetId = eyeIcon.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (targetInput) targetInput.type = 'text';
    });

    eyeIcon.addEventListener('mouseleave', () => {
        const targetId = eyeIcon.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (targetInput) targetInput.type = 'password';
    });
});



// ***********************************  Sign up STUDENT (POST) **************************************************

// --- Sign Up Logic ---

document.getElementById("signupForm").addEventListener("submit", signUp);

function signUp(e) {
    e.preventDefault();


    // Inputs
    const userIn = document.getElementById("uname");
    const emailIn = document.getElementById("uemail");
    const passIn = document.getElementById("upassword");
    // const dobIn = document.getElementById("udob");
    const phoneIn = document.getElementById("uphone");
    const role = "student";
    // const roleIn = document.getElementById("signupRole");
    // const genderError = document.getElementById("genderError");

    // Values
    const name = userIn.value.trim();
    const email = emailIn.value.trim();
    const password = passIn.value.trim();
    // const dob = dobIn.value.trim();
    const phone = phoneIn.value.trim();
    // const role = roleIn.value.trim();
    // const gender =
    //     document.querySelector("input[name='gender']:checked")?.value || "";

    let valid = true;

    // Reset errors
    setInputError(userIn, false);
    setInputError(emailIn, false);
    setInputError(passIn, false);
    // setInputError(dobIn, false);
    // setInputError(roleIn, false);
    setInputError(phoneIn, false);
    // genderError.style.display = "none";




    // Validation
    if (!name) { setInputError(userIn, true, "Username required"); valid = false; }
    if (!email) { setInputError(emailIn, true, "Email required"); valid = false; }
    if (!password) { setInputError(passIn, true, "Password required"); valid = false; }
    // if (!dob) { setInputError(dobIn, true, "Birthday required"); valid = false; }
    if (!phone) { setInputError(phoneIn, true, "Phone required"); valid = false; }
    if (!role || role === "null") {
        setInputError(roleIn, true, "Role required");
        valid = false;
    }
    // if (!gender) {
    //     genderError.style.display = "block";
    //     valid = false;
    // }
    if (!valid) return;


    // Data for backend
    const data = {
        name,
        email,
        password,
        // gender,
        // dob,
        phone,
        role
        // role: "student"
    };


    // Backend signup
    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Sign Up Successful! Please Login.");
                alert("Student registered with ID: " + result.id);
                activateSignIn();
                document.getElementById("signupForm").reset();
            }
            else {
                alert("Registration failed: " + result.message);
            }
        })
        .catch(err => {
            console.error("Error adding student: ", err);
            alert("Failed to register student");
        });

};


// ***********************************  Sign in STUDENT (POST) **************************************************


// --- Sign In Logic ---
document.getElementById("signInSubmit").addEventListener("click", loginUser);

function loginUser(e) {
    e.preventDefault();

    const userIn = document.getElementById("si_username");
    const passIn = document.getElementById("si_password");
    const roleIn = document.getElementById("signinRole");

    const email = userIn.value.trim();
    const password = passIn.value.trim();
    const role = roleIn.value.trim();

    let valid = true;
    // Reset errors
    setInputError(userIn, false);
    setInputError(passIn, false);
    setInputError(roleIn, false);

    // Validation
    if (!email) {
        setInputError(userIn, true, "Email is required");
        valid = false;
    }

    if (!password) {
        setInputError(passIn, true, "Password is required");
        valid = false;
    }
    if (!role || role === "null") {
        setInputError(roleIn, true, "Role required");
        valid = false;
    }

    if (!valid) return;

    data = { email, password, role };



    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Login Successful! Welcome " + result.name);
                console.log("User:", result.user);
                window.location.href = "../index.html";
            } else {
                alert("Login failed: " + result.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Login error");
        });
};

// ***********************************  END  **************************************************