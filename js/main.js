// ===== ACCESSIBILITY AUTO-FIX (Global) =====
document.addEventListener('DOMContentLoaded', () => {
    // Scroll-top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn && !scrollTopBtn.getAttribute('aria-label')) {
        scrollTopBtn.setAttribute('aria-label', 'Lên đầu trang');
        scrollTopBtn.setAttribute('title', 'Lên đầu trang');
    }

    // Float phone buttons
    document.querySelectorAll('.float-phone-btn').forEach(btn => {
        if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Gọi điện tư vấn');
    });
    document.querySelectorAll('.float-zalo-btn').forEach(btn => {
        if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Chat Zalo');
    });

    // Social links in footer (icon-only links)
    document.querySelectorAll('.footer-social').forEach(link => {
        if (!link.getAttribute('aria-label') && !link.getAttribute('title')) {
            const icon = link.querySelector('i');
            if (icon) {
                const cls = icon.className;
                if (cls.includes('facebook')) link.setAttribute('aria-label', 'Facebook');
                else if (cls.includes('tiktok')) link.setAttribute('aria-label', 'TikTok');
                else if (cls.includes('youtube')) link.setAttribute('aria-label', 'YouTube');
                else if (cls.includes('instagram')) link.setAttribute('aria-label', 'Instagram');
                else link.setAttribute('aria-label', 'Mạng xã hội');
            } else if (link.textContent.trim()) {
                link.setAttribute('aria-label', link.textContent.trim());
            }
        }
    });

    // Select elements without accessible name
    document.querySelectorAll('select.form-control, select').forEach(sel => {
        if (!sel.getAttribute('aria-label') && !sel.getAttribute('title') && !sel.id) return;
        if (!sel.getAttribute('aria-label')) {
            const label = document.querySelector(`label[for="${sel.id}"]`);
            if (!label) {
                const placeholder = sel.options[0]?.text || 'Chọn';
                sel.setAttribute('aria-label', placeholder);
            }
        }
    });
    // Explicitly label known selects
    ['service', 'calcType', 'calcArea'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.getAttribute('aria-label')) {
            const labels = { service: 'Chọn dịch vụ', calcType: 'Chọn loại trần', calcArea: 'Diện tích m²' };
            el.setAttribute('aria-label', labels[id] || 'Chọn');
        }
    });

    // Textarea without placeholder (honeypot & area inputs)
    const areaInput = document.getElementById('area');
    if (areaInput && !areaInput.getAttribute('aria-label')) areaInput.setAttribute('aria-label', 'Diện tích công trình (m²)');
    const addrInput = document.getElementById('address');
    if (addrInput && !addrInput.getAttribute('aria-label')) addrInput.setAttribute('aria-label', 'Địa chỉ công trình');
    const msgInput = document.getElementById('message');
    if (msgInput && !msgInput.getAttribute('aria-label')) msgInput.setAttribute('aria-label', 'Mô tả công trình');
    // Honeypot input – mark as hidden from AT
    document.querySelectorAll('input[name="website"]').forEach(el => {
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('tabindex', '-1');
    });

    // Lightbox nav buttons
    document.querySelectorAll('.lightbox-close').forEach(b => { if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'Đóng'); });
    document.querySelectorAll('.lightbox-prev').forEach(b => { if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'Ảnh trước'); });
    document.querySelectorAll('.lightbox-next').forEach(b => { if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'Ảnh tiếp theo'); });
});

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
            message: `Đối tượng: ${document.getElementById('role')?.value || 'Chưa chọn'}\nDịch vụ: ${document.getElementById('service')?.value || 'Không chọn'}\nYêu cầu: ${document.getElementById('message')?.value || ''}`.trim(),
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
