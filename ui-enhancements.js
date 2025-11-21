/**
 * ==========================================
 * UI ENHANCEMENTS - MICRO-INTERACTIONS & UTILITIES
 * ==========================================
 *
 * Zusätzliche UI-Verbesserungen und Micro-Interactions
 * Features:
 * - Back to Top Button
 * - Smooth Scroll Anchors
 * - Lazy Loading Images
 * - Scroll Progress Indicator
 * - Page Transition Effects
 * - Element Reveal on Scroll
 * - Copy to Clipboard
 * - Share Functionality
 * - Reading Progress Bar
 * - Auto-hiding Header on Scroll
 */

const UIEnhancements = {
  config: {
    backToTopThreshold: 300,
    scrollRevealDistance: 50,
    headerHideOffset: 100,
    enableScrollProgress: true,
    enableLazyLoad: true,
    enableScrollReveal: true,
  },

  state: {
    lastScrollTop: 0,
    scrollDirection: 'down',
    isHeaderHidden: false,
  },

  init() {
    console.log('[UIEnhancements] Initialisierung...');

    this.initBackToTop();
    this.initSmoothScroll();
    this.initScrollReveal();
    this.initScrollProgress();
    this.initAutoHideHeader();
    this.initCopyToClipboard();
    this.initLazyImages();
    this.initExternalLinks();

    console.log('[UIEnhancements] Bereit.');
  },

  // Back to Top Button
  initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Zurück nach oben');
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--text-primary);
      color: var(--bg-primary);
      border: none;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--shadow-lg);
    `;

    document.body.appendChild(button);

    // Show/Hide based on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.config.backToTopThreshold) {
        button.classList.add('visible');
        button.style.opacity = '1';
        button.style.visibility = 'visible';
      } else {
        button.classList.remove('visible');
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
      }
    });

    // Scroll to top on click
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },

  // Smooth Scroll for Anchor Links
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          const offsetTop = target.offsetTop - 100; // Header offset

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  },

  // Scroll Reveal Animation
  initScrollReveal() {
    if (!this.config.enableScrollReveal) return;

    const revealElements = document.querySelectorAll('.fade-in, .slide-in-up, .zoom-in');

    if (revealElements.length === 0) {
      // Auto-add reveal classes to sections
      document.querySelectorAll('section').forEach((section, index) => {
        if (index > 0) { // Skip first section (usually hero)
          section.classList.add('fade-in');
          section.style.opacity = '0';
        }
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: `${this.config.scrollRevealDistance}px`
    });

    document.querySelectorAll('.fade-in, .slide-in-up, .zoom-in').forEach(el => {
      observer.observe(el);
    });
  },

  // Scroll Progress Indicator
  initScrollProgress() {
    if (!this.config.enableScrollProgress) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--text-primary), var(--text-primary));
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    });
  },

  // Auto-hiding Header on Scroll
  initAutoHideHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const scrollDiff = scrollTop - this.state.lastScrollTop;

      if (scrollTop > this.config.headerHideOffset) {
        if (scrollDiff > 5 && !this.state.isHeaderHidden) {
          // Scrolling down
          header.style.transform = 'translateY(-100%)';
          this.state.isHeaderHidden = true;
          this.state.scrollDirection = 'down';
        } else if (scrollDiff < -5 && this.state.isHeaderHidden) {
          // Scrolling up
          header.style.transform = 'translateY(0)';
          this.state.isHeaderHidden = false;
          this.state.scrollDirection = 'up';
        }
      } else {
        header.style.transform = 'translateY(0)';
        this.state.isHeaderHidden = false;
      }

      this.state.lastScrollTop = scrollTop;
    });
  },

  // Copy to Clipboard Functionality
  initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', async () => {
        const text = button.dataset.copy || button.textContent;

        try {
          await navigator.clipboard.writeText(text);
          this.showToast('In Zwischenablage kopiert!', 'success');
        } catch (error) {
          console.error('Copy failed:', error);
          this.showToast('Kopieren fehlgeschlagen', 'error');
        }
      });
    });
  },

  // Enhanced Lazy Loading for Images
  initLazyImages() {
    if (!this.config.enableLazyLoad || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Add loading class
          img.classList.add('loading');

          const src = img.dataset.src || img.src;
          const srcset = img.dataset.srcset;

          const tempImg = new Image();

          tempImg.onload = () => {
            if (srcset) {
              img.srcset = srcset;
            }
            img.src = src;
            img.classList.remove('loading');
            img.classList.add('loaded');
          };

          tempImg.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
          };

          tempImg.src = src;

          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  // External Links - Open in new tab
  initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      const url = new URL(link.href);

      if (url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        // Add external link icon
        if (!link.querySelector('.external-icon')) {
          const icon = document.createElement('span');
          icon.className = 'external-icon';
          icon.innerHTML = ' ↗';
          icon.style.fontSize = '0.8em';
          link.appendChild(icon);
        }
      }
    });
  },

  // Toast Notification
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle utility
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Auto-Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => UIEnhancements.init());
} else {
  UIEnhancements.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIEnhancements;
}

window.UIEnhancements = UIEnhancements;
