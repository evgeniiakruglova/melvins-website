/* ============================================
   GOAL TRAINING ACADEMY - JavaScript
   ============================================ */

// --- Navigation scroll effect ---
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
});

// --- Mobile menu toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// --- Smooth scroll utility ---
function smoothScrollTo(targetEl, duration = 800) {
  const navHeight = 72;
  const startY = window.pageYOffset;
  const targetY = targetEl.getBoundingClientRect().top + startY - navHeight;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// --- Anchor link navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();

    // Instantly reveal ALL fade-in elements so layout is final
    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('visible');
      observer.unobserve(el);
    });

    const target = document.querySelector(href);
    if (target) {
      // Force browser to compute the final layout (with image dimensions reserved)
      void document.body.offsetHeight;

      smoothScrollTo(target);
      history.pushState(null, '', href);
    }
  });
});

// --- Scroll-based fade-in animations ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class to elements
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll(
    '.about__image-col, .about__text-col, .service-card, .why__text, .why__feature, ' +
    '.gallery__item, .testimonial-card, .contact__info, .contact__form-wrapper, .section-header'
  );

  animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index % 4 * 0.1}s`;
    observer.observe(el);
  });
});

// --- Phone number formatting ---
function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
}

// --- Contact form handling ---
const contactForm = document.getElementById('contactForm');
const WEBHOOK_URL = 'https://jenyakruglova.app.n8n.cloud/webhook/goal-training-form';

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Build JSON payload from form fields
  const payload = {
    name: this.querySelector('#name').value,
    email: this.querySelector('#email').value,
    phone: formatPhone(this.querySelector('#phone').value),
    program: this.querySelector('#program').value,
    player_age: this.querySelector('#player-age').value,
    message: this.querySelector('#message').value,
    honeypot: this.querySelector('[name="honeypot"]').value,
    submitted_at: new Date().toISOString(),
    source: 'website'
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      `;
      submitBtn.style.background = '#22c55e';
      submitBtn.style.borderColor = '#22c55e';
      contactForm.reset();
    } else {
      throw new Error('Failed');
    }
  })
  .catch(() => {
    submitBtn.innerHTML = 'Something went wrong. Try again.';
    submitBtn.style.background = '#ef4444';
    submitBtn.style.borderColor = '#ef4444';
  })
  .finally(() => {
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      submitBtn.disabled = false;
    }, 4000);
  });
});

// --- Active navigation highlighting ---
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// --- Year in footer ---
const yearEl = document.querySelector('.footer__bottom p');
if (yearEl) {
  yearEl.textContent = yearEl.textContent.replace('2025', new Date().getFullYear());
}
