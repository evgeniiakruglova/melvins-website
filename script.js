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

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Instantly reveal ALL fade-in elements (no transition) to prevent
      // layout shifts that interrupt smooth scrolling
      document.querySelectorAll('.fade-in').forEach(el => {
        el.style.transition = 'none';
        el.classList.add('visible');
        observer.unobserve(el);
      });

      // Force browser to apply the instant changes before scrolling
      document.body.offsetHeight;

      // Scroll to the heading content, not the section container
      const scrollTarget = target.querySelector('.section-header, .about__heading, .section-label') || target;
      const offset = 88; // nav height + comfortable buffer
      const top = scrollTarget.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
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

// --- Contact form handling ---
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function () {
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';
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
