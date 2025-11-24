// Initialize Lucide Icons
lucide.createIcons();

// Hardcoded password
const CORRECT_PASSWORD = 'mettbach2025';

// Check if already logged in
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'index.html';
}

// Get form elements
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const togglePasswordBtn = document.getElementById('toggle-password');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle icon
    const icon = togglePasswordBtn.querySelector('i');
    if (type === 'text') {
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
});

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = passwordInput.value;

    // Validate password
    if (password === CORRECT_PASSWORD) {
        // Store login state in sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loginTime', new Date().toISOString());

        // Hide error if visible
        errorMessage.classList.add('hidden');

        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        // Show error message
        errorMessage.classList.remove('hidden');

        // Shake animation
        errorMessage.style.animation = 'none';
        setTimeout(() => {
            errorMessage.style.animation = 'shake 0.5s';
        }, 10);

        // Clear password field
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Clear error on input
passwordInput.addEventListener('input', () => {
    errorMessage.classList.add('hidden');
});
