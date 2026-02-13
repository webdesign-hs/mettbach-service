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
const formTimestamp = Date.now();

// Rate Limiting (clientseitig)
let lastSubmitTime = 0;
const RATE_LIMIT_MS = 30000; // 30 Sekunden zwischen Anfragen

// Input Sanitization
function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
}

// Validierung
function validateName(name) {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-ZäöüÄÖÜßéèêëàáâãåæçíìîïñóòôõøúùûýÿ\s\-'.]+$/.test(name);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\/().]+/g, '');
    return cleaned.length >= 6 && cleaned.length <= 20 && /^[+]?[0-9]+$/.test(cleaned);
}

function validateMessage(msg) {
    return msg.length >= 10 && msg.length <= 2000;
}

const validServices = ['Entrümpelung', 'Haushaltsauflösung', 'Wohnungsauflösung', 'Geschäfts- / Büroauflösung', 'Keller-Entrümpelung', 'Sperrmüllabholung', 'Instandsetzungen', 'Sonstiges'];

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Rate Limiting prüfen
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
            showFormMessage('error', `Bitte warten Sie noch ${waitSec} Sekunden, bevor Sie erneut absenden.`);
            return;
        }

        // Button deaktivieren
        submitButton.disabled = true;
        submitButton.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin inline-block mr-2"></i> Wird gesendet...';
        lucide.createIcons();

        // DSGVO-Checkbox prüfen
        const privacyCheckbox = document.getElementById('contact-privacy');
        const privacyError = document.getElementById('privacy-error');

        if (!privacyCheckbox.checked) {
            privacyError.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Anfrage absenden';
            return;
        }
        privacyError.classList.add('hidden');

        // Werte auslesen & sanitizen
        const name = sanitizeInput(document.getElementById('contact-name').value);
        const phone = sanitizeInput(document.getElementById('contact-phone').value);
        const service = document.getElementById('contact-service').value;
        const message = sanitizeInput(document.getElementById('contact-message').value);

        // Client-Validierung
        const errors = [];
        if (!validateName(name)) errors.push('Bitte geben Sie einen gültigen Namen ein (mind. 2 Buchstaben).');
        if (!validatePhone(phone)) errors.push('Bitte geben Sie eine gültige Telefonnummer ein.');
        if (!validServices.includes(service)) errors.push('Bitte wählen Sie einen gültigen Service.');
        if (!validateMessage(message)) errors.push('Nachricht muss zwischen 10 und 2000 Zeichen lang sein.');

        if (errors.length > 0) {
            showFormMessage('error', errors.join(' '));
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Anfrage absenden';
            return;
        }

        const formData = {
            name,
            phone,
            service,
            message,
            privacy: privacyCheckbox.checked,
            timestamp: formTimestamp,
            website: document.getElementById('contact-website').value
        };

        try {
            const response = await fetch('send-contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showFormMessage('success', result.message);
                contactForm.reset();
                lastSubmitTime = Date.now();
            } else {
                showFormMessage('error', result.message);
            }

        } catch (error) {
            console.error('Fehler beim Senden:', error);
            showFormMessage('error', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 02433 / 3027044');
        } finally {
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
