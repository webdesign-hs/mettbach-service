// Initialize Lucide Icons
lucide.createIcons();

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
const logoutBtnMobile = document.getElementById('logout-btn-mobile');

function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener('click', handleLogout);
}

// Mobile Menu Logic
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Close menu on link click
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

// Navbar Scroll Effect (Glass gets stronger on scroll)
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 20) {
        nav.classList.add('shadow-lg');
        nav.classList.replace('bg-white/80', 'bg-white/95');
    } else {
        nav.classList.remove('shadow-lg');
        nav.classList.replace('bg-white/95', 'bg-white/80');
    }
});

// Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
});
