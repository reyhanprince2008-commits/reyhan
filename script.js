/* ============================================================
   PORTFOLIO — script.js
   Author: Alex Revano
   Features:
     - Navbar scroll behavior
     - Mobile hamburger menu
     - Dark/Light mode toggle
     - Scroll reveal animations
     - Typing effect (hero)
     - Active nav link on scroll
     - Contact form mock submission
   ============================================================ */

/* ============================================================
   1. NAVBAR — Scrolled state & active link tracking
   ============================================================ */
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

// Add .scrolled class when user scrolls past 60px
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Highlight the nav link matching the current visible section
function updateActiveLink() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

window.addEventListener('scroll', () => {
  handleNavScroll();
  updateActiveLink();
}, { passive: true });

// Run once on load in case user starts mid-page
handleNavScroll();
updateActiveLink();


/* ============================================================
   2. HAMBURGER — Mobile menu toggle
   ============================================================ */
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on click outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ============================================================
   3. DARK / LIGHT MODE TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');
const html        = document.documentElement;

// Check saved theme in localStorage; default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme     = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
});

// Update the button icon based on current theme
function updateToggleIcon(theme) {
  toggleIcon.textContent = theme === 'dark' ? '☀' : '🌙';
}


/* ============================================================
   4. SCROLL REVEAL — Animate elements as they enter viewport
   ============================================================ */
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

// Intersection Observer — triggers class addition when element enters view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after animation plays (for performance)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,    // Trigger when 12% of element is visible
  rootMargin: '0px 0px -40px 0px'  // Slight offset from bottom edge
});

// Observe every reveal element
revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   5. TYPING EFFECT — Hero section rotating phrases
   ============================================================ */
const typingEl  = document.getElementById('typingText');
const phrases   = [
  'beautiful web apps.',
  'web modern',
  'aplikasi mobile.',
  'creative interfaces.',
  'store develover gimick.',
];

let phraseIndex  = 0;   // Which phrase we're on
let charIndex    = 0;   // Which character within the phrase
let isDeleting   = false;
let typeTimeout;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 45 : 85;  // Delete faster than type

  if (!isDeleting && charIndex === current.length) {
    // Pause at full phrase before deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typeTimeout = setTimeout(typeLoop, delay);
}

// Kick off the typing loop (slight initial delay for page load feel)
setTimeout(typeLoop, 900);


/* ============================================================
   6. SKILL TAGS — Staggered entrance animation
   ============================================================ */
const skillTags = document.querySelectorAll('.skill-tag');

// Apply increasing transition-delay for a wave effect
skillTags.forEach((tag, i) => {
  tag.style.transitionDelay = `${i * 0.05}s`;
});


/* ============================================================
   7. CONTACT FORM — Mock submission handler
   ============================================================ */
const sendBtn     = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');
const formInputs  = document.querySelectorAll(
  '.contact-form input, .contact-form textarea'
);

sendBtn.addEventListener('click', () => {
  // Basic validation — check all fields are filled
  const values  = [...formInputs].map(el => el.value.trim());
  const isEmpty = values.some(v => v === '');

  if (isEmpty) {
    // Shake the button to signal error
    sendBtn.style.animation = 'none';
    sendBtn.offsetHeight;  // Trigger reflow
    sendBtn.style.animation = 'shake 0.4s ease';
    return;
  }

  // Simulate sending (show loading state)
  sendBtn.textContent  = 'Sending…';
  sendBtn.disabled     = true;

  setTimeout(() => {
    // Clear all fields
    formInputs.forEach(el => (el.value = ''));

    // Show success message
    formSuccess.style.display = 'block';

    // Reset button
    sendBtn.textContent = 'Send Message ✉';
    sendBtn.disabled    = false;

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  }, 1200);
});

// Add CSS shake animation dynamically
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ============================================================
   8. SMOOTH SCROLL — Polyfill for anchor links (legacy support)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ============================================================
   9. PROJECT CARDS — Tilt effect on mouse move
   ============================================================ */
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;   // Mouse X relative to card
    const y      = e.clientY - rect.top;    // Mouse Y relative to card
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;

    // Max tilt: 6 degrees
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) *  5;

    card.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ============================================================
   10. STAT NUMBERS — Count-up animation when in view
   ============================================================ */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el, target, suffix) {
  let current  = 0;
  const step   = Math.max(1, Math.floor(target / 50));
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 30);
}

// Parse the stat text (e.g. "3+" → target=3, suffix="+")
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const raw     = el.textContent;                 // e.g. "40+"
      const suffix  = raw.replace(/[0-9]/g, '');      // e.g. "+"
      const target  = parseInt(raw.replace(/\D/g, ''), 10); // e.g. 40

      animateCount(el, target, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(n => statObserver.observe(n));


/* ============================================================
   11. PAGE LOAD — Trigger initial hero reveals immediately
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  // Immediately show hero content (it's above the fold)
  const heroReveals = document.querySelectorAll('.hero .reveal-up');
  heroReveals.forEach(el => {
    // Small timeout per delay class to preserve stagger
    const delayMap = { 'delay-1': 150, 'delay-2': 300, 'delay-3': 450, 'delay-4': 600 };
    let delay = 80;

    for (const [cls, ms] of Object.entries(delayMap)) {
      if (el.classList.contains(cls)) { delay = ms; break; }
    }

    setTimeout(() => el.classList.add('visible'), delay);
  });
});