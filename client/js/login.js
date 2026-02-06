// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("ri-eye-off-line");
    toggleIcon.classList.add("ri-eye-line");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("ri-eye-line");
    toggleIcon.classList.add("ri-eye-off-line");
  }
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  login();
}

// Login function
async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const msgDiv = document.getElementById("msg");
  
  // Validate inputs
  if (!emailInput.value || !passwordInput.value) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  msgDiv.textContent = "Logging in...";
  msgDiv.className = "message-alert show";

  try {
    const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();

    if (res.ok) {
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showMessage(data.message || "Login failed", "error");
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage(`Error: ${error.message}. Make sure backend is running on http://127.0.0.1:8000`, "error");
  }
}

// Show message with styling
function showMessage(text, type) {
  const msgDiv = document.getElementById("msg");
  if (!msgDiv) return;
  msgDiv.textContent = text;
  msgDiv.className = `message-alert show ${type}`;
  
  if (type === "error" || type === "info") {
    setTimeout(() => {
      msgDiv.classList.remove("show");
    }, 4000);
  }
}

// Forgot Password Logic
async function handleForgotPassword(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage("Please enter your email address first.", "error");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (res.ok) {
            showMessage("Password reset instructions sent to your email!", "success");
        } else {
            showMessage(data.message || "Email not found", "error");
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showMessage("Connection error. Is the backend running?", "error");
    }
}

// Add alternate listener if needed
document.addEventListener('DOMContentLoaded', () => {
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', handleForgotPassword);
    }
});

