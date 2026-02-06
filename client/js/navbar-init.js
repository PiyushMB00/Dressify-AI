/**
 * Shared script for navbar initialization and auth state across all pages.
 */

// Authentication Wall
function checkAuth() {
    const publicPages = ['login.html', 'signup.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const token = localStorage.getItem('token');

    if (!token && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return false;
    }

    if (token && publicPages.includes(currentPage)) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function toggleNavMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function updateNavbarAuth() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Find auth section (Login/Signup links)
    const navLinks = Array.from(navMenu.querySelectorAll('.nav-link'));
    const loginLink = navLinks.find(a => a.getAttribute('href') === 'login.html');
    const signupLink = navLinks.find(a => a.getAttribute('href') === 'signup.html');
    
    // Add logout button if not present
    let logoutBtn = document.getElementById('logoutBtn');

    if (token && user) {
        // Hide Login/Signup
        if (loginLink) loginLink.parentElement.style.display = 'none';
        if (signupLink) signupLink.parentElement.style.display = 'none';

        // Add User Profile/Logout if not present
        if (!logoutBtn) {
            const logoutLi = document.createElement('li');
            logoutLi.id = 'logoutLi';
            logoutLi.innerHTML = `
                <a href="#" class="nav-link auth-btn" id="logoutBtn">
                    <ion-icon name="log-out-outline"></ion-icon> Logout (${user.fullname || user.email || 'User'})
                </a>
            `;
            navMenu.appendChild(logoutLi);
            logoutBtn = document.getElementById('logoutBtn');
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                }
            };
        }
        
    } else {
        // Show Login/Signup
        if (loginLink) loginLink.parentElement.style.display = 'block';
        if (signupLink) signupLink.parentElement.style.display = 'block';
        
        // Remove Logout if present
        const logoutLi = document.getElementById('logoutLi');
        if (logoutLi) logoutLi.remove();
    }
}

// Highlight active page
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Ensure toggle works on mobile
document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Footer Subscription Logic
function initFooterSubscription() {
    const forms = document.querySelectorAll('.footer__col form, #footerSubscribeForm');
    forms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                alert(`Thank you for subscribing, ${email}! You will receive our latest fashion trends soon.`);
                form.reset();
            }
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        updateNavbarAuth();
        highlightActiveLink();
        initFooterSubscription();
    }
});
