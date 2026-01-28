/**
 * La Maison Restaurant - Main JavaScript
 * Handles navigation, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavigation();
  initScrollHeader();
  initScrollAnimations();
  initSmoothScroll();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const body = document.body;

  if (!navToggle || !navMobile) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav-toggle--active');
    navMobile.classList.toggle('nav-mobile--active');
    body.style.overflow = navMobile.classList.contains('nav-mobile--active') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  const mobileLinks = navMobile.querySelectorAll('.nav-mobile__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav-toggle--active');
      navMobile.classList.remove('nav-mobile--active');
      body.style.overflow = '';
    });
  });

  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('nav-mobile--active')) {
      navToggle.classList.remove('nav-toggle--active');
      navMobile.classList.remove('nav-mobile--active');
      body.style.overflow = '';
    }
  });
}

/**
 * Header Scroll Effect
 * Adds background color when scrolling past hero section
 */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const scrollThreshold = 100;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  // Initial check
  handleScroll();

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Scroll Animations
 * Uses Intersection Observer to trigger animations when elements enter viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#" or empty
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Form Validation Helper
 * Basic client-side validation for forms
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    // Remove previous error states
    field.classList.remove('form__input--error');

    if (!field.value.trim()) {
      field.classList.add('form__input--error');
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        field.classList.add('form__input--error');
        isValid = false;
      }
    }

    // Phone validation
    if (field.type === 'tel' && field.value.trim()) {
      const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phonePattern.test(field.value)) {
        field.classList.add('form__input--error');
        isValid = false;
      }
    }
  });

  return isValid;
}

/**
 * Image Gallery Lightbox (optional enhancement)
 * Simple lightbox for venue gallery images
 */
function initLightbox() {
  const galleryImages = document.querySelectorAll('.venue-gallery__item img, .venue__image img');

  if (!galleryImages.length) return;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox__overlay"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Close">&times;</button>
      <img class="lightbox__image" src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const overlay = lightbox.querySelector('.lightbox__overlay');

  // Open lightbox
  galleryImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('lightbox--active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/**
 * Lazy Loading Images
 * Native lazy loading with fallback
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

/**
 * Current Year in Footer
 * Auto-update copyright year
 */
function updateCopyrightYear() {
  const yearElements = document.querySelectorAll('.footer__bottom p');
  const currentYear = new Date().getFullYear();

  yearElements.forEach(el => {
    el.textContent = el.textContent.replace(/\d{4}/, currentYear);
  });
}

// Initialize year update
updateCopyrightYear();
