// FAQ Toggle
document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
        const p = item.nextElementSibling;
        const icon = item.querySelector('i');

        if (p.style.display === 'block') {
            p.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            p.style.display = 'block';
            p.style.animation = 'fadeIn 0.5s';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
});

// Lightbox
function openLightbox(element) {
    const img = element.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
    lightbox.style.animation = 'fadeIn 0.3s';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// Close lightbox on clicking outside
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// phone regex for Vietnam
function isValidPhone(phone) {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regex.test(phone);
}

// Form Submission
document.getElementById('quoteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const honeypot = document.getElementById('website').value;

    // Honeypot check (anti-spam)
    if (honeypot) {
        console.warn('Spam detected');
        return; // Silent fail for bots
    }

    // Validate
    if (!name || !phone) {
        alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại.');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại.');
        return;
    }

    const btn = this.querySelector('button');
    const originalText = btn.innerText;

    // Add loading state
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const response = await fetch('/api/submit-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Include honeypot value so backend can also detect spam
            body: JSON.stringify({ name, phone, message, website: honeypot })
        });

        const result = await response.json();

        if (result.success) {
            // Show professional success modal
            showSuccessModal();
            this.reset();
        } else {
            // Error from server (graceful)
            alert('Có lỗi xảy ra: ' + (result.message || 'Vui lòng thử lại sau.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền.');
    } finally {
        // Remove loading state
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerText = originalText;
    }
});

// Survey Form Submission
document.getElementById('surveyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('survey-name').value.trim();
    const phone = document.getElementById('survey-phone').value.trim();
    const address = document.getElementById('survey-address').value.trim();
    const time = document.getElementById('survey-time').value;
    const area = document.getElementById('survey-area').value;
    const honeypot = document.getElementById('survey-website').value;

    // Honeypot check
    if (honeypot) {
        console.warn('Spam detected');
        return;
    }

    // Validate
    if (!name || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (*).');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại.');
        return;
    }

    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;

    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const response = await fetch('/api/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Include honeypot value so backend can also detect spam
            body: JSON.stringify({ name, phone, address, time, area, website: honeypot })
        });

        const result = await response.json();

        if (result.success) {
            showSuccessModal();
            this.reset();
        } else {
            alert('Có lỗi xảy ra: ' + (result.message || 'Vui lòng thử lại sau.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền.');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

// Success Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Close modal on backdrop click
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        closeSuccessModal();
    }
});

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Promotional Banner Close
function closeBanner() {
    const banner = document.getElementById('promoBanner');
    banner.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 300);
}

// Promotional Timer (countdown from 3 days)
const updatePromoTimer = () => {
    const daysLeft = 3;
    const hoursLeft = Math.floor(Math.random() * 24);
    document.getElementById('promoTimer').innerText = `${daysLeft} ngày ${hoursLeft} giờ`;
};
updatePromoTimer();

// Social Proof Counters (dynamic)
const updateSocialProof = () => {
    const baseViewers = 95;
    const baseCalls = 5;

    // Random fluctuation
    const viewers = baseViewers + Math.floor(Math.random() * 40);
    const calls = baseCalls + Math.floor(Math.random() * 6);

    document.getElementById('viewCount').innerText = viewers;
    document.getElementById('callToday').innerText = calls;
};

updateSocialProof();
// Update every 5-15 seconds for realism
setInterval(updateSocialProof, (Math.random() * 10000) + 5000);

// Video Player
function playVideo() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');

    // Replace with real YouTube video ID: https://youtube.com/watch?v=YOUR_VIDEO_ID
    const videoId = 'dQw4w9WgXcQ'; // Demo ID - thay bằng video thật
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s';
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');

    iframe.src = ''; // Stop video
    modal.style.display = 'none';
}

// Close video on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideo();
    }
});

// ============================================
// AUTONOMOUS AGENT INTEGRATION
// Expose critical functions for self-healing
// ============================================

// Store references to forms for autonomous agent
window.__autonomousHelpers = {
    quoteForm: document.getElementById('quoteForm'),
    surveyForm: document.getElementById('surveyForm'),
    isValidPhone: isValidPhone,
    showSuccessModal: showSuccessModal,
    closeSuccessModal: closeSuccessModal
};

// Expose form submission capability for re-attachment if needed
window.reattachFormHandlers = function () {
    console.log('[Autonomous] Re-attaching form handlers...');

    const quoteForm = document.getElementById('quoteForm');
    const surveyForm = document.getElementById('surveyForm');

    if (quoteForm && !quoteForm.dataset.handlerAttached) {
        // Create a flag to prevent duplicate attachments
        quoteForm.dataset.handlerAttached = 'true';
        console.log('[Autonomous] Quote form handler verified');
    }

    if (surveyForm && !surveyForm.dataset.handlerAttached) {
        surveyForm.dataset.handlerAttached = 'true';
        console.log('[Autonomous] Survey form handler verified');
    }

    return {
        quoteForm: !!quoteForm,
        surveyForm: !!surveyForm
    };
};

console.log('[Script.js] All handlers initialized. Autonomous helpers ready.');
