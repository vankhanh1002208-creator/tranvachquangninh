// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.add('transparent');
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('open');
        }
    });
}

// ===== SCROLL-REVEAL ANIMATION =====
const animateEls = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
animateEls.forEach(el => observer.observe(el));

// ===== COUNT-UP ANIMATION =====
function countUp(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
    }, 16);
}
const countEls = document.querySelectorAll('.stat-number[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

// ===== SCROLL TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
}

// ===== FORM SUBMIT =====
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = quoteForm.querySelector('[type="submit"]');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled = true;

        const data = {
            name: document.getElementById('name')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            message: (document.getElementById('service')?.value || '') + ' – ' + (document.getElementById('message')?.value || ''),
            website: document.getElementById('website')?.value || ''
        };

        try {
            const res = await fetch('/api/submit-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showToast('✅ Gửi thành công! Chúng tôi sẽ liên hệ trong 5-10 phút.', 'success');
                quoteForm.reset();
            } else {
                showToast('❌ ' + result.message, 'error');
            }
        } catch {
            showToast('❌ Lỗi kết nối. Vui lòng gọi trực tiếp: 0837.811.188', 'error');
        } finally {
            btn.innerHTML = origText;
            btn.disabled = false;
        }
    });
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:${type === 'success' ? '#16a34a' : '#dc2626'};color:#fff;padding:16px 28px;border-radius:50px;font-size:15px;font-weight:600;z-index:99999;box-shadow:0 8px 30px rgba(0,0,0,.2);transition:all .3s;white-space:nowrap`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) link.classList.add('active');
});
