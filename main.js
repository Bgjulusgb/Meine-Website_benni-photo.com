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
// NAVIGATION - VERBESSERT & OPTIMIERT
// ==========================================
const Navigation = {
  init() {
    this.header = document.querySelector('.header');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.bindEvents();
    this.setActiveLink();
    this.initTouchGestures();
    this.initKeyboardNav();
  },

  toggleMenu(forceClose = false) {
    if (forceClose) {
      this.isMenuOpen = false;
    } else {
      this.isMenuOpen = !this.isMenuOpen;
    }

    this.menuToggle?.classList.toggle('active', this.isMenuOpen);
    this.navMenu?.classList.toggle('active', this.isMenuOpen);
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';

    // Accessibility: Manage focus
    if (this.isMenuOpen) {
      this.navMenu?.setAttribute('aria-hidden', 'false');
      // Fokussiere erstes Nav-Link
      this.navLinks[0]?.focus();
    } else {
      this.navMenu?.setAttribute('aria-hidden', 'true');
      this.menuToggle?.focus();
    }

    console.log(`Menu ${this.isMenuOpen ? 'geöffnet' : 'geschlossen'}`);
  },

  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle && this.navMenu) {
      this.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Close menu on link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.toggleMenu(true);
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen &&
            !this.navMenu.contains(e.target) &&
            !this.menuToggle.contains(e.target)) {
          this.toggleMenu(true);
        }
      });
    }

    // Optimized scroll header effect with throttling
    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.pageYOffset;

      if (this.header) {
        this.header.classList.toggle('scrolled', currentScroll > 50);

        // Hide header on scroll down, show on scroll up (optional)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //   this.header.style.transform = 'translateY(-100%)';
        // } else {
        //   this.header.style.transform = 'translateY(0)';
        // }
      }

      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  },

  // Touch Gestures für Mobile-Menü (Swipe to close)
  initTouchGestures() {
    if (!this.navMenu) return;

    this.navMenu.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.navMenu.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  },

  handleSwipe() {
    // Swipe left to close (mindestens 100px)
    if (this.touchStartX - this.touchEndX > 100) {
      if (this.isMenuOpen) {
        this.toggleMenu(true);
        console.log('Menu closed via swipe gesture');
      }
    }
  },

  // Keyboard Navigation
  initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // ESC zum Schließen
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.toggleMenu(true);
      }

      // Tab-Navigation innerhalb des Menüs
      if (e.key === 'Tab' && this.isMenuOpen) {
        const focusableElements = this.navMenu?.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift+Tab auf erstem Element -> springe zum letzten
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab auf letztem Element -> springe zum ersten
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');

      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
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
// LIGHTBOX GALLERY - VERBESSERT & OPTIMIERT
// ==========================================
const Lightbox = {
  init() {
    this.images = document.querySelectorAll('.gallery-item img, [data-lightbox]');
    if (this.images.length === 0) return;

    this.currentIndex = 0;
    this.lightbox = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.isZoomed = false;

    this.bindGalleryItems();
    console.log(`Lightbox initialisiert mit ${this.images.length} Bildern`);
  },

  bindGalleryItems() {
    this.images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0'); // Keyboard accessible
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Bild ${index + 1} von ${this.images.length} öffnen`);

      img.addEventListener('click', () => this.open(index));

      // Keyboard support
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });
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
    // Button clicks
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));

    // Click außerhalb des Bildes zum Schließen
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Touch Gestures (Swipe)
    const imgContainer = this.lightbox.querySelector('.lightbox-container');
    imgContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    imgContainer.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    }, { passive: true });

    // Doppelklick zum Zoomen
    const lightboxImg = this.lightbox.querySelector('.lightbox-image');
    lightboxImg.addEventListener('dblclick', () => {
      this.toggleZoom();
    });

    // Preload nächstes und vorheriges Bild
    this.preloadAdjacentImages();
  },

  handleKeydown(e) {
    if (!this.lightbox) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowLeft') this.navigate(-1);
    if (e.key === 'ArrowRight') this.navigate(1);
    if (e.key === 'Home') this.navigateToFirst();
    if (e.key === 'End') this.navigateToLast();
  },

  handleSwipe() {
    const swipeDistanceX = this.touchStartX - this.touchEndX;
    const swipeDistanceY = this.touchStartY - this.touchEndY;
    const minSwipeDistance = 50;

    // Horizontaler Swipe (mehr als vertikal)
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
      // Swipe nach links -> nächstes Bild
      if (swipeDistanceX > minSwipeDistance) {
        this.navigate(1);
        console.log('Swipe: Nächstes Bild');
      }
      // Swipe nach rechts -> vorheriges Bild
      else if (swipeDistanceX < -minSwipeDistance) {
        this.navigate(-1);
        console.log('Swipe: Vorheriges Bild');
      }
    }
    // Vertikaler Swipe nach unten -> schließen
    else if (swipeDistanceY < -minSwipeDistance) {
      this.close();
      console.log('Swipe: Lightbox geschlossen');
    }
  },

  toggleZoom() {
    const img = this.lightbox.querySelector('.lightbox-image');
    this.isZoomed = !this.isZoomed;

    if (this.isZoomed) {
      img.style.transform = 'scale(2)';
      img.style.cursor = 'zoom-out';
      img.style.transition = 'transform 0.3s ease';
    } else {
      img.style.transform = 'scale(1)';
      img.style.cursor = 'zoom-in';
    }
  },

  navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
    this.updateLightboxImage();
  },

  navigateToFirst() {
    this.currentIndex = 0;
    this.updateLightboxImage();
  },

  navigateToLast() {
    this.currentIndex = this.images.length - 1;
    this.updateLightboxImage();
  },

  updateLightboxImage() {
    const newImg = this.images[this.currentIndex];
    const img = this.lightbox.querySelector('.lightbox-image');
    const counter = this.lightbox.querySelector('.lightbox-counter');

    // Fade out
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';

    setTimeout(() => {
      // Update image
      img.src = newImg.src;
      img.alt = newImg.alt || `Bild ${this.currentIndex + 1}`;
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

      // Reset zoom
      this.isZoomed = false;
      img.style.transform = 'scale(1)';
      img.style.cursor = 'zoom-in';

      // Fade in
      setTimeout(() => {
        img.style.opacity = '1';
      }, 50);

      // Preload angrenzende Bilder
      this.preloadAdjacentImages();
    }, 200);
  },

  preloadAdjacentImages() {
    // Preload nächstes Bild
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    const nextImg = new Image();
    nextImg.src = this.images[nextIndex].src;

    // Preload vorheriges Bild
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    const prevImg = new Image();
    prevImg.src = this.images[prevIndex].src;
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
// LAZY LOADING - VERBESSERT MIT PLACEHOLDER
// ==========================================
const LazyLoad = {
  init() {
    // Fallback für alte Browser
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
      return;
    }

    // IntersectionObserver mit optimierten Einstellungen
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.observer.unobserve(img);
        }
      });
    }, {
      // Bilder 50px vor dem Viewport laden (bessere UX)
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Alle Lazy-Load Bilder observieren
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    lazyImages.forEach(img => {
      // Placeholder-Effekt hinzufügen
      if (!img.src || img.src === '') {
        img.style.backgroundColor = 'var(--bg-secondary)';
        img.style.minHeight = '200px';
      }

      this.observer.observe(img);
    });

    console.log(`LazyLoad initialisiert für ${lazyImages.length} Bilder`);
  },

  loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src) return;

    // Erstelle neues Image-Objekt zum Preloading
    const imageLoader = new Image();

    imageLoader.onload = () => {
      // Fade-in Effekt
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';

      // Setze Source
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }

      // Fade in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.classList.add('loaded');
      });

      console.log(`Bild geladen: ${src.substring(0, 50)}...`);
    };

    imageLoader.onerror = () => {
      console.error(`Fehler beim Laden: ${src}`);
      img.classList.add('error');
      // Fallback-Bild oder Platzhalter
      img.style.backgroundColor = 'var(--bg-tertiary)';
    };

    // Starte Laden
    imageLoader.src = src;
  }
};

// ==========================================
// PRELOADER - MINIMALISTISCH & VEREINFACHT
// ==========================================
const Preloader = {
  init() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
      console.warn('Preloader element not found!');
      return;
    }

    // WICHTIG: Body Overflow blockieren beim Start
    document.body.style.overflow = 'hidden';

    // Sicherstellen, dass Preloader sichtbar ist
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';
    preloader.style.visibility = 'visible';

    let isComplete = false;

    console.log('✨ Preloader initialized - Minimalistisches Design ohne Prozentanzeige');

    // Keine Progress-Animation mehr nötig - nur Spinner läuft via CSS

    // Complete Loading Function - Vereinfacht
    const completeLoading = () => {
      if (isComplete) return;
      isComplete = true;

      // Kurze Verzögerung für sanften Übergang
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling

        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.remove();
          }
          document.body.classList.add('loaded');
          console.log('🎉 Preloader erfolgreich entfernt - Seite geladen');
        }, 600); // Wartet auf CSS Transition
      }, 300);
    };

    // STRATEGIE 1: Minimale Anzeigezeit (bessere UX)
    const minDisplayTime = 800; // Mindestens 800ms anzeigen
    const startTime = Date.now();

    // STRATEGIE 2: window.load Event
    const finishPreloader = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        if (!isComplete) {
          console.log('🏁 Seite vollständig geladen');
          completeLoading();
        }
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      // Page already loaded
      console.log('📄 Seite bereits geladen');
      finishPreloader();
    } else {
      window.addEventListener('load', finishPreloader, { once: true });
    }

    // STRATEGIE 3: Fallback - garantiert Abschluss nach max. 3 Sekunden
    setTimeout(() => {
      if (!isComplete) {
        console.log('⚠️ Preloader: 3s Fallback triggered');
        completeLoading();
      }
    }, 3000);

    console.log('✅ Minimalistischer Preloader gestartet');
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
// INITIALIZE ALL - wird später definiert
// ==========================================
// App wird nach allen Modulen definiert (siehe unten)

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
