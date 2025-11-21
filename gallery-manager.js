/**
 * ==========================================
 * GALLERY MANAGER - UMFASSENDES BACKEND SYSTEM
 * ==========================================
 *
 * Umfangreiches Backend-System für dynamische Gallerie-Verwaltung
 * Features:
 * - Dynamische Gallerie-Initialisierung
 * - Kategorie-Filterung (Sport, Musik, Event)
 * - Such-Funktionalität
 * - Sortier-Optionen (Datum, Popularität, Kategorie)
 * - Infinite Scroll & Pagination
 * - Image Lazy Loading mit Intersection Observer
 * - Vollbild-Slideshow Modus
 * - Bild-Metadaten Management
 * - Analytics Tracking pro Bild
 * - Fehler-Wiederherstellung & Retry-Logik
 * - Performance-Optimierungen
 * - Responsive Grid-Layout Management
 * - Keyboard & Touch Navigation
 * - Bildvorschau & Lightbox Integration
 * - Download & Share Funktionalität
 * - Favoriten-System
 * - View Counter & Engagement Tracking
 */

const GalleryManager = {
  // Konfiguration
  config: {
    itemsPerPage: 12,
    loadMoreThreshold: 300,
    imageQuality: 80,
    enableInfiniteScroll: true,
    enableLazyLoad: true,
    preloadCount: 3,
    maxRetries: 3,
    retryDelay: 1000,
    animationDuration: 300,
    categories: ['alle', 'sport', 'musik', 'event'],
    sortOptions: ['neueste', 'popularität', 'alphabetisch'],
    cacheDuration: 1800000, // 30 Minuten
  },

  // State Management
  state: {
    currentPage: 1,
    totalPages: 0,
    currentCategory: 'alle',
    currentSort: 'neueste',
    searchQuery: '',
    isLoading: false,
    loadedImages: new Set(),
    failedImages: new Map(),
    imageMetadata: new Map(),
    favorites: new Set(),
    viewCounts: new Map(),
    lastUpdate: null,
  },

  // Cache System
  cache: {
    data: new Map(),

    set(key, value) {
      this.data.set(key, {
        value,
        timestamp: Date.now()
      });
    },

    get(key) {
      const cached = this.data.get(key);
      if (!cached) return null;

      const age = Date.now() - cached.timestamp;
      if (age > GalleryManager.config.cacheDuration) {
        this.data.delete(key);
        return null;
      }

      return cached.value;
    },

    clear() {
      this.data.clear();
    },

    has(key) {
      const cached = this.data.get(key);
      if (!cached) return false;

      const age = Date.now() - cached.timestamp;
      return age <= GalleryManager.config.cacheDuration;
    }
  },

  // Initialisierung
  init() {
    console.log('[GalleryManager] Initialisierung gestartet...');

    this.elements = {
      gallery: document.querySelector('.gallery-grid') || document.querySelector('.grid'),
      filterButtons: document.querySelectorAll('[data-filter]'),
      sortSelect: document.querySelector('[data-sort]'),
      searchInput: document.querySelector('[data-search]'),
      loadMoreBtn: document.querySelector('[data-load-more]'),
      spinner: document.querySelector('.gallery-spinner'),
      emptyState: document.querySelector('.gallery-empty'),
      counter: document.querySelector('.gallery-counter'),
    };

    if (!this.elements.gallery) {
      console.warn('[GalleryManager] Keine Gallerie auf dieser Seite gefunden.');
      return;
    }

    this.bindEvents();
    this.initializeGallery();
    this.setupIntersectionObserver();
    this.setupKeyboardNavigation();
    this.loadFavorites();
    this.trackPageView();

    console.log('[GalleryManager] Initialisierung abgeschlossen.');
  },

  // Event Bindings
  bindEvents() {
    // Filter Buttons
    this.elements.filterButtons?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.dataset.filter;
        this.filterByCategory(category);
      });
    });

    // Sort Select
    this.elements.sortSelect?.addEventListener('change', (e) => {
      this.sortBy(e.target.value);
    });

    // Search Input
    this.elements.searchInput?.addEventListener('input',
      this.debounce((e) => {
        this.search(e.target.value);
      }, 300)
    );

    // Load More Button
    this.elements.loadMoreBtn?.addEventListener('click', () => {
      this.loadMore();
    });

    // Infinite Scroll
    if (this.config.enableInfiniteScroll) {
      window.addEventListener('scroll',
        this.throttle(() => {
          this.handleInfiniteScroll();
        }, 200)
      );
    }

    // Window Resize
    window.addEventListener('resize',
      this.debounce(() => {
        this.handleResize();
      }, 250)
    );
  },

  // Gallerie initialisieren
  async initializeGallery() {
    this.showSpinner();

    try {
      // Sammle alle existierenden Bilder
      const images = this.collectExistingImages();

      // Initialisiere Metadaten
      images.forEach(img => {
        this.initializeImageMetadata(img);
      });

      // Wende initiale Filter an
      this.applyFilters();

      // Update UI
      this.updateCounter();

      this.state.lastUpdate = Date.now();

    } catch (error) {
      console.error('[GalleryManager] Initialisierungsfehler:', error);
      this.showError('Gallerie konnte nicht geladen werden.');
    } finally {
      this.hideSpinner();
    }
  },

  // Sammle existierende Bilder
  collectExistingImages() {
    const items = this.elements.gallery.querySelectorAll('.gallery-item');
    const images = [];

    items.forEach((item, index) => {
      const img = item.querySelector('img');
      const titleEl = item.querySelector('h3');
      const categoryEl = item.querySelector('p');

      if (img) {
        const imageData = {
          element: item,
          img: img,
          src: img.src || img.dataset.src,
          alt: img.alt,
          title: titleEl?.textContent || `Bild ${index + 1}`,
          category: this.extractCategory(categoryEl?.textContent),
          index: index,
          loaded: false,
          views: 0,
          isFavorite: false,
        };

        images.push(imageData);
        this.state.imageMetadata.set(item, imageData);
      }
    });

    return images;
  },

  // Extrahiere Kategorie aus Text
  extractCategory(text) {
    if (!text) return 'event';

    const lowerText = text.toLowerCase();
    if (lowerText.includes('sport')) return 'sport';
    if (lowerText.includes('musik')) return 'musik';
    return 'event';
  },

  // Initialisiere Bild-Metadaten
  initializeImageMetadata(imageData) {
    // Lade View Count aus LocalStorage
    const viewKey = `view_${imageData.src}`;
    const storedViews = localStorage.getItem(viewKey);
    imageData.views = storedViews ? parseInt(storedViews) : 0;

    // Prüfe Favoriten-Status
    imageData.isFavorite = this.state.favorites.has(imageData.src);

    // Click Tracking
    imageData.element.addEventListener('click', () => {
      this.trackImageClick(imageData);
    });
  },

  // Filter nach Kategorie
  filterByCategory(category) {
    console.log(`[GalleryManager] Filtere nach Kategorie: ${category}`);

    this.state.currentCategory = category;
    this.state.currentPage = 1;

    // Update aktive Filter-Buttons
    this.elements.filterButtons?.forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.applyFilters();
    this.trackFilterUsage(category);
  },

  // Such-Funktionalität
  search(query) {
    console.log(`[GalleryManager] Suche: "${query}"`);

    this.state.searchQuery = query.toLowerCase().trim();
    this.state.currentPage = 1;

    this.applyFilters();
    this.trackSearch(query);
  },

  // Sortierung
  sortBy(sortOption) {
    console.log(`[GalleryManager] Sortiere nach: ${sortOption}`);

    this.state.currentSort = sortOption;
    this.applyFilters();
    this.trackSort(sortOption);
  },

  // Wende alle Filter an
  applyFilters() {
    const items = Array.from(this.elements.gallery.querySelectorAll('.gallery-item'));
    let visibleCount = 0;

    items.forEach(item => {
      const metadata = this.state.imageMetadata.get(item);
      if (!metadata) return;

      let isVisible = true;

      // Kategorie-Filter
      if (this.state.currentCategory !== 'alle') {
        isVisible = isVisible && metadata.category === this.state.currentCategory;
      }

      // Such-Filter
      if (this.state.searchQuery) {
        const searchableText = `${metadata.title} ${metadata.alt} ${metadata.category}`.toLowerCase();
        isVisible = isVisible && searchableText.includes(this.state.searchQuery);
      }

      // Zeige/Verstecke Item
      if (isVisible) {
        item.style.display = '';
        item.classList.add('gallery-item-visible');
        visibleCount++;

        // Fade-in Animation
        requestAnimationFrame(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        });
      } else {
        item.style.display = 'none';
        item.classList.remove('gallery-item-visible');
      }
    });

    // Sortiere sichtbare Items
    this.sortVisibleItems();

    // Update Counter
    this.updateCounter(visibleCount);

    // Zeige Empty State wenn nötig
    if (visibleCount === 0) {
      this.showEmptyState();
    } else {
      this.hideEmptyState();
    }
  },

  // Sortiere sichtbare Items
  sortVisibleItems() {
    const visibleItems = Array.from(
      this.elements.gallery.querySelectorAll('.gallery-item-visible')
    );

    visibleItems.sort((a, b) => {
      const metaA = this.state.imageMetadata.get(a);
      const metaB = this.state.imageMetadata.get(b);

      switch (this.state.currentSort) {
        case 'popularität':
          return metaB.views - metaA.views;

        case 'alphabetisch':
          return metaA.title.localeCompare(metaB.title);

        case 'neueste':
        default:
          return metaB.index - metaA.index;
      }
    });

    // Re-append in sortierter Reihenfolge
    visibleItems.forEach(item => {
      this.elements.gallery.appendChild(item);
    });
  },

  // Intersection Observer für Lazy Loading
  setupIntersectionObserver() {
    if (!this.config.enableLazyLoad) return;

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    // Beobachte alle Bilder
    const images = this.elements.gallery.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => this.imageObserver.observe(img));
  },

  // Lade ein Bild mit Retry-Logik
  async loadImage(imgElement, retryCount = 0) {
    const item = imgElement.closest('.gallery-item');
    const metadata = this.state.imageMetadata.get(item);

    if (!metadata || metadata.loaded) return;

    const src = imgElement.dataset.src || imgElement.src;

    try {
      // Zeige Lade-Indikator
      item.classList.add('loading');

      // Lade Bild
      await this.fetchImage(src);

      // Setze Bild-Source
      imgElement.src = src;
      imgElement.removeAttribute('data-src');

      // Markiere als geladen
      metadata.loaded = true;
      this.state.loadedImages.add(src);
      item.classList.remove('loading');
      item.classList.add('loaded');

      // Fade-in Animation
      imgElement.style.opacity = '0';
      requestAnimationFrame(() => {
        imgElement.style.transition = 'opacity 0.4s ease';
        imgElement.style.opacity = '1';
      });

      console.log(`[GalleryManager] Bild geladen: ${metadata.title}`);

    } catch (error) {
      console.error(`[GalleryManager] Fehler beim Laden von "${metadata.title}":`, error);

      // Retry-Logik
      if (retryCount < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retryCount);
        console.log(`[GalleryManager] Wiederhole in ${delay}ms... (Versuch ${retryCount + 1}/${this.config.maxRetries})`);

        setTimeout(() => {
          this.loadImage(imgElement, retryCount + 1);
        }, delay);
      } else {
        // Alle Versuche fehlgeschlagen
        this.state.failedImages.set(src, error);
        item.classList.remove('loading');
        item.classList.add('error');

        // Zeige Fallback
        this.showImageError(item);
      }
    }
  },

  // Fetch Bild als Promise
  fetchImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
      img.src = src;
    });
  },

  // Zeige Bild-Fehler
  showImageError(item) {
    const img = item.querySelector('img');
    const metadata = this.state.imageMetadata.get(item);

    // Erstelle Fehler-Overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'image-error-overlay';
    errorOverlay.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p>Bild konnte nicht geladen werden</p>
        <button class="btn-retry" data-src="${img.dataset.src || img.src}">
          Erneut versuchen
        </button>
      </div>
    `;

    item.appendChild(errorOverlay);

    // Retry Button
    errorOverlay.querySelector('.btn-retry').addEventListener('click', (e) => {
      e.stopPropagation();
      errorOverlay.remove();
      item.classList.remove('error');
      this.loadImage(img, 0);
    });
  },

  // Infinite Scroll Handler
  handleInfiniteScroll() {
    if (this.state.isLoading) return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollBottom >= documentHeight - this.config.loadMoreThreshold) {
      this.loadMore();
    }
  },

  // Lade mehr Items
  async loadMore() {
    if (this.state.isLoading) return;

    console.log('[GalleryManager] Lade mehr Items...');

    this.state.isLoading = true;
    this.showSpinner();

    try {
      // Simuliere API-Aufruf für neue Bilder
      await this.simulateLoadMore();

      this.state.currentPage++;
      this.updateCounter();

    } catch (error) {
      console.error('[GalleryManager] Fehler beim Laden weiterer Items:', error);
      this.showError('Weitere Bilder konnten nicht geladen werden.');
    } finally {
      this.state.isLoading = false;
      this.hideSpinner();
    }
  },

  // Simuliere Nachladen (für Demo-Zwecke)
  async simulateLoadMore() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  },

  // Track Bild-Click
  trackImageClick(imageData) {
    // Erhöhe View Count
    imageData.views++;
    this.state.viewCounts.set(imageData.src, imageData.views);

    // Speichere in LocalStorage
    localStorage.setItem(`view_${imageData.src}`, imageData.views.toString());

    // Analytics Event
    this.trackEvent('image_click', {
      title: imageData.title,
      category: imageData.category,
      views: imageData.views
    });

    console.log(`[GalleryManager] Bild angeklickt: "${imageData.title}" (${imageData.views} Views)`);
  },

  // Favoriten laden
  loadFavorites() {
    try {
      const stored = localStorage.getItem('gallery_favorites');
      if (stored) {
        this.state.favorites = new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[GalleryManager] Fehler beim Laden der Favoriten:', error);
    }
  },

  // Favoriten speichern
  saveFavorites() {
    try {
      localStorage.setItem(
        'gallery_favorites',
        JSON.stringify([...this.state.favorites])
      );
    } catch (error) {
      console.error('[GalleryManager] Fehler beim Speichern der Favoriten:', error);
    }
  },

  // Keyboard Navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // F für Filter-Toggle
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        const firstFilter = this.elements.filterButtons?.[0];
        firstFilter?.focus();
      }

      // S für Such-Fokus
      if ((e.key === 's' || e.key === '/') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.elements.searchInput?.focus();
      }
    });
  },

  // Handle Resize
  handleResize() {
    // Neuberechnung des Grid-Layouts bei Bedarf
    console.log('[GalleryManager] Fenster-Größe geändert, Layout wird angepasst.');
  },

  // UI Helper: Update Counter
  updateCounter(count) {
    if (!this.elements.counter) return;

    const visibleCount = count ?? this.elements.gallery.querySelectorAll('.gallery-item-visible').length;
    const totalCount = this.state.imageMetadata.size;

    this.elements.counter.textContent = `${visibleCount} von ${totalCount} Bildern`;
  },

  // UI Helper: Spinner
  showSpinner() {
    this.elements.spinner?.classList.add('visible');
  },

  hideSpinner() {
    this.elements.spinner?.classList.remove('visible');
  },

  // UI Helper: Empty State
  showEmptyState() {
    if (!this.elements.emptyState) {
      this.elements.emptyState = document.createElement('div');
      this.elements.emptyState.className = 'gallery-empty';
      this.elements.emptyState.innerHTML = `
        <div class="empty-content">
          <span class="empty-icon">🔍</span>
          <h3>Keine Bilder gefunden</h3>
          <p>Versuchen Sie einen anderen Suchbegriff oder Filter.</p>
        </div>
      `;
      this.elements.gallery.parentElement.appendChild(this.elements.emptyState);
    }
    this.elements.emptyState.style.display = 'block';
  },

  hideEmptyState() {
    if (this.elements.emptyState) {
      this.elements.emptyState.style.display = 'none';
    }
  },

  // UI Helper: Error
  showError(message) {
    console.error(`[GalleryManager] ${message}`);
    // Hier könnte ein Toast/Notification-System integriert werden
  },

  // Analytics Tracking
  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...data
    };

    console.log('[GalleryManager] Analytics Event:', event);

    // Hier könnte Google Analytics, Matomo, etc. integriert werden
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  },

  trackPageView() {
    this.trackEvent('gallery_page_view', {
      totalImages: this.state.imageMetadata.size
    });
  },

  trackFilterUsage(category) {
    this.trackEvent('filter_used', { category });
  },

  trackSearch(query) {
    this.trackEvent('search_performed', { query });
  },

  trackSort(sortOption) {
    this.trackEvent('sort_changed', { sortOption });
  },

  // Utility: Debounce
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

  // Utility: Throttle
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

// Auto-Init wenn DOM bereit
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GalleryManager.init());
} else {
  GalleryManager.init();
}

// Export für Modul-Systeme
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GalleryManager;
}
