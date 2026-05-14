// ==============================
// PULSOING - SCRIPT PRINCIPAL
// ==============================

let turnstileToken = null;

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initServiceCardsAnimation();
    initExpandableServices();
    initHeaderScrollEffect();
    initContactForm();
});

// ==============================
// CALLBACK TURNSTILE
// ==============================
// Cloudflare Turnstile necesita que esta función exista en window,
// porque se llama desde el atributo data-callback="turnstileLoaded".
window.turnstileLoaded = function (token) {
    turnstileToken = token;
    console.log('✅ Turnstile OK:', token ? 'SI' : 'NO');
};

// ==============================
// MENÚ MOBILE
// ==============================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==============================
// SCROLL SUAVE
// ==============================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// ==============================
// ANIMACIÓN DE CARDS
// ==============================
function initServiceCardsAnimation() {
    const cards = document.querySelectorAll('.servicio-card');

    if (!cards.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ==============================
// SERVICIOS EXPANDIBLES
// ==============================
function initExpandableServices() {
    document.querySelectorAll('.expandable').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// ==============================
// EFECTO HEADER AL HACER SCROLL
// ==============================
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');

    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.background = 'rgba(255,255,255,0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
}

// ==============================
// FORMULARIO CONTACTO - EMAILJS + TURNSTILE
// ==============================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');

    if (!form || !btn) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!turnstileToken) {
            if (confirm('¿Sin verificación? ¿Continuar?')) {
                turnstileToken = 'manual';
            } else {
                return;
            }
        }

        btn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        if (typeof emailjs === 'undefined') {
            alert('❌ Error: EmailJS no se cargó correctamente.');
            btn.innerHTML = 'Enviar Consulta <i class="fas fa-paper-plane"></i>';
            btn.disabled = false;
            return;
        }

        emailjs.init('xnSKdlQq77ATixWxE');

        emailjs.send('service_j2iw2ie', 'template_n55yi7w', {
            from_name: document.getElementById('nombre').value,
            from_email: document.getElementById('email').value,
            from_phone: '+56971268624',
            message: document.getElementById('mensaje').value,
            bot_score: turnstileToken || 'none'
        })
            .then(() => {
                alert('✅ Enviado a contacto@pulsoing.cl');
                form.reset();
                turnstileToken = null;
            })
            .catch(error => {
                console.error('❌ Error EmailJS:', error);
                alert('❌ Error al enviar el mensaje. Intenta nuevamente.');
            })
            .finally(() => {
                btn.innerHTML = 'Enviar Consulta <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;
            });
    });
}