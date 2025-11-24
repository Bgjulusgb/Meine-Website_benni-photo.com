/**
 * ==========================================
 * MENU MANAGER - VEREINFACHT & OPTIMIERT
 * ==========================================
 *
 * Schlankes Backend für Menü-Management
 * Features:
 * - Mobile & Desktop Menü-Verwaltung
 * - Aktive Seiten-Erkennung
 * - Sticky Header Management
 * - Keyboard Navigation (ESC)
 * - Touch-optimiert
 * - ARIA Accessibility
 */

const MenuManager = {
  // Vereinfachte Konfiguration
  config: {
    stickyHeader: true,
    scrollThreshold: 100,
    mobileBreakpoint: 768
  },

  // Schlankes State Management
  state: {
    isOpen: false,
    isMobile: false,
    isSticky: false,
    currentPage: null,
    scrollPosition: 0,
    lastScrollDirection: 'down'
  },

  // DOM Elements
  elements: {},

  // Initialisierung - VEREINFACHT
  init() {
    console.log('[MenuManager] Initialisierung gestartet...');

    this.cacheElements();
    this.detectCurrentPage();
    this.bindEvents();
    this.initializeStickyHeader();
    this.setupKeyboardNavigation();
    this.updateActiveStates();
    this.checkIfMobile();

    console.log('[MenuManager] Initialisierung abgeschlossen.');
  },

  // Cache DOM Elements
  cacheElements() {
    this.elements = {
      header: document.querySelector('.header'),
      nav: document.querySelector('.nav'),
      menuToggle: document.querySelector('.menu-toggle'),
      navMenu: document.querySelector('.nav-menu'),
      navLinks: document.querySelectorAll('.nav-link'),
      logo: document.querySelector('.logo'),
      themeToggle: document.querySelector('#themeToggle'),
      breadcrumbs: document.querySelector('.breadcrumbs'),
      body: document.body,
    };
  },

  // Erkenne aktuelle Seite
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    this.state.currentPage = filename.replace('.html', '') || 'index';

    console.log(`[MenuManager] Aktuelle Seite: ${this.state.currentPage}`);
  },

  // Mobile Check
  checkIfMobile() {
    this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;
  },

  // Event Bindings - VEREINFACHT
  bindEvents() {
    // Menu Toggle
    this.elements.menuToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Menu Links - Schließe Menü bei Klick auf Mobile
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.state.isMobile && this.state.isOpen) {
          this.closeMenu();
        }
      });
    });

    // Schließe Menü bei Klick außerhalb
    document.addEventListener('click', (e) => {
      if (this.state.isOpen &&
          !this.elements.navMenu?.contains(e.target) &&
          !this.elements.menuToggle?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Scroll Events für Sticky Header
    if (this.config.stickyHeader) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    // Resize Events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  },

  // Toggle Menu
  toggleMenu() {
    this.state.isOpen = !this.state.isOpen;

    if (this.state.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.trackMenuToggle();
  },

  // Öffne Menü
  openMenu() {
    this.elements.menuToggle?.classList.add('active');
    this.elements.navMenu?.classList.add('active');
    this.elements.body.classList.add('menu-open');

    // Prevent Body Scroll
    this.elements.body.style.overflow = 'hidden';

    // ARIA
    this.elements.navMenu?.setAttribute('aria-hidden', 'false');
    this.elements.menuToggle?.setAttribute('aria-expanded', 'true');

    // Focus erstes Menu Item
    const firstLink = this.elements.navMenu?.querySelector('.nav-link');
    firstLink?.focus();

    console.log('[MenuManager] Menü geöffnet');
  },

  // Schließe Menü - VEREINFACHT
  closeMenu() {
    this.state.isOpen = false;

    this.elements.menuToggle?.classList.remove('active');
    this.elements.navMenu?.classList.remove('active');
    this.elements.body.classList.remove('menu-open');

    // Restore Body Scroll
    this.elements.body.style.overflow = '';

    // ARIA
    this.elements.navMenu?.setAttribute('aria-hidden', 'true');
    this.elements.menuToggle?.setAttribute('aria-expanded', 'false');

    console.log('[MenuManager] Menü geschlossen');
  },

  // Update Active States
  updateActiveStates() {
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const filename = href?.split('/').pop();

      if (filename === `${this.state.currentPage}.html` ||
          (this.state.currentPage === 'index' && filename === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  },

  // Sticky Header Management
  initializeStickyHeader() {
    if (!this.config.stickyHeader) return;

    // Initiale Check
    this.handleScroll();
  },

  // Handle Scroll
  handleScroll() {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > this.state.scrollPosition ? 'down' : 'up';

    this.state.scrollPosition = scrollY;
    this.state.lastScrollDirection = scrollDirection;

    // Sticky Header
    if (scrollY > this.config.scrollThreshold) {
      if (!this.state.isSticky) {
        this.elements.header?.classList.add('header-sticky');
        this.state.isSticky = true;
      }

      // Hide on scroll down, show on scroll up
      if (scrollDirection === 'down' && scrollY > 300) {
        this.elements.header?.classList.add('header-hidden');
      } else if (scrollDirection === 'up') {
        this.elements.header?.classList.remove('header-hidden');
      }

    } else {
      this.elements.header?.classList.remove('header-sticky', 'header-hidden');
      this.state.isSticky = false;
    }
  },

  // Handle Resize
  handleResize() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;

    // Schließe Menü bei Wechsel von Mobile zu Desktop
    if (wasMobile && !this.state.isMobile && this.state.isOpen) {
      this.closeMenu();
    }

    console.log(`[MenuManager] Resize: ${this.state.isMobile ? 'Mobile' : 'Desktop'} Modus`);
  },

  // Keyboard Navigation - VEREINFACHT
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC zum Schließen
      if (e.key === 'Escape' && this.state.isOpen) {
        this.closeMenu();
        this.elements.menuToggle?.focus();
      }
    });
  }
};

// DEAKTIVIERT - Wird jetzt von main.js gehandhabt
// Auto-Init auskommentiert um Konflikte zu vermeiden
/*
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MenuManager.init());
} else {
  MenuManager.init();
}
*/

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuManager;
}
