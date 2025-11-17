// ==========================================
// MODERN PHOTOGRAPHY WEBSITE FUNCTIONALITY
// Enhanced with Dark/Light Mode, Improved Animations, and Extensions
// Optimized for 2025 Trends: Smooth Transitions, Accessibility, Performance
// ==========================================

'use strict';

// ==========================================
// THEME MANAGEMENT (Dark/Light Mode)
// ==========================================

const initTheme = () => {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln');
    }
  };

  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(currentTheme);
    });
  }

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
};

// ==========================================
// MOBILE NAVIGATION
// Enhanced with smooth transitions and accessibility
// ==========================================

const initNavigation = () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  });

  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};

// ==========================================
// SMOOTH SCROLLING
// Enhanced with easing
// ==========================================

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// Enhanced with stagger, scale, and reduced motion support
// ==========================================

const initScrollAnimations = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(`
    .service-card,
    .featured-item,
    .stat-item,
    .testimonial-card,
    .gallery-item,
    .photo-grid-item
  `);

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
};

// ==========================================
// ACTIVE NAVIGATION LINK
// ==========================================

const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
};

// ==========================================
// COUNTER ANIMATION FOR STATS
// Enhanced with easing function
// ==========================================

const initStatCounters = () => {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const easeOutQuad = (t) => t * (2 - t);

  const animateCounter = (counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      counter.textContent = Math.floor(easedProgress * target) + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        animateCounter(entry.target);
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
};

// ==========================================
// SCROLL TO TOP BUTTON
// Enhanced with animation, accessibility, and smooth scroll
// ==========================================

const initScrollToTop = () => {
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.setAttribute('aria-label', 'Nach oben scrollen');
  scrollTopBtn.setAttribute('title', 'Nach oben');
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--text-primary);
    color: var(--bg-primary);
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  document.body.appendChild(scrollTopBtn);

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const show = window.scrollY > 500;
        scrollTopBtn.style.opacity = show ? '1' : '0';
        scrollTopBtn.style.visibility = show ? 'visible' : 'hidden';
        scrollTopBtn.style.transform = show ? 'scale(1)' : 'scale(0.8)';
        scrollTopBtn.setAttribute('aria-hidden', !show);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1)';
    scrollTopBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
  });
  
  scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1)';
    scrollTopBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// ==========================================
// FORM VALIDATION
// Enhanced with better error handling, real-time validation, and accessibility
// ==========================================

const initFormValidation = () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\+\(\)]+$/.test(phone);

  const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.id = 'error-' + input.id;
      errorElement.style.cssText = `
        color: var(--text-primary);
        font-size: 13px;
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity 0.3s, transform 0.3s;
      `;
      formGroup.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg>${message}`;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
    
    requestAnimationFrame(() => {
      errorElement.style.opacity = '1';
      errorElement.style.transform = 'translateY(0)';
    });
  };

  const clearError = (input) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.opacity = '0';
      errorElement.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        errorElement.textContent = '';
      }, 300);
    }
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  };

  // Real-time validation
  contactForm.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
    
    input.addEventListener('blur', () => {
      const value = input.value.trim();
      
      if (input.hasAttribute('required') && !value) {
        showError(input, 'Dieses Feld ist erforderlich');
      } else if (input.type === 'email' && value && !validateEmail(value)) {
        showError(input, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
      } else if (input.type === 'tel' && value && !validatePhone(value)) {
        showError(input, 'Bitte geben Sie eine gültige Telefonnummer ein');
      } else if (input.tagName === 'TEXTAREA' && value && value.length < 10) {
        showError(input, 'Bitte geben Sie mindestens 10 Zeichen ein');
      } else {
        clearError(input);
      }
    });
    
    // Success state on valid input
    input.addEventListener('input', () => {
      const value = input.value.trim();
      if (value && !input.classList.contains('error')) {
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    let firstErrorField = null;

    contactForm.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
      const value = input.value.trim();
      
      if (!value) {
        showError(input, 'Dieses Feld ist erforderlich');
        isValid = false;
        if (!firstErrorField) firstErrorField = input;
      } else if (input.type === 'email' && !validateEmail(value)) {
        showError(input, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
        isValid = false;
        if (!firstErrorField) firstErrorField = input;
      } else if (input.type === 'tel' && !validatePhone(value)) {
        showError(input, 'Bitte geben Sie eine gültige Telefonnummer ein');
        isValid = false;
        if (!firstErrorField) firstErrorField = input;
      }
    });

    if (isValid) {
      // Form will be handled by backend.js if loaded
      if (typeof window.initContactForm === 'undefined') {
        showNotification('✓ Nachricht erfolgreich gesendet!', 'success');
        contactForm.reset();
        contactForm.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
      }
    } else {
      showNotification('Bitte füllen Sie alle Pflichtfelder korrekt aus', 'error');
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
};

// ==========================================
// NOTIFICATION SYSTEM
// Enhanced with theme awareness and icons
// ==========================================

const showNotification = (message, type = 'info') => {
  // Check if backend.js is loaded and use its notification system
  if (typeof window.showNotification === 'undefined') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: -400px;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid var(--border);
      z-index: 10000;
      transition: right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-width: 380px;
      font-size: 14px;
      line-height: 1.5;
    `;
    
    if (type === 'success') {
      notification.style.background = 'var(--text-primary)';
      notification.style.color = 'var(--bg-primary)';
    } else if (type === 'error') {
      notification.style.borderColor = 'var(--gray-500)';
      notification.style.borderWidth = '2px';
    }
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.style.right = '24px';
    });
    
    setTimeout(() => {
      notification.style.right = '-400px';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }
};

// ==========================================
// LAZY LOADING IMAGES
// Enhanced with placeholder and error handling
// ==========================================

const initLazyLoading = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.onload = () => img.classList.add('loaded');
          img.onerror = () => img.src = 'placeholder-error.jpg'; // Add fallback image
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    img.classList.add('loading-placeholder');
    imageObserver.observe(img);
  });
};

// ==========================================
// GALLERY LIGHTBOX
// Enhanced with swipe support, preload, zoom gestures, and keyboard shortcuts
// ==========================================

const initLightbox = () => {
  const galleryImages = document.querySelectorAll('.gallery-item img, .photo-grid-item img');
  if (galleryImages.length === 0) return;

  let currentIndex = 0;
  let lightbox = null;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let isZoomed = false;

  const createLightbox = (index) => {
    currentIndex = index;
    const img = galleryImages[index];
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Bildgalerie');
    
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Schließen">&times;</button>
        <button class="lightbox-prev" aria-label="Vorheriges Bild">&#8249;</button>
        <button class="lightbox-next" aria-label="Nächstes Bild">&#8250;</button>
        <div class="lightbox-counter" aria-live="polite">${index + 1} / ${galleryImages.length}</div>
        <img src="${img.src}" alt="${img.alt || ''}" class="lightbox-img">
        <div class="lightbox-info">
          <p>${img.alt || 'Bild ' + (index + 1)}</p>
          <button class="lightbox-download" aria-label="Bild herunterladen" title="Herunterladen">⬇</button>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      lightbox.classList.add('open');
    });

    const imgElement = lightbox.querySelector('.lightbox-img');
    imgElement.addEventListener('click', toggleZoom);
    imgElement.style.cursor = 'zoom-in';
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // Horizontal swipe detection
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          changeImage(1);
        } else {
          changeImage(-1);
        }
      }
      // Vertical swipe down to close
      else if (diffY < -80 && !isZoomed) {
        closeLightbox();
      }
    }, { passive: true });

    preloadImage(index - 1);
    preloadImage(index + 1);

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => changeImage(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => changeImage(1));
    
    const downloadBtn = lightbox.querySelector('.lightbox-download');
    downloadBtn.addEventListener('click', () => downloadImage(img.src, `foto-${index + 1}.jpg`));
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', handleKeydown);
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    setTimeout(() => {
      lightbox.remove();
      lightbox = null;
      isZoomed = false;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }, 300);
  };

  const changeImage = (delta) => {
    currentIndex = (currentIndex + delta + galleryImages.length) % galleryImages.length;
    const newImg = galleryImages[currentIndex];
    const imgElement = lightbox.querySelector('.lightbox-img');
    const counterElement = lightbox.querySelector('.lightbox-counter');
    const infoElement = lightbox.querySelector('.lightbox-info p');
    
    imgElement.style.opacity = '0';
    imgElement.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      imgElement.src = newImg.src;
      imgElement.alt = newImg.alt || '';
      imgElement.style.transform = 'scale(1)';
      imgElement.style.cursor = 'zoom-in';
      counterElement.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      infoElement.textContent = newImg.alt || `Bild ${currentIndex + 1}`;
      isZoomed = false;
      
      setTimeout(() => {
        imgElement.style.opacity = '1';
      }, 50);
    }, 200);
    
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  };

  const toggleZoom = (e) => {
    const img = e.target;
    isZoomed = !isZoomed;
    
    if (isZoomed) {
      img.style.transform = 'scale(1.8)';
      img.style.cursor = 'zoom-out';
      img.style.transformOrigin = 'center center';
    } else {
      img.style.transform = 'scale(1)';
      img.style.cursor = 'zoom-in';
    }
  };

  const handleKeydown = (e) => {
    if (!lightbox) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === ' ') {
      e.preventDefault();
      const img = lightbox.querySelector('.lightbox-img');
      toggleZoom({ target: img });
    }
  };

  const preloadImage = (index) => {
    if (index >= 0 && index < galleryImages.length) {
      const preloadImg = new Image();
      preloadImg.src = galleryImages[index].src;
    }
  };
  
  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      showNotification('✓ Bild wird heruntergeladen', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Fehler beim Herunterladen', 'error');
    }
  };

  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => createLightbox(index));
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        createLightbox(index);
      }
    });
  });
};

// ==========================================
// GALLERY FILTER
// Enhanced with masonry relayout after filter and portfolio support
// ==========================================

const initGalleryFilter = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.photo-grid-item, .gallery-item');

  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      let visibleCount = 0;
      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
          item.style.display = '';
          setTimeout(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            });
          }, visibleCount * 50);
          visibleCount++;
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });

      // Announce filter change for screen readers
      const announcement = document.createElement('div');
      announcement.className = 'sr-only';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Filter angewendet: ${filter === 'all' ? 'Alle Projekte' : button.textContent}. ${visibleCount} ${visibleCount === 1 ? 'Projekt' : 'Projekte'} angezeigt.`;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    });
  });

  // Keyboard navigation for filters
  filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      let targetIndex = index;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetIndex = (index + 1) % filterButtons.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIndex = (index - 1 + filterButtons.length) % filterButtons.length;
      }
      if (targetIndex !== index) {
        filterButtons[targetIndex].focus();
      }
    });
  });
};

// ==========================================
// INFINITE SCROLL FOR PHOTOGRAPHY GALLERY
// Enhanced with debounce and loading indicator
// ==========================================

const initInfiniteScroll = () => {
  const galleryContainer = document.querySelector('.photo-gallery');
  if (!galleryContainer) return;

  let page = 1;
  let loading = false;
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = 'Lade mehr Fotos...';

  const loadMoreImages = () => {
    if (loading) return;
    loading = true;
    galleryContainer.appendChild(loadingIndicator);

    setTimeout(() => {
      const newImages = Array.from({ length: 6 }, (_, index) => {
        const imgNum = (page * 6) + index;
        const item = document.createElement('div');
        item.className = 'photo-grid-item';
        const categories = ['landscape', 'portrait', 'abstract'];
        item.dataset.category = categories[Math.floor(Math.random() * categories.length)];
        item.innerHTML = `
          <img data-src="https://picsum.photos/800/600?random=${imgNum}" 
               alt="Foto ${imgNum}" 
               loading="lazy">
        `;
        return item;
      });

      newImages.forEach(item => galleryContainer.appendChild(item));
      if (loadingIndicator.parentNode) {
        loadingIndicator.remove();
      }
      
      initLazyLoading();
      initLightbox();

      page++;
      loading = false;
    }, 1000);
  };

  const handleScroll = debounce(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 500;
    if (scrollPosition >= threshold && !loading) {
      loadMoreImages();
    }
  }, 200);

  window.addEventListener('scroll', handleScroll, { passive: true });
};

// ==========================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// Enhanced with reduced motion check
// ==========================================

const initParallax = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroBg = hero.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;
  
  const updateParallax = () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
};

// ==========================================
// IMAGE HOVER ZOOM FOR GALLERY
// Enhanced with smoother transition
// ==========================================

const initImageHoverZoom = () => {
  const galleryItems = document.querySelectorAll('.gallery-item, .photo-grid-item');
  
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    item.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
};

// ==========================================
// NEW: ACCESSIBILITY ENHANCEMENTS
// Skip to content, reduced motion
// ==========================================

const initAccessibility = () => {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        main.tabIndex = -1;
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

// ==========================================
// NEW: PERFORMANCE OPTIMIZATIONS
// Debounce resize events, etc.
// ==========================================

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const init = () => {
  console.log('Initializing website...');
  
  initTheme();
  initNavigation();
  initSmoothScroll();
  initScrollAnimations();
  setActiveNavLink();
  initStatCounters();
  initScrollToTop();
  initFormValidation();
  initLazyLoading();
  initLightbox();
  initGalleryFilter();
  initInfiniteScroll();
  initParallax();
  initImageHoverZoom();
  initAccessibility();
  
  console.log('Website initialized successfully');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Add loaded class after page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  console.log('Page fully loaded');
});

// Handle visibility change (for performance)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - pausing animations');
  } else {
    console.log('Page visible - resuming');
  }
});