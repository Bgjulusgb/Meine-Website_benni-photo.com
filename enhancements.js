/*
===========================================
BENJAMIN GILLMANN PHOTOGRAPHY
ERWEITERTE JAVASCRIPT-FUNKTIONALITÄT 2025
Buchstabeneffekte, Galerie-Animationen & mehr
===========================================
*/

'use strict';

// ==========================================
// BUCHSTABENEFFEKTE MODULE
// ==========================================
const TextEffects = {
  init() {
    this.initSplitText();
    this.initGlitchEffect();
    this.initWaveEffect();
    console.log('✨ TextEffects initialized');
  },

  // Split Text in einzelne Buchstaben
  initSplitText() {
    const elements = document.querySelectorAll('.text-split-reveal');

    elements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.innerHTML = '';

      // Splitte Text in Buchstaben
      const letters = text.split('');
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = letter === ' ' ? '\u00A0' : letter; // Leerzeichen erhalten
        span.style.animationDelay = `${index * 0.05}s`;
        element.appendChild(span);
      });
    });

    console.log(`Split text effect applied to ${elements.length} elements`);
  },

  // Glitch Effect Setup
  initGlitchEffect() {
    const elements = document.querySelectorAll('.text-glitch');

    elements.forEach(element => {
      const text = element.textContent;
      element.setAttribute('data-text', text);
    });

    console.log(`Glitch effect applied to ${elements.length} elements`);
  },

  // Wave Effect für Text
  initWaveEffect() {
    const elements = document.querySelectorAll('.text-wave');

    elements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';

      const letters = text.split('');
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.animationDelay = `${index * 0.1}s`;
        element.appendChild(span);
      });
    });

    console.log(`Wave effect applied to ${elements.length} elements`);
  }
};

// ==========================================
// ERWEITERTE GALERIE-ANIMATIONEN
// ==========================================
const GalleryAnimations = {
  init() {
    this.observeGalleryItems();
    this.initHoverEffects();
    this.initCategoryBadges();
    this.initRippleEffect();
    console.log('🖼️  GalleryAnimations initialized');
  },

  // Intersection Observer für Stagger-Animationen
  observeGalleryItems() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Zeige alle Items sofort bei reduced motion
      document.querySelectorAll('.gallery-item, .photo-grid-item').forEach(item => {
        item.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger-Delay basierend auf Position
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100); // 100ms zwischen jedem Item

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const items = document.querySelectorAll('.gallery-item, .photo-grid-item');
    items.forEach(item => {
      observer.observe(item);
    });

    console.log(`Observing ${items.length} gallery items`);
  },

  // Parallax Hover-Effekt
  initHoverEffects() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;

      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtile Parallax-Bewegung
        img.style.transform = `scale(1.1) translate(${deltaX * 10}px, ${deltaY * 10}px)`;
      });

      item.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });

    console.log(`Hover effects initialized for ${items.length} items`);
  },

  // Dynamische Kategorie-Badges
  initCategoryBadges() {
    const items = document.querySelectorAll('.gallery-item[data-category]');

    items.forEach(item => {
      const category = item.dataset.category;
      if (!category) return;

      // Prüfe ob bereits Badge existiert
      if (item.querySelector('.gallery-category-badge')) return;

      const badge = document.createElement('div');
      badge.className = 'gallery-category-badge';
      badge.textContent = category;
      item.appendChild(badge);
    });

    console.log(`Category badges added to ${items.length} items`);
  },

  // Ripple-Effekt bei Click
  initRippleEffect() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
      item.addEventListener('click', function(e) {
        // Erstelle Ripple-Element
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          pointer-events: none;
          animation: rippleExpand 0.6s ease-out;
          z-index: 100;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // CSS für Ripple-Animation hinzufügen
    if (!document.querySelector('#ripple-animation-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation-style';
      style.textContent = `
        @keyframes rippleExpand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    console.log(`Ripple effect initialized for ${items.length} items`);
  }
};

// ==========================================
// ERWEITERTE SCROLL-ANIMATIONEN
// ==========================================
const ScrollAnimations = {
  init() {
    this.initScrollReveal();
    this.initParallaxElements();
    console.log('📜 ScrollAnimations initialized');
  },

  initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom'
    );

    elements.forEach(el => observer.observe(el));

    console.log(`Scroll reveal initialized for ${elements.length} elements`);
  },

  initParallaxElements() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    console.log(`Parallax initialized for ${parallaxElements.length} elements`);
  }
};

// ==========================================
// ERWEITERTE NAVIGATION MIT SMOOTH SCROLL
// ==========================================
const NavigationEnhancements = {
  init() {
    this.initMagneticButtons();
    this.initSmoothScroll();
    console.log('🧭 NavigationEnhancements initialized');
  },

  // Magnetischer Button-Effekt
  initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .nav-link');

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });

    console.log(`Magnetic effect added to ${buttons.length} buttons`);
  },

  // Smooth Scroll mit Easing
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
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

    console.log('Smooth scroll initialized');
  }
};

// ==========================================
// PERFORMANCE MONITOR
// ==========================================
const PerformanceMonitor = {
  init() {
    this.monitorFPS();
    console.log('⚡ PerformanceMonitor initialized');
  },

  monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    const calculateFPS = () => {
      const currentTime = performance.now();
      frames++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;

        // Warne bei niedriger FPS
        if (fps < 30) {
          console.warn(`⚠️  Low FPS detected: ${fps}`);
        }
      }

      requestAnimationFrame(calculateFPS);
    };

    // Nur im Development Mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      calculateFPS();
    }
  }
};

// ==========================================
// LAZY LOADING OPTIMIERUNG
// ==========================================
const LazyLoadOptimized = {
  init() {
    this.setupLazyLoad();
    console.log('🔄 LazyLoadOptimized initialized');
  },

  setupLazyLoad() {
    if (!('IntersectionObserver' in window)) {
      // Fallback für alte Browser
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    console.log('Lazy loading setup complete');
  },

  loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src || img.classList.contains('loaded')) return;

    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';

    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }

    img.onload = () => {
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.classList.add('loaded');
      });
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      img.classList.add('error');
    };
  }
};

// ==========================================
// CARD 3D TILT EFFEKT
// ==========================================
const Card3DTilt = {
  init() {
    const cards = document.querySelectorAll('.card-3d-tilt, .card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });

    console.log(`3D tilt effect added to ${cards.length} cards`);
  }
};

// ==========================================
// THEME TOGGLE ENHANCEMENT
// ==========================================
const ThemeToggleEnhancement = {
  init() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      document.body.classList.add('theme-transitioning');

      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 500);
    });

    // CSS für smooth theme transition
    if (!document.querySelector('#theme-transition-style')) {
      const style = document.createElement('style');
      style.id = 'theme-transition-style';
      style.textContent = `
        body.theme-transitioning * {
          transition: background-color 0.3s ease,
                      color 0.3s ease,
                      border-color 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);
    }

    console.log('Theme toggle enhancement initialized');
  }
};

// ==========================================
// HAUPTINITIALISIERUNG
// ==========================================
const EnhancementsInit = {
  init() {
    console.log('🚀 Initializing Enhanced Features...');

    // Warte bis DOM bereit ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeAll());
    } else {
      this.initializeAll();
    }
  },

  initializeAll() {
    try {
      TextEffects.init();
      GalleryAnimations.init();
      ScrollAnimations.init();
      NavigationEnhancements.init();
      LazyLoadOptimized.init();
      Card3DTilt.init();
      ThemeToggleEnhancement.init();
      PerformanceMonitor.init();

      console.log('✅ All enhancements successfully initialized!');

      // Trigger custom event für andere Scripts
      document.dispatchEvent(new CustomEvent('enhancementsReady'));

    } catch (error) {
      console.error('❌ Error initializing enhancements:', error);
    }
  }
};

// Auto-Initialize
EnhancementsInit.init();

// Exportiere für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TextEffects,
    GalleryAnimations,
    ScrollAnimations,
    NavigationEnhancements,
    LazyLoadOptimized,
    Card3DTilt,
    ThemeToggleEnhancement,
    PerformanceMonitor
  };
}
