// ==================== SIMPLE PASSWORD LOGIN ====================
// Walang Firebase needed dito - pure JavaScript lang

const CORRECT_PASSWORD = "hilot moko"; // ← ANG PASSWORD

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('loveStoryLoggedIn');
    if (isLoggedIn === 'true') {
        showMainContent();
        return true;
    }
    showLoginScreen();
    return false;
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function showMainContent() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.body.style.overflow = '';

    if (typeof initializeWebsite === 'function') {
        initializeWebsite();
    }
}

function attemptLogin() {
    const input = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('loginError');
    const password = input.value.trim().toLowerCase();

    if (password === CORRECT_PASSWORD.toLowerCase()) {
        sessionStorage.setItem('loveStoryLoggedIn', 'true');

        const loginBox = document.querySelector('.login-box');
        loginBox.classList.add('success');
        createLoginHearts();

        setTimeout(() => {
            showMainContent();
        }, 1500);
    } else {
        errorMsg.textContent = '❌ Mali ang password! Try mo ulit, mahal.';
        errorMsg.style.display = 'block';
        input.classList.add('shake');
        input.value = '';

        setTimeout(() => {
            input.classList.remove('shake');
        }, 600);
    }
}

function createLoginHearts() {
    const container = document.getElementById('loginScreen');
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('span');
        heart.className = 'login-heart-burst';
        heart.textContent = ['💕', '💖', '💗', '❤️', '💘'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 0.5 + 's';
        heart.style.fontSize = (Math.random() * 30 + 15) + 'px';
        container.appendChild(heart);
    }
}

function logout() {
    sessionStorage.removeItem('loveStoryLoggedIn');
    location.reload();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();

    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
        setTimeout(() => passwordInput.focus(), 500);
    }
});