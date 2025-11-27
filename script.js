// Initialize Lucide Icons
lucide.createIcons();

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

// Hero Video Control
const videoContainer = document.getElementById('video-container');
const heroVideo = document.getElementById('hero-video');
const playButtonOverlay = document.getElementById('play-button-overlay');

if (videoContainer && heroVideo && playButtonOverlay) {
    // Play video on click
    playButtonOverlay.addEventListener('click', () => {
        heroVideo.play();
        playButtonOverlay.style.opacity = '0';
        setTimeout(() => {
            playButtonOverlay.style.display = 'none';
        }, 300);
    });

    // Show overlay again when video ends
    heroVideo.addEventListener('ended', () => {
        playButtonOverlay.style.display = 'flex';
        setTimeout(() => {
            playButtonOverlay.style.opacity = '1';
        }, 10);
    });

    // Hide overlay when video is playing
    heroVideo.addEventListener('play', () => {
        playButtonOverlay.style.opacity = '0';
        setTimeout(() => {
            playButtonOverlay.style.display = 'none';
        }, 300);
    });

    // Show overlay when video is paused
    heroVideo.addEventListener('pause', () => {
        if (heroVideo.currentTime > 0 && !heroVideo.ended) {
            playButtonOverlay.style.display = 'flex';
            setTimeout(() => {
                playButtonOverlay.style.opacity = '1';
            }, 10);
        }
    });
}

// Price Toggle Functionality
document.querySelectorAll('.price-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.toggle-icon');

        // Toggle content
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            // Change plus to minus
            icon.setAttribute('data-lucide', 'minus');
        } else {
            content.classList.add('hidden');
            // Change minus to plus
            icon.setAttribute('data-lucide', 'plus');
        }

        // Reinitialize lucide icons
        lucide.createIcons();
    });
});
