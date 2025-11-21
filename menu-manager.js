/**
 * ==========================================
 * MENU MANAGER - DYNAMISCHES MENÜ-SYSTEM BACKEND
 * ==========================================
 *
 * Umfassendes Backend für dynamisches Menü-Management
 * Features:
 * - Dynamische Menü-Generierung aus Konfiguration
 * - Multi-Level Menü-Unterstützung (Submenüs)
 * - Aktive Seiten-Erkennung
 * - Mobile & Desktop Menü-Verwaltung
 * - Breadcrumb-Generierung
 * - Menü-Analytics & Tracking
 * - Sticky Header Management
 * - Scroll-basierte Header-Anpassungen
 * - Keyboard Navigation (Tab, Arrow Keys)
 * - Touch Gestures für Mobile
 * - ARIA Accessibility
 * - Menu Item Highlighting
 * - Custom Menu Actions & Callbacks
 * - Menu State Persistence
 */

const MenuManager = {
  // Menü-Konfiguration
  config: {
    menuItems: [
      {
        id: 'home',
        label: 'Home',
        url: 'index.html',
        icon: '🏠',
        order: 1
      },
      {
        id: 'about',
        label: 'Über mich',
        url: 'about.html',
        icon: '👤',
        order: 2
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        url: 'portfolio.html',
        icon: '📸',
        order: 3,
        submenu: [
          { label: 'Sport', url: 'sports.html', category: 'sport' },
          { label: 'Musik', url: 'music.html', category: 'musik' },
          { label: 'Events', url: 'portfolio.html#events', category: 'event' }
        ]
      },
      {
        id: 'services',
        label: 'Services',
        url: 'services.html',
        icon: '⚙️',
        order: 4
      },
      {
        id: 'contact',
        label: 'Kontakt',
        url: 'contact.html',
        icon: '📧',
        order: 5,
        highlight: true
      }
    ],

    stickyHeader: true,
    scrollThreshold: 100,
    mobileBreakpoint: 768,
    enableSubmenus: true,
    enableBreadcrumbs: true,
    enableAnalytics: true,
    persistState: true,
    animationDuration: 300
  },

  // State Management
  state: {
    isOpen: false,
    isMobile: false,
    isSticky: false,
    currentPage: null,
    activeSubmenu: null,
    scrollPosition: 0,
    lastScrollDirection: 'down',
    menuHistory: [],
    clickCounts: new Map(),
    lastInteraction: null,
  },

  // DOM Elements
  elements: {},

  // Initialisierung
  init() {
    console.log('[MenuManager] Initialisierung gestartet...');

    this.cacheElements();
    this.detectCurrentPage();
    this.setupMenuStructure();
    this.bindEvents();
    this.initializeStickyHeader();
    this.setupKeyboardNavigation();
    this.setupTouchGestures();
    this.loadState();
    this.updateActiveStates();
    this.generateBreadcrumbs();
    this.trackMenuLoad();

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

  // Setup Menü-Struktur
  setupMenuStructure() {
    if (!this.elements.navMenu) return;

    // Sortiere Menü-Items nach Order
    const sortedItems = [...this.config.menuItems].sort((a, b) => a.order - b.order);

    // Optional: Dynamisch Menü-Items generieren
    // (Wenn gewünscht, können wir das vorhandene Menü ersetzen)
    this.enhanceMenuItems(sortedItems);
  },

  // Erweitere vorhandene Menü-Items
  enhanceMenuItems(menuConfig) {
    this.elements.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const menuItem = menuConfig.find(item => item.url === href);

      if (menuItem) {
        // Füge Icon hinzu wenn konfiguriert
        if (menuItem.icon && !link.querySelector('.menu-icon')) {
          const icon = document.createElement('span');
          icon.className = 'menu-icon';
          icon.textContent = menuItem.icon;
          link.prepend(icon);
        }

        // Füge Highlight-Klasse hinzu
        if (menuItem.highlight) {
          link.classList.add('menu-highlight');
        }

        // Speichere Menü-Item-Daten
        link.dataset.menuId = menuItem.id;

        // Setup Submenu wenn vorhanden
        if (menuItem.submenu && this.config.enableSubmenus) {
          this.createSubmenu(link, menuItem.submenu);
        }
      }
    });
  },

  // Erstelle Submenu
  createSubmenu(parentLink, submenuItems) {
    const li = parentLink.closest('li');
    if (!li) return;

    // Füge Submenu-Indikator hinzu
    const indicator = document.createElement('span');
    indicator.className = 'submenu-indicator';
    indicator.innerHTML = '▼';
    parentLink.appendChild(indicator);

    // Erstelle Submenu
    const submenu = document.createElement('ul');
    submenu.className = 'submenu';

    submenuItems.forEach(item => {
      const submenuLi = document.createElement('li');
      const submenuLink = document.createElement('a');
      submenuLink.href = item.url;
      submenuLink.textContent = item.label;
      submenuLink.className = 'submenu-link';
      submenuLink.dataset.category = item.category;

      submenuLi.appendChild(submenuLink);
      submenu.appendChild(submenuLi);
    });

    li.appendChild(submenu);
    li.classList.add('has-submenu');

    // Submenu Toggle
    parentLink.addEventListener('click', (e) => {
      if (this.state.isMobile) {
        e.preventDefault();
        this.toggleSubmenu(li);
      }
    });

    // Hover für Desktop
    if (!this.state.isMobile) {
      li.addEventListener('mouseenter', () => {
        this.showSubmenu(li);
      });

      li.addEventListener('mouseleave', () => {
        this.hideSubmenu(li);
      });
    }
  },

  // Toggle Submenu
  toggleSubmenu(submenuParent) {
    const isActive = submenuParent.classList.contains('submenu-active');

    // Schließe alle anderen Submenus
    document.querySelectorAll('.has-submenu').forEach(item => {
      item.classList.remove('submenu-active');
    });

    if (!isActive) {
      submenuParent.classList.add('submenu-active');
      this.state.activeSubmenu = submenuParent;
    } else {
      this.state.activeSubmenu = null;
    }
  },

  // Zeige Submenu
  showSubmenu(submenuParent) {
    submenuParent.classList.add('submenu-active');
  },

  // Verstecke Submenu
  hideSubmenu(submenuParent) {
    submenuParent.classList.remove('submenu-active');
  },

  // Event Bindings
  bindEvents() {
    // Menu Toggle
    this.elements.menuToggle?.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Menu Links Click Tracking
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.trackMenuClick(link);
        this.addToHistory(link.href);
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
      window.addEventListener('scroll', this.throttle(() => {
        this.handleScroll();
      }, 100));
    }

    // Resize Events
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Before Unload - State speichern
    if (this.config.persistState) {
      window.addEventListener('beforeunload', () => {
        this.saveState();
      });
    }
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

  // Schließe Menü
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

    // Schließe alle Submenus
    document.querySelectorAll('.has-submenu').forEach(item => {
      item.classList.remove('submenu-active');
    });

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

  // Keyboard Navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC zum Schließen
      if (e.key === 'Escape' && this.state.isOpen) {
        this.closeMenu();
        this.elements.menuToggle?.focus();
      }

      // Tab Trap wenn Menü offen
      if (e.key === 'Tab' && this.state.isOpen) {
        this.handleTabTrap(e);
      }

      // Arrow Keys für Navigation
      if (this.state.isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        this.navigateWithArrows(e.key);
      }

      // Enter/Space für Menü-Toggle
      if ((e.key === 'Enter' || e.key === ' ') &&
          document.activeElement === this.elements.menuToggle) {
        e.preventDefault();
        this.toggleMenu();
      }
    });
  },

  // Tab Trap für Accessibility
  handleTabTrap(e) {
    const focusableElements = this.elements.navMenu?.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  },

  // Arrow Key Navigation
  navigateWithArrows(key) {
    const links = Array.from(this.elements.navLinks);
    const currentIndex = links.indexOf(document.activeElement);

    if (currentIndex === -1) {
      links[0]?.focus();
      return;
    }

    if (key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % links.length;
      links[nextIndex]?.focus();
    } else if (key === 'ArrowUp') {
      const prevIndex = (currentIndex - 1 + links.length) % links.length;
      links[prevIndex]?.focus();
    }
  },

  // Touch Gestures Setup
  setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.elements.navMenu?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.elements.navMenu?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  },

  // Handle Swipe Gesture
  handleSwipe(startX, endX) {
    const swipeDistance = startX - endX;
    const minSwipeDistance = 100;

    // Swipe left to close (nur wenn Menü offen)
    if (swipeDistance > minSwipeDistance && this.state.isOpen) {
      this.closeMenu();
    }
  },

  // Breadcrumb-Generierung
  generateBreadcrumbs() {
    if (!this.config.enableBreadcrumbs || !this.elements.breadcrumbs) return;

    const breadcrumbData = this.getBreadcrumbPath();

    if (breadcrumbData.length <= 1) {
      this.elements.breadcrumbs.style.display = 'none';
      return;
    }

    this.elements.breadcrumbs.innerHTML = breadcrumbData.map((crumb, index) => {
      if (index === breadcrumbData.length - 1) {
        return `<span class="breadcrumb-current">${crumb.label}</span>`;
      } else {
        return `<a href="${crumb.url}" class="breadcrumb-link">${crumb.label}</a>`;
      }
    }).join(' <span class="breadcrumb-separator">›</span> ');

    this.elements.breadcrumbs.style.display = 'block';
  },

  // Ermittle Breadcrumb-Pfad
  getBreadcrumbPath() {
    const path = [{ label: 'Home', url: 'index.html' }];

    const currentMenuItem = this.config.menuItems.find(item =>
      item.url === `${this.state.currentPage}.html`
    );

    if (currentMenuItem && currentMenuItem.id !== 'home') {
      path.push({
        label: currentMenuItem.label,
        url: currentMenuItem.url
      });
    }

    return path;
  },

  // History Management
  addToHistory(url) {
    this.state.menuHistory.push({
      url,
      timestamp: Date.now()
    });

    // Limitiere History auf 50 Einträge
    if (this.state.menuHistory.length > 50) {
      this.state.menuHistory.shift();
    }
  },

  // State Persistence
  saveState() {
    if (!this.config.persistState) return;

    try {
      const state = {
        clickCounts: Object.fromEntries(this.state.clickCounts),
        menuHistory: this.state.menuHistory.slice(-20), // Nur letzte 20
        lastInteraction: this.state.lastInteraction
      };

      localStorage.setItem('menu_state', JSON.stringify(state));
      console.log('[MenuManager] State gespeichert');
    } catch (error) {
      console.error('[MenuManager] Fehler beim Speichern des States:', error);
    }
  },

  loadState() {
    if (!this.config.persistState) return;

    try {
      const stored = localStorage.getItem('menu_state');
      if (stored) {
        const state = JSON.parse(stored);
        this.state.clickCounts = new Map(Object.entries(state.clickCounts || {}));
        this.state.menuHistory = state.menuHistory || [];
        this.state.lastInteraction = state.lastInteraction;

        console.log('[MenuManager] State geladen');
      }
    } catch (error) {
      console.error('[MenuManager] Fehler beim Laden des States:', error);
    }
  },

  // Analytics & Tracking
  trackMenuClick(link) {
    const menuId = link.dataset.menuId || link.textContent;

    // Erhöhe Click Count
    const currentCount = this.state.clickCounts.get(menuId) || 0;
    this.state.clickCounts.set(menuId, currentCount + 1);

    // Track Event
    this.trackEvent('menu_click', {
      menuId,
      label: link.textContent,
      url: link.href,
      clickCount: currentCount + 1
    });

    this.state.lastInteraction = Date.now();
  },

  trackMenuToggle() {
    this.trackEvent('menu_toggle', {
      action: this.state.isOpen ? 'open' : 'close',
      isMobile: this.state.isMobile
    });
  },

  trackMenuLoad() {
    this.trackEvent('menu_loaded', {
      currentPage: this.state.currentPage,
      menuItemCount: this.config.menuItems.length
    });
  },

  trackEvent(eventName, data = {}) {
    if (!this.config.enableAnalytics) return;

    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      page: this.state.currentPage,
      ...data
    };

    console.log('[MenuManager] Analytics Event:', event);

    // Google Analytics Integration
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  },

  // Utility Functions
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
  document.addEventListener('DOMContentLoaded', () => MenuManager.init());
} else {
  MenuManager.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuManager;
}
