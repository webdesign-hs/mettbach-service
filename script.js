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

// ========================================
// KONTAKTFORMULAR LOGIK
// ========================================

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitButton = document.getElementById('submit-button');
const formTimestamp = Date.now(); // Für Spam-Schutz

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Button deaktivieren während des Sendens
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin inline-block mr-2"></i> Wird gesendet...';
        lucide.createIcons();

        // Formular-Daten sammeln
        const formData = {
            name: document.getElementById('contact-name').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            service: document.getElementById('contact-service').value,
            message: document.getElementById('contact-message').value.trim(),
            timestamp: formTimestamp,
            website: document.getElementById('contact-website').value // Honeypot
        };

        try {
            // TODO: Sobald Domain & Hosting verfügbar, diese URL anpassen!
            // Aktuell auf 'send-contact.php' gesetzt
            const response = await fetch('send-contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Erfolgs-Nachricht anzeigen
                showFormMessage('success', result.message);

                // Formular zurücksetzen
                contactForm.reset();
            } else {
                // Fehler-Nachricht anzeigen
                showFormMessage('error', result.message);
            }

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            showFormMessage('error', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 0123 / 456 789');
        } finally {
            // Button wieder aktivieren
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Anfrage absenden';
        }
    });
}

/**
 * Zeigt eine Formular-Nachricht an
 * @param {string} type - 'success' oder 'error'
 * @param {string} message - Die anzuzeigende Nachricht
 */
function showFormMessage(type, message) {
    if (!formMessage) return;

    // Klassen zurücksetzen
    formMessage.classList.remove('hidden', 'bg-green-50', 'text-green-800', 'border-green-200', 'bg-red-50', 'text-red-800', 'border-red-200');

    // Entsprechende Klassen hinzufügen
    if (type === 'success') {
        formMessage.classList.add('bg-green-50', 'text-green-800', 'border-green-200');
    } else {
        formMessage.classList.add('bg-red-50', 'text-red-800', 'border-red-200');
    }

    // Nachricht setzen und anzeigen
    formMessage.textContent = message;
    formMessage.classList.remove('hidden');

    // Nachricht nach 10 Sekunden ausblenden
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 10000);

    // Zum Formular scrollen
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
