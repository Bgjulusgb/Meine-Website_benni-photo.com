/*
===========================================
BENJAMIN GILLMANN PHOTOGRAPHY
Modern JavaScript 2025
All Interactive Features
===========================================
*/

'use strict';

// ==========================================
// THEME TOGGLE
// ==========================================
const ThemeManager = {
  init() {
    this.toggle = document.getElementById('themeToggle');
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.currentTheme = localStorage.getItem('theme') ||
                        (this.prefersDark.matches ? 'dark' : 'light');

    this.setTheme(this.currentTheme);
    this.bindEvents();
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (this.toggle) {
      const icon = theme === 'dark' ? '☀️' : '🌙';
      const slider = this.toggle.querySelector('.theme-toggle-slider');
      if (slider) slider.textContent = icon;
    }
  },

  bindEvents() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.currentTheme);
      });
    }

    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};

// ==========================================
// NAVIGATION
// ==========================================
const Navigation = {
  init() {
    this.header = document.querySelector('.header');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.bindEvents();
    this.setActiveLink();
  },

  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle && this.navMenu) {
      this.menuToggle.addEventListener('click', () => {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow =
          this.navMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu on link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.menuToggle.classList.remove('active');
          this.navMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.navMenu.classList.contains('active') &&
            !this.navMenu.contains(e.target) &&
            !this.menuToggle.contains(e.target)) {
          this.menuToggle.classList.remove('active');
          this.navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Scroll header effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (this.header) {
        this.header.classList.toggle('scrolled', currentScroll > 50);
      }

      lastScroll = currentScroll;
    }, { passive: true });
  },

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }
};

// ==========================================
// SMOOTH SCROLL
// ==========================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
const ScrollAnimations = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal, .card, .gallery-item').forEach(el => {
      el.classList.add('scroll-reveal');
      this.observer.observe(el);
    });
  }
};

// ==========================================
// LIGHTBOX GALLERY
// ==========================================
const Lightbox = {
  init() {
    this.images = document.querySelectorAll('.gallery-item img, [data-lightbox]');
    if (this.images.length === 0) return;

    this.currentIndex = 0;
    this.lightbox = null;
    this.bindGalleryItems();
  },

  bindGalleryItems() {
    this.images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(index));
    });
  },

  open(index) {
    this.currentIndex = index;
    const img = this.images[index];

    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox-overlay';
    this.lightbox.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close" aria-label="Schließen">&times;</button>
        <button class="lightbox-prev" aria-label="Vorheriges">&lsaquo;</button>
        <button class="lightbox-next" aria-label="Nächstes">&rsaquo;</button>
        <img src="${img.src}" alt="${img.alt || ''}" class="lightbox-image">
        <div class="lightbox-counter">${index + 1} / ${this.images.length}</div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .lightbox-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .lightbox-overlay.active { opacity: 1; }
      .lightbox-container {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      .lightbox-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 10px;
      }
      .lightbox-close,
      .lightbox-prev,
      .lightbox-next {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      .lightbox-close:hover,
      .lightbox-prev:hover,
      .lightbox-next:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
      .lightbox-close {
        top: 20px;
        right: 20px;
      }
      .lightbox-prev {
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-next {
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
      .lightbox-counter {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        backdrop-filter: blur(10px);
      }
      @media (max-width: 768px) {
        .lightbox-prev,
        .lightbox-next {
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
        }
        .lightbox-close {
          top: 10px;
          right: 10px;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.lightbox);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      this.lightbox.classList.add('active');
    });

    this.bindLightboxEvents();
  },

  bindLightboxEvents() {
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', this.handleKeydown.bind(this));
  },

  handleKeydown(e) {
    if (!this.lightbox) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowLeft') this.navigate(-1);
    if (e.key === 'ArrowRight') this.navigate(1);
  },

  navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
    const newImg = this.images[this.currentIndex];
    const img = this.lightbox.querySelector('.lightbox-image');
    const counter = this.lightbox.querySelector('.lightbox-counter');

    img.style.opacity = '0';
    setTimeout(() => {
      img.src = newImg.src;
      img.alt = newImg.alt || '';
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
      img.style.opacity = '1';
    }, 200);
  },

  close() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    setTimeout(() => {
      this.lightbox.remove();
      this.lightbox = null;
      document.body.style.overflow = '';
    }, 300);
    document.removeEventListener('keydown', this.handleKeydown);
  }
};

// ==========================================
// FORM VALIDATION
// ==========================================
const FormValidator = {
  init() {
    this.form = document.querySelector('form[data-validate]');
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submitForm();
      }
    });

    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  },

  validate() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input[required], textarea[required]');

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;

    // Clear previous errors
    this.clearError(field);

    // Required check
    if (field.hasAttribute('required') && !value) {
      this.showError(field, 'Dieses Feld ist erforderlich');
      return false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
        return false;
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        this.showError(field, 'Bitte geben Sie eine gültige Telefonnummer ein');
        return false;
      }
    }

    // Min length
    if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      this.showError(field, 'Bitte geben Sie mindestens 10 Zeichen ein');
      return false;
    }

    return true;
  },

  showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  },

  clearError(field) {
    field.classList.remove('error');
    const error = field.parentNode.querySelector('.error-message');
    if (error) error.remove();
  },

  submitForm() {
    // Show success message
    this.showNotification('Nachricht erfolgreich gesendet!', 'success');
    this.form.reset();
  },

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// ==========================================
// LAZY LOADING
// ==========================================
const LazyLoad = {
  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          this.observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      this.observer.observe(img);
    });
  }
};

// ==========================================
// PRELOADER - KOMPLETT NEU & ROBUST
// ==========================================
const Preloader = {
  init() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const percentageEl = document.querySelector('.preloader-percentage');
    const progressBar = document.querySelector('.preloader-progress');
    const textEl = document.querySelector('.preloader-text');

    let currentProgress = 0;
    let targetProgress = 0;
    let isComplete = false;
    let animationFrameId = null;

    // Smooth Progress Animation with easing
    const animateProgress = () => {
      if (isComplete) return;

      // Smooth easing towards target
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.1) {
        currentProgress += diff * 0.15; // Smooth easing
      } else {
        currentProgress = targetProgress;
      }

      const displayProgress = Math.floor(currentProgress);

      // Update UI elements
      if (percentageEl) {
        percentageEl.textContent = `${displayProgress}%`;
        percentageEl.setAttribute('data-progress', displayProgress);
      }

      if (progressBar) {
        progressBar.style.setProperty('--progress', `${currentProgress}%`);
      }

      // Update loading text
      if (textEl) {
        if (displayProgress < 25) textEl.textContent = 'Initializing...';
        else if (displayProgress < 50) textEl.textContent = 'Loading Assets...';
        else if (displayProgress < 75) textEl.textContent = 'Preparing Interface...';
        else if (displayProgress < 95) textEl.textContent = 'Almost Ready...';
        else if (displayProgress >= 95 && displayProgress < 100) textEl.textContent = 'Finalizing...';
        else textEl.textContent = 'Complete!';
      }

      // Check if we reached 100%
      if (currentProgress >= 99.9 && !isComplete) {
        isComplete = true;
        completeLoading();
        return;
      }

      // Continue animation
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    // Complete Loading Function
    const completeLoading = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling

        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.remove();
          }
          document.body.classList.add('loaded');
        }, 800);
      }, 400);
    };

    // STRATEGIE 1: Zeitbasierte Stages (garantiert mindestens diesen Fortschritt)
    const timeBasedStages = [
      { delay: 0, progress: 0 },
      { delay: 100, progress: 20 },
      { delay: 300, progress: 35 },
      { delay: 500, progress: 50 },
      { delay: 800, progress: 65 },
      { delay: 1200, progress: 80 }
    ];

    timeBasedStages.forEach(stage => {
      setTimeout(() => {
        if (!isComplete) {
          targetProgress = Math.max(targetProgress, stage.progress);
        }
      }, stage.delay);
    });

    // STRATEGIE 2: Ressourcen-basiertes Tracking
    let loadedResources = 0;
    const images = Array.from(document.images);
    const totalImages = images.length;

    const updateResourceProgress = () => {
      loadedResources++;
      if (totalImages > 0) {
        const resourceProgress = 50 + Math.floor((loadedResources / totalImages) * 35); // 50-85%
        targetProgress = Math.max(targetProgress, resourceProgress);
      }
    };

    // Track all images
    images.forEach(img => {
      if (img.complete) {
        updateResourceProgress();
      } else {
        img.addEventListener('load', updateResourceProgress, { once: true });
        img.addEventListener('error', updateResourceProgress, { once: true });
      }
    });

    // Track fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!isComplete) {
          targetProgress = Math.max(targetProgress, 85);
        }
      }).catch(() => {
        // Font loading failed, continue anyway
        targetProgress = Math.max(targetProgress, 85);
      });
    }

    // STRATEGIE 3: window.load Event - TRIGGER ZU 100%
    const finishPreloader = () => {
      setTimeout(() => {
        if (!isComplete) {
          targetProgress = 100;
        }
      }, 100);
    };

    if (document.readyState === 'complete') {
      // Page already loaded
      finishPreloader();
    } else {
      window.addEventListener('load', finishPreloader, { once: true });
    }

    // STRATEGIE 4: Fallback - garantiert Abschluss nach max. 5 Sekunden
    setTimeout(() => {
      if (!isComplete) {
        console.log('Preloader: Fallback triggered - forcing completion');
        targetProgress = 100;
      }
    }, 5000);

    // STRATEGIE 5: Notfall-Fallback - hart abbrechen nach 8 Sekunden
    setTimeout(() => {
      if (!isComplete) {
        console.warn('Preloader: Emergency fallback - force removing preloader');
        isComplete = true;
        preloader.classList.add('hidden');
        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.remove();
          }
        }, 800);
      }
    }, 8000);

    // Start animation loop
    animateProgress();

    console.log('Preloader initialized with multiple strategies');
  }
};

// ==========================================
// SCROLL TO TOP
// ==========================================
const ScrollToTop = {
  init() {
    this.button = document.createElement('button');
    this.button.className = 'scroll-to-top';
    this.button.innerHTML = '↑';
    this.button.setAttribute('aria-label', 'Nach oben scrollen');

    this.button.style.cssText = `
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
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--shadow-xl);
    `;

    document.body.appendChild(this.button);

    window.addEventListener('scroll', () => {
      const show = window.pageYOffset > 500;
      this.button.style.opacity = show ? '1' : '0';
      this.button.style.visibility = show ? 'visible' : 'hidden';
      this.button.style.transform = show ? 'scale(1)' : 'scale(0.8)';
    }, { passive: true });

    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ==========================================
// INITIALIZE ALL
// ==========================================
const App = {
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initModules());
    } else {
      this.initModules();
    }
  },

  initModules() {
    ThemeManager.init();
    Navigation.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    Lightbox.init();
    FormValidator.init();
    LazyLoad.init();
    Preloader.init();
    ScrollToTop.init();

    // Add loaded class
    document.body.classList.add('loaded');
  }
};

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
const PerformanceMonitor = {
  init() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }

      // Monitor First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Silently fail
      }
    }

    // Monitor Page Load Time
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page Load Time: ${pageLoadTime}ms`);
    });
  }
};

// ==========================================
// ERROR HANDLER & REPORTING
// ==========================================
const ErrorHandler = {
  init() {
    window.addEventListener('error', (event) => {
      console.error('Error caught:', event.error);
      // In production, send to error tracking service
      // this.reportError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // In production, send to error tracking service
      // this.reportError(event.reason);
    });
  },

  reportError(error) {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }
};

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================
const AccessibilityManager = {
  init() {
    // Focus visible for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    });

    // Skip to main content
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('#main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      });
    }

    // Add ARIA labels dynamically where needed
    this.enhanceARIA();
  },

  enhanceARIA() {
    // Add aria-current to active nav links
    document.querySelectorAll('.nav-link.active').forEach(link => {
      link.setAttribute('aria-current', 'page');
    });

    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '');
      console.warn('Image missing alt text:', img.src);
    });
  }
};

// ==========================================
// SERVICE WORKER REGISTRATION (PWA)
// ==========================================
const PWAManager = {
  init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration.scope);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }
};

// ==========================================
// IMAGE OPTIMIZATION
// ==========================================
const ImageOptimizer = {
  init() {
    // Add loading="lazy" to all images if not set
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Use Intersection Observer for advanced lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
};

// ==========================================
// ANALYTICS (Placeholder for GA4, etc.)
// ==========================================
const Analytics = {
  init() {
    // Track page views
    this.trackPageView();

    // Track clicks on important elements
    document.querySelectorAll('.btn, .nav-link, .card').forEach(element => {
      element.addEventListener('click', () => {
        this.trackEvent('click', element.className, element.textContent);
      });
    });
  },

  trackPageView() {
    // Google Analytics 4 example
    // gtag('config', 'G-XXXXXXXXXX', {
    //   'page_path': window.location.pathname
    // });
    console.log('Page view tracked:', window.location.pathname);
  },

  trackEvent(action, category, label) {
    // Google Analytics 4 example
    // gtag('event', action, {
    //   'event_category': category,
    //   'event_label': label
    // });
    console.log('Event tracked:', { action, category, label });
  }
};

// ==========================================
// INITIALIZE ALL - ENHANCED
// ==========================================
const App = {
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initModules());
    } else {
      this.initModules();
    }
  },

  initModules() {
    // Core modules
    ThemeManager.init();
    Navigation.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    Lightbox.init();
    FormValidator.init();
    LazyLoad.init();
    Preloader.init();
    ScrollToTop.init();

    // Enhanced modules
    PerformanceMonitor.init();
    ErrorHandler.init();
    AccessibilityManager.init();
    PWAManager.init();
    ImageOptimizer.init();
    Analytics.init();

    // Add loaded class
    document.body.classList.add('loaded');

    console.log('🚀 Benjamin Gillmann Photography - Loaded Successfully!');
  }
};

// Start the app
App.init();
