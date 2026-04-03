// ==================== CONFIGURATION ====================
// PALITAN MO ITO NG ACTUAL DATE NIYO!
const ANNIVERSARY_DATE = new Date('2025-06-22'); // Format: YYYY-MM-DD

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initNavbar();
    initCounter();
    initUploadZone();
    initScrollAnimations();
    initGalleryFilters();
    loadSavedPhotos();
    loadSavedInlinePhotos();
    initPlaceholderImages();
});

// ==================== FLOATING HEARTS ====================
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
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

    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 500);
    }

    // Keep creating hearts
    setInterval(createHeart, 2000);
}

// ==================== NAVBAR ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        const sections = document.querySelectorAll('.section, .hero-section');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
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

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
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
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play().catch(e => {
            showToast('🎵 Add a music file URL in the HTML audio source!');
        });
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// ==================== UPLOAD ZONE ====================
function initUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
}

// ==================== FILE HANDLING ====================
function handleFiles(files) {
    const preview = document.getElementById('uploadPreview');
    const category = document.getElementById('uploadCategory').value;
    const filter = document.getElementById('uploadFilter').value;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 10 * 1024 * 1024) {
            showToast('⚠️ File too large! Max 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;

            // Add to preview
            addPreviewItem(imgData, file.name, category, filter);

            // Save to localStorage
            savePhoto(imgData, category, filter, file.name);

            // Add to appropriate section
            addPhotoToSection(imgData, category, filter);

            showToast(`💕 Photo added to ${category}!`);
        };
        reader.readAsDataURL(file);
    });
}

function addPreviewItem(src, name, category, filter) {
    const preview = document.getElementById('uploadPreview');
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
        <img src="${src}" alt="${name}">
        <button class="remove-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="preview-label">${category} | ${filter}</div>
    `;
    preview.appendChild(item);
}

// ==================== GALLERY UPLOAD ====================
function handleGalleryUpload(event) {
    const files = event.target.files;
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            addPhotoToSection(e.target.result, 'gallery', 'all');
            savePhoto(e.target.result, 'gallery', 'all', file.name);
            showToast('💕 Photo added to gallery!');
        };
        reader.readAsDataURL(file);
    });
}

// ==================== INLINE UPLOAD (for placeholders) ====================
let currentUploadTarget = null;

function triggerUpload(placeholder) {
    currentUploadTarget = placeholder;
    document.getElementById('inlineUpload').click();
}

function handleInlineUpload(event) {
    const file = event.target.files[0];
    if (!file || !currentUploadTarget) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const container = currentUploadTarget.parentElement;
        const img = container.querySelector('img');

        if (img) {
            img.src = e.target.result;
            img.classList.add('loaded');
            currentUploadTarget.classList.add('hidden');

            // Save inline photo
            const sectionId = container.closest('.section, .hero-section')?.id || 'general';
            savePhoto(e.target.result, 'inline-' + sectionId, 'all', file.name);

            showToast('💕 Photo added!');
        }
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = '';
}

// ==================== ADD PHOTO TO SECTIONS ====================
function addPhotoToSection(imgData, category, filter) {
    switch (category) {
        case 'gallery':
            addToGallery(imgData, filter);
            break;
        case 'sweet':
            // Sweet moments are pre-defined cards, handled via inline upload
            break;
        case 'adventures':
            // Adventures are pre-defined cards, handled via inline upload
            break;
        case 'timeline':
            // Timeline items are pre-defined, handled via inline upload
            break;
    }
}

function addToGallery(imgData, filter) {
    const grid = document.getElementById('galleryGrid');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-filter', filter);
    item.innerHTML = `
        <img src="${imgData}" alt="Gallery Photo">
        <div class="gallery-overlay">
            <span>💕 Our Moment</span>
        </div>
    `;
    item.addEventListener('click', () => {
        openLightbox(imgData, 'Our beautiful moment together 💕');
    });

    // Insert before the placeholder
    const placeholder = grid.querySelector('.gallery-placeholder');
    if (placeholder) {
        grid.insertBefore(item, placeholder);
    } else {
        grid.appendChild(item);
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
            const items = document.querySelectorAll('.gallery-item');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-filter') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ==================== LIGHTBOX ====================
let currentLightboxIndex = 0;
let lightboxImages = [];

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');

    // Collect all gallery images
    lightboxImages = [];
    document.querySelectorAll('.gallery-item img').forEach((imgEl, i) => {
        lightboxImages.push({
            src: imgEl.src,
            caption: 'Our beautiful moment together 💕'
        });
        if (imgEl.src === src) currentLightboxIndex = i;
    });

    img.src = src;
    captionEl.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (lightboxImages.length === 0) return;
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
    if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;

    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    img.src = lightboxImages[currentLightboxIndex].src;
    caption.textContent = lightboxImages[currentLightboxIndex].caption;
}

// Close lightbox on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Close lightbox on backdrop click
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

// ==================== CAROUSEL ====================
let carouselPosition = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.adventure-slide');
    const slideWidth = slides[0]?.offsetWidth + 20 || 0; // + gap

    // Calculate how many slides visible
    const containerWidth = track.parentElement.offsetWidth - 120; // minus padding
    const visibleSlides = Math.floor(containerWidth / slideWidth) || 1;
    const maxPosition = Math.max(0, slides.length - visibleSlides);

    carouselPosition += direction;
    if (carouselPosition < 0) carouselPosition = 0;
    if (carouselPosition > maxPosition) carouselPosition = maxPosition;

    track.style.transform = `translateX(-${carouselPosition * slideWidth}px)`;
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Also animate timeline items
    document.querySelectorAll('.timeline-item').forEach(el => {
        observer.observe(el);
        el.setAttribute('data-aos', el.classList.contains('left') ? 'fade-right' : 'fade-left');
    });
}

// ==================== LOCAL STORAGE ====================
function savePhoto(imgData, category, filter, name) {
    try {
        let photos = JSON.parse(localStorage.getItem('loveStoryPhotos') || '[]');

        // Check storage limit (localStorage ~5MB)
        // Compress or warn if too many
        if (photos.length > 50) {
            showToast('⚠️ Storage limit! Consider using smaller photos.');
            return;
        }

        photos.push({
            data: imgData,
            category: category,
            filter: filter,
            name: name,
            date: new Date().toISOString()
        });

        localStorage.setItem('loveStoryPhotos', JSON.stringify(photos));
    } catch (e) {
        console.warn('localStorage full or unavailable:', e);
        showToast('⚠️ Storage full! Photos will not persist after refresh.');
    }
}

function loadSavedPhotos() {
    try {
        const photos = JSON.parse(localStorage.getItem('loveStoryPhotos') || '[]');

        photos.forEach(photo => {
            if (photo.category === 'gallery') {
                addToGallery(photo.data, photo.filter);
            }
            // Inline photos would need more complex mapping
        });
    } catch (e) {
        console.warn('Error loading saved photos:', e);
    }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==================== HERO BACKGROUND ====================
// You can set a hero background by uploading or directly setting the URL
function setHeroBackground(imgUrl) {
    const heroBg = document.getElementById('heroBg');
    heroBg.style.backgroundImage = `url(${imgUrl})`;
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center';
}

// ==================== PARALLAX EFFECT (subtle) ====================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ==================== PLACEHOLDER IMAGES ====================
function initPlaceholderImages() {
    const allImgContainers = document.querySelectorAll(
        '.timeline-img-container, .sweet-img-container, .adventure-img-container'
    );

    allImgContainers.forEach(container => {
        const img = container.querySelector('img');
        const placeholder = container.querySelector('.img-placeholder');

        if (img && (!img.src || img.src === window.location.href || img.src === '')) {
            // Walang photo pa - itago ang broken image
            img.style.display = 'none';

            // Ipakita yung magandang placeholder
            if (placeholder) {
                placeholder.classList.remove('hidden');
            }
        } else if (img && img.src && img.src !== window.location.href) {
            // May photo na - ipakita ang image, itago placeholder
            img.classList.add('loaded');
            img.style.display = 'block';

            if (placeholder) {
                placeholder.classList.add('hidden');
            }
        }
    });

    // Also handle hero background
    initHeroUpload();
}

// ==================== HERO BACKGROUND UPLOAD ====================
function initHeroUpload() {
    const heroBg = document.getElementById('heroBg');

    // Check kung may saved hero photo
    const savedHero = localStorage.getItem('loveStoryHeroBg');
    if (savedHero) {
        heroBg.style.backgroundImage = `url(${savedHero})`;
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
    }

    // Double-click sa hero para mag upload ng background photo
    heroBg.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const imgData = ev.target.result;
                heroBg.style.backgroundImage = `url(${imgData})`;
                heroBg.style.backgroundSize = 'cover';
                heroBg.style.backgroundPosition = 'center';

                // Save sa localStorage
                try {
                    localStorage.setItem('loveStoryHeroBg', imgData);
                    showToast('💕 Hero background updated!');
                } catch (err) {
                    showToast('⚠️ Photo too large to save locally');
                }
            };
            reader.readAsDataURL(file);
        };
        input.click();
    });
}

// ==================== ENHANCED INLINE UPLOAD ====================
// I-replace mo yung existing handleInlineUpload function ng ito:
function handleInlineUpload(event) {
    const file = event.target.files[0];
    if (!file || !currentUploadTarget) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const container = currentUploadTarget.parentElement;
        const img = container.querySelector('img');

        if (img) {
            img.src = e.target.result;
            img.classList.add('loaded');
            img.style.display = 'block';
            currentUploadTarget.classList.add('hidden');

            // Smooth fade in effect
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);

            // Save inline photo with location info
            const section = container.closest('section');
            const sectionId = section ? section.id : 'general';
            const cardIndex = getCardIndex(container);

            try {
                let inlinePhotos = JSON.parse(
                    localStorage.getItem('loveStoryInlinePhotos') || '{}'
                );
                const key = `${sectionId}-${cardIndex}`;
                inlinePhotos[key] = e.target.result;
                localStorage.setItem(
                    'loveStoryInlinePhotos',
                    JSON.stringify(inlinePhotos)
                );
            } catch (err) {
                console.warn('Storage full for inline photos');
            }

            showToast('💕 Photo added!');
        }

        currentUploadTarget = null;
    };
    reader.readAsDataURL(file);

    // Reset file input para pwede mag upload ulit ng same file
    event.target.value = '';
}

// Helper: Get index of card within its section
function getCardIndex(element) {
    const section = element.closest('section');
    if (!section) return 0;

    const allContainers = section.querySelectorAll(
        '.timeline-img-container, .sweet-img-container, .adventure-img-container'
    );

    let index = 0;
    allContainers.forEach((container, i) => {
        if (container === element || container.contains(element)) {
            index = i;
        }
    });
    return index;
}

// ==================== LOAD SAVED INLINE PHOTOS ====================
function loadSavedInlinePhotos() {
    try {
        const inlinePhotos = JSON.parse(
            localStorage.getItem('loveStoryInlinePhotos') || '{}'
        );

        Object.keys(inlinePhotos).forEach(key => {
            const [sectionId, cardIndex] = key.split('-');
            const section = document.getElementById(sectionId);
            if (!section) return;

            const containers = section.querySelectorAll(
                '.timeline-img-container, .sweet-img-container, .adventure-img-container'
            );

            const container = containers[parseInt(cardIndex)];
            if (!container) return;

            const img = container.querySelector('img');
            const placeholder = container.querySelector('.img-placeholder');

            if (img) {
                img.src = inlinePhotos[key];
                img.classList.add('loaded');
                img.style.display = 'block';
            }
            if (placeholder) {
                placeholder.classList.add('hidden');
            }
        });
    } catch (err) {
        console.warn('Error loading inline photos:', err);
    }
}
