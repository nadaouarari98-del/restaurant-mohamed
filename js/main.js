/**
 * La Maison Restaurant - Main JavaScript
 * Handles navigation, animations, and interactions
 */

console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  // Initialize all components
  initNavigation();
  initScrollHeader();
  initScrollAnimations();
  initSmoothScroll();
  initVenueForm();
  initContactForm();
  initCarousel();
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

  // Close mobile nav when clicking a link (but not submenu triggers)
  const mobileLinks = navMobile.querySelectorAll('.nav-mobile__link:not(.nav-mobile__link--submenu)');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav-toggle--active');
      navMobile.classList.remove('nav-mobile--active');
      body.style.overflow = '';
    });
  });

  // Also close when clicking submenu links
  const subLinks = navMobile.querySelectorAll('.nav-mobile__sub-link');
  subLinks.forEach(link => {
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

  // Mobile slide-out submenu navigation
  const cateringToggle = document.getElementById('cateringToggle');
  const cateringBack = document.getElementById('cateringBack');
  const navMobileMain = document.getElementById('navMobileMain');
  const cateringSubmenu = document.getElementById('cateringSubmenu');

  if (cateringToggle) {
    cateringToggle.addEventListener('click', (e) => {
      console.log('Catering button clicked!');
      e.preventDefault();
      e.stopPropagation();
      navMobileMain.classList.add('is-hidden');
      cateringSubmenu.classList.add('is-visible');
      console.log('Submenu should now be visible');
    });
  } else {
    console.error('cateringToggle element not found');
  }

  if (cateringBack) {
    cateringBack.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMobileMain.classList.remove('is-hidden');
      cateringSubmenu.classList.remove('is-visible');
    });
  } else {
    console.error('cateringBack element not found');
  }
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

/**
 * Venue Inquiry Form Handler
 * Handles form submission and shows success modal
 */
function initVenueForm() {
  const venueForm = document.getElementById('venueForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');

  if (!venueForm) return;
  if (!successModal) {
    console.warn('Success modal not found');
    return;
  }

  // Ensure modal is initially hidden
  successModal.classList.remove('modal--active');
  document.body.style.overflow = '';

  // Handle form submission
  venueForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm(venueForm)) {
      return;
    }

    // Submit form data to Netlify
    const formData = new FormData(venueForm);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        // Show success modal
        successModal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        // Reset form
        venueForm.reset();
      } else {
        alert('There was an error submitting the form. Please try again.');
      }
    } catch (error) {
      // For local testing without Netlify, still show the modal
      successModal.classList.add('modal--active');
      document.body.style.overflow = 'hidden';
      venueForm.reset();
    }
  });

  // Close modal handlers
  const closeModal = () => {
    successModal.classList.remove('modal--active');
    document.body.style.overflow = '';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on overlay click
  const modalOverlay = successModal.querySelector('.modal__overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('modal--active')) {
      closeModal();
    }
  });
}

/**
 * Contact Form Handler
 * Handles form submission and shows success modal
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('contactSuccessModal');
  const closeModalBtn = document.getElementById('closeContactModal');

  if (!contactForm) return;
  if (!successModal) {
    console.warn('Contact success modal not found');
    return;
  }

  // Ensure modal is initially hidden
  successModal.classList.remove('modal--active');
  document.body.style.overflow = '';

  // Handle form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm(contactForm)) {
      return;
    }

    // Submit form data to Netlify
    const formData = new FormData(contactForm);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        // Show success modal
        successModal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        // Reset form
        contactForm.reset();
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      // For local testing without Netlify, still show the modal
      successModal.classList.add('modal--active');
      document.body.style.overflow = 'hidden';
      contactForm.reset();
    }
  });

  // Close modal handlers
  const closeModal = () => {
    successModal.classList.remove('modal--active');
    document.body.style.overflow = '';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on overlay click
  const modalOverlay = successModal.querySelector('.modal__overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('modal--active')) {
      closeModal();
    }
  });
}
/**
 * Menu Carousel - smooth drag, swipe & momentum scrolling
 */
function initCarousel() {
  const carousel = document.getElementById('menuCarousel');
  if (!carousel) return;

  let isActive    = false;  // true once axis confirmed horizontal
  let isDragging  = false;  // mouse drag in progress
  let startX      = 0;
  let startY      = 0;
  let startScrollLeft = 0;
  let lastX       = 0;
  let lastTimestamp = 0;
  let velocity    = 0;      // px/ms, positive = scrolling right
  let momentumId  = null;
  let axisLocked  = false;  // swipe axis determined?

  // helpers
  function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
  function getY(e) { return e.touches ? e.touches[0].clientY : e.clientY; }

  function cancelMomentum() {
    if (momentumId) { cancelAnimationFrame(momentumId); momentumId = null; }
  }

  function disableSnap() { carousel.style.scrollSnapType = 'none'; }
  function enableSnap() {
    requestAnimationFrame(() => { carousel.style.scrollSnapType = ''; });
  }

  // touch start
  function onTouchStart(e) {
    cancelMomentum();
    isActive        = false;
    axisLocked      = false;
    startX          = getX(e);
    startY          = getY(e);
    startScrollLeft = carousel.scrollLeft;
    lastX           = startX;
    lastTimestamp   = Date.now();
    velocity        = 0;
  }

  // touch move
  function onTouchMove(e) {
    const x  = getX(e);
    const y  = getY(e);
    const dx = x - startX;
    const dy = y - startY;

    if (!axisLocked) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      axisLocked = true;
      if (Math.abs(dy) > Math.abs(dx)) { isActive = false; return; }
      isActive = true;
      disableSnap();
    }

    if (!isActive) return;
    e.preventDefault();

    carousel.scrollLeft = startScrollLeft - dx;

    const now = Date.now();
    const dt  = now - lastTimestamp || 1;
    velocity  = (lastX - x) / dt;
    lastX     = x;
    lastTimestamp = now;
  }

  // touch end
  function onTouchEnd() {
    if (!isActive) return;
    isActive = false;
    applyMomentum();
  }

  // mouse drag
  function onMouseDown(e) {
    if (e.button !== 0) return;
    cancelMomentum();
    isDragging      = true;
    startX          = e.clientX;
    startScrollLeft = carousel.scrollLeft;
    lastX           = startX;
    lastTimestamp   = Date.now();
    velocity        = 0;
    carousel.style.cursor = 'grabbing';
    disableSnap();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x  = e.clientX;
    const dx = x - startX;
    carousel.scrollLeft = startScrollLeft - dx;
    const now = Date.now();
    const dt  = now - lastTimestamp || 1;
    velocity  = (lastX - x) / dt;
    lastX     = x;
    lastTimestamp = now;
  }

  function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    applyMomentum();
  }

  // shared momentum (frame-rate independent)
  function applyMomentum() {
    const FRICTION  = 0.94;   // higher = longer, smoother coast
    const MIN_VEL   = 0.05;   // px/ms stop threshold
    let   lastFrame = performance.now();

    function step(now) {
      const dt = Math.min(now - lastFrame, 32); // cap at 32 ms
      lastFrame = now;
      if (Math.abs(velocity) < MIN_VEL) { enableSnap(); return; }
      carousel.scrollLeft += velocity * dt;
      velocity *= Math.pow(FRICTION, dt / 16); // normalise to 60fps
      momentumId = requestAnimationFrame(step);
    }

    if (Math.abs(velocity) > MIN_VEL) {
      momentumId = requestAnimationFrame(step);
    } else {
      enableSnap();
    }
  }

  // bind events
  carousel.addEventListener('touchstart',  onTouchStart, { passive: true  });
  carousel.addEventListener('touchmove',   onTouchMove,  { passive: false });
  carousel.addEventListener('touchend',    onTouchEnd,   { passive: true  });
  carousel.addEventListener('touchcancel', onTouchEnd,   { passive: true  });

  carousel.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove',   onMouseMove);
  window.addEventListener('mouseup',     onMouseUp);

  carousel.addEventListener('dragstart', e => e.preventDefault());
}
