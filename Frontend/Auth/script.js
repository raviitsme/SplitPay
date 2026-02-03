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

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const msg = document.getElementById('msg');

    // Validation
    if (!name || !email || !password) {
        msg.style.color = 'red';
        msg.innerText = 'Please fill all fields!';
        return;
    }

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
