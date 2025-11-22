/**
 * ==========================================
 * GALLERY MANAGER - VEREINFACHT & OPTIMIERT
 * ==========================================
 *
 * Schlankes Backend für Galerie-Verwaltung
 * Features:
 * - Kategorie-Filterung (Sport, Musik, Event)
 * - Such-Funktionalität
 * - Sortier-Optionen
 * - Lazy Loading
 * - Responsive Grid-Layout
 * - Keyboard Navigation
 */

const GalleryManager = {
  // Vereinfachte Konfiguration
  config: {
    categories: ['alle', 'sport', 'musik', 'event'],
    sortOptions: ['neueste', 'popularität', 'alphabetisch']
  },

  // Schlankes State Management
  state: {
    currentCategory: 'alle',
    currentSort: 'neueste',
    searchQuery: '',
    imageMetadata: new Map()
  },

  // Initialisierung - VEREINFACHT
  init() {
    console.log('[GalleryManager] Initialisierung gestartet...');

    this.elements = {
      gallery: document.querySelector('.gallery-grid') || document.querySelector('.grid'),
      filterButtons: document.querySelectorAll('[data-filter]'),
      sortSelect: document.querySelector('[data-sort]'),
      searchInput: document.querySelector('[data-search]')
    };

    if (!this.elements.gallery) {
      console.warn('[GalleryManager] Keine Gallerie auf dieser Seite gefunden.');
      return;
    }

    this.bindEvents();
    this.initializeGallery();
    this.setupKeyboardNavigation();

    console.log('[GalleryManager] Initialisierung abgeschlossen.');
  },

  // Event Bindings - VEREINFACHT
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

    // Search Input mit Debounce
    if (this.elements.searchInput) {
      let searchTimeout;
      this.elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.search(e.target.value);
        }, 300);
      });
    }
  },

  // Gallerie initialisieren - VEREINFACHT
  initializeGallery() {
    try {
      // Sammle alle existierenden Bilder
      const images = this.collectExistingImages();

      // Initialisiere Metadaten
      images.forEach(img => {
        this.initializeImageMetadata(img);
      });

      // Wende initiale Filter an
      this.applyFilters();

    } catch (error) {
      console.error('[GalleryManager] Initialisierungsfehler:', error);
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

  // Initialisiere Bild-Metadaten - VEREINFACHT
  initializeImageMetadata(imageData) {
    // Einfache View Count (in Memory)
    imageData.views = 0;
  },

  // Filter nach Kategorie - VEREINFACHT
  filterByCategory(category) {
    console.log(`[GalleryManager] Filtere nach Kategorie: ${category}`);

    this.state.currentCategory = category;

    // Update aktive Filter-Buttons
    this.elements.filterButtons?.forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.applyFilters();
  },

  // Such-Funktionalität - VEREINFACHT
  search(query) {
    console.log(`[GalleryManager] Suche: "${query}"`);

    this.state.searchQuery = query.toLowerCase().trim();
    this.applyFilters();
  },

  // Sortierung - VEREINFACHT
  sortBy(sortOption) {
    console.log(`[GalleryManager] Sortiere nach: ${sortOption}`);

    this.state.currentSort = sortOption;
    this.applyFilters();
  },

  // Wende alle Filter an - VEREINFACHT
  applyFilters() {
    const items = Array.from(this.elements.gallery.querySelectorAll('.gallery-item'));
    let visibleCount = 0;

    items.forEach((item, index) => {
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

      // Zeige/Verstecke Item - EINFACH
      if (isVisible) {
        item.style.display = '';
        item.classList.add('gallery-item-visible');
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('gallery-item-visible');
      }
    });

    // Sortiere sichtbare Items
    this.sortVisibleItems();

    console.log(`[GalleryManager] ${visibleCount} Bilder sichtbar`);
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


  // Keyboard Navigation - VEREINFACHT
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // S oder / für Such-Fokus
      if ((e.key === 's' || e.key === '/') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.elements.searchInput?.focus();
      }
    });
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
