// Toggle password visibility
function togglePassword(fieldId) {
  const passwordInput = document.getElementById(fieldId);
  const toggleIcon = event.target;

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

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  signup();
}

// Show message alert
function showMessage(message, type) {
  const msgDiv = document.getElementById("msg");
  msgDiv.textContent = message;
  msgDiv.className = `message-alert show ${type}`;

  if (type === "success") {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }
}

// Signup function
async function signup() {
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const termsCheckbox = document.getElementById("terms");
  const msgDiv = document.getElementById("msg");

  // Validate inputs
  if (!fullnameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  // Validate passwords match
  if (passwordInput.value !== confirmPasswordInput.value) {
    showMessage("Passwords do not match", "error");
    return;
  }

  // Validate password length
  if (passwordInput.value.length < 6) {
    showMessage("Password must be at least 6 characters long", "error");
    return;
  }

  // Validate terms accepted
  if (!termsCheckbox.checked) {
    showMessage("Please accept the Terms & Conditions", "error");
    return;
  }

  msgDiv.textContent = "Creating your account...";
  msgDiv.className = "message-alert show";

  try {
    const res = await fetch("http://127.0.0.1:8000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: fullnameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Account created successfully! Redirecting to login...", "success");
      // Store token in localStorage (using 'token' to match login.js)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      showMessage(data.message || "Signup failed. Please try again.", "error");
    }
  } catch (error) {
    console.error('Signup error:', error);
    showMessage(`Error: ${error.message}. Make sure backend is running on http://127.0.0.1:8000`, "error");
  }
}
