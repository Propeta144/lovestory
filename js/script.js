// ==================== CONFIGURATION ====================
const ANNIVERSARY_DATE = new Date('2025-06-22'); // ← June 22, 2025

// ==================== INITIALIZE AFTER LOGIN ====================
function initializeWebsite() {
    initFloatingHearts();
    initNavbar();
    initCounter();
    initScrollAnimations();
    initGalleryFilters();
    initGalleryLightbox();
    initMusicToggle();
}

// ==================== FLOATING HEARTS ====================
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const hearts = ['💕', '💖', '💗', '❤️', '💘', '💝', '🌹', '✨'];

    function createHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 20000);
    }

    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 500);
    }
    setInterval(createHeart, 2000);
}

// ==================== NAVBAR ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        const sections = document.querySelectorAll('.section, .hero-section');
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ==================== LOVE COUNTER ====================
function initCounter() {
    function updateCounter() {
        const now = new Date();
        const diff = now - ANNIVERSARY_DATE;
        const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
        const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);

        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    updateCounter();
    setInterval(updateCounter, 1000);
}

// ==================== MUSIC TOGGLE ====================
function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            } else {
                bgMusic.play().catch(() => {
                    showToast('🎵 Lagyan mo ng music file sa HTML!');
                });
                musicToggle.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }
}

// ==================== GALLERY FILTERS ====================
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-filter') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ==================== GALLERY LIGHTBOX ====================
let currentLightboxIndex = 0;
let lightboxImages = [];

function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption') || 'Our moment 💕';
            openLightbox(img.src, caption);
        });
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').textContent = caption;

    lightboxImages = [];
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        const img = item.querySelector('img');
        const cap = item.getAttribute('data-caption') || 'Our moment 💕';
        lightboxImages.push({ src: img.src, caption: cap });
        if (img.src === src) currentLightboxIndex = i;
    });

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (!lightboxImages.length) return;
    currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightboxImg').src = lightboxImages[currentLightboxIndex].src;
    document.getElementById('lightboxCaption').textContent = lightboxImages[currentLightboxIndex].caption;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

// ==================== CAROUSEL ====================
let carouselPosition = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.adventure-slide');
    const slideWidth = slides[0]?.offsetWidth + 20 || 0;
    const containerWidth = track.parentElement.offsetWidth - 120;
    const visibleSlides = Math.floor(containerWidth / slideWidth) || 1;
    const maxPosition = Math.max(0, slides.length - visibleSlides);

    carouselPosition = Math.max(0, Math.min(carouselPosition + direction, maxPosition));
    track.style.transform = `translateX(-${carouselPosition * slideWidth}px)`;
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('aos-animate');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    document.querySelectorAll('.timeline-item').forEach(el => {
        observer.observe(el);
        el.setAttribute('data-aos', el.classList.contains('left') ? 'fade-right' : 'fade-left');
    });
}

// ==================== PARALLAX ====================
window.addEventListener('scroll', () => {
    const heroBg = document.getElementById('heroBg');
    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
