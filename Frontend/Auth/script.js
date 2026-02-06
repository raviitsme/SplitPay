const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const switchToLogin = document.getElementById("switchToLogin");
const switchToRegister = document.getElementById("switchToRegister");

function showLogin() {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
}

function showRegister() {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
}

switchToLogin.addEventListener("click", e => {
    e.preventDefault();
    showLogin();
});

switchToRegister.addEventListener("click", e => {
    e.preventDefault();
    showRegister();
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

if (mode === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
} else {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const msg = document.getElementById('msg');
    const passError = document.getElementById('pass-error');

    const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])[^\s]{6,}$/;

    // Validation
    if (!name || !email || !password) {
        msg.style.color = 'red';
        msg.innerText = 'Please fill all fields!';
        return;
    }

    // if (!passRegExp.test(password)) {
    //     passError.style.color = 'red';
    //     passError.textContent = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    //     return;
    // }

    try {
        const response = await fetch('http://localhost:3000/authentication/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (!result.success) {
            msg.style.color = 'red';
            msg.innerText = result.message;
            return;
        }

        // Success
        msg.style.color = 'green';
        msg.innerText = 'Registered successfully! Please login.';

        // Switch to login after delay
        setTimeout(() => {
            msg.innerText = '';
            showLogin();   // 👈 switches form
        }, 2000);

    } catch (err) {
        console.error('Register Error:', err);
        msg.style.color = 'red';
        msg.innerText = 'Server error. Try again.';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('errorMsg');

    if(!email || !password) {
        msg.textContent = 'Please enter all fields!';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/authentication/login', {
            method : "POST",
            headers : {
                'Content-Type': 'application/json'
            },
            credentials : "include",
            body : JSON.stringify({ email, password })
        });

        const result = await response.json();

        if(!result.success){
            msg.textContent = result.message;
            return;
        }

        msg.style.color = 'rgb(157, 255, 150)';
        msg.textContent = 'Successfully logged in...';

        window.location.href = '../Dashboard/index.html';        
    } catch (err) {
        console.error("Error : ", err);
        msg.textContent = 'Some server error occurred!'
    }
})