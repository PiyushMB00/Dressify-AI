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
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        // Redirect admin to admin page, others to home
        if (data.user.isAdmin) {
          window.location.href = "admin.html";
        } else {
          window.location.href = "index.html";
        }
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
  msgDiv.textContent = text;
  msgDiv.className = `message-alert show ${type}`;
  
  if (type === "error") {
    setTimeout(() => {
      msgDiv.classList.remove("show");
    }, 4000);
  }
}

