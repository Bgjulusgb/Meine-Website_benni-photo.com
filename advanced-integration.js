/**
 * ==========================================
 * ADVANCED INTEGRATION MANAGER
 * ==========================================
 *
 * Zentrales Backend-Modul zur Integration und Erweiterung
 * aller existierenden Backend-Systeme
 *
 * Features:
 * - Service Worker & PWA Support
 * - Offline-Funktionalität
 * - Auto-Update System
 * - Real-Time Synchronisation
 * - Advanced Caching Strategies
 * - Image Optimization & WebP Support
 * - Form Validation & Submission
 * - Cookie Consent Management
 * - A/B Testing Framework
 * - Feature Flags System
 * - Dynamic Content Loading
 * - SEO Meta Tag Management
 * - Social Media Sharing Optimization
 */

const AdvancedIntegration = {
  // Konfiguration
  config: {
    enablePWA: true,
    enableOffline: true,
    enableAutoUpdate: true,
    enableCookieConsent: true,
    enableABTesting: false,
    version: '2.0.0',
    apiEndpoint: '/api',
    updateCheckInterval: 300000, // 5 Minuten
  },

  // State
  state: {
    isOnline: navigator.onLine,
    isPWAInstalled: false,
    serviceWorkerRegistered: false,
    lastUpdate: null,
    pendingUpdates: [],
    cookieConsent: null,
    activeExperiments: new Map(),
  },

  // Initialisierung
  init() {
    console.log('[AdvancedIntegration] Initialisierung...');

    this.detectEnvironment();
    this.setupConnectionMonitoring();
    this.initPWA();
    this.initCookieConsent();
    this.initFormEnhancements();
    this.initSocialSharing();
    this.initImageOptimization();
    this.setupAutoUpdate();
    this.initFeatureFlags();

    console.log('[AdvancedIntegration] Bereit.');
  },

  // Umgebungs-Erkennung
  detectEnvironment() {
    this.environment = {
      browser: this.detectBrowser(),
      os: this.detectOS(),
      device: this.detectDevice(),
      connection: this.getConnectionInfo(),
      capabilities: this.detectCapabilities(),
    };

    console.log('[AdvancedIntegration] Umgebung:', this.environment);
  },

  detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  },

  detectOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  },

  detectDevice() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  getConnectionInfo() {
    if (!navigator.connection) return null;

    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    };
  },

  detectCapabilities() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      webp: this.testWebP(),
      avif: this.testAVIF(),
      intersectionObserver: 'IntersectionObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
    };
  },

  testLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  },

  testSessionStorage() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  },

  testWebP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },

  testAVIF() {
    const avif = new Image();
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    return avif.complete && avif.width > 0;
  },

  // Connection Monitoring
  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.handleOffline();
    });

    // Network Information API
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }
  },

  handleOnline() {
    console.log('[AdvancedIntegration] Online');
    this.showNotification('Verbindung wiederhergestellt', 'success');
    this.syncPendingChanges();
  },

  handleOffline() {
    console.log('[AdvancedIntegration] Offline');
    this.showNotification('Offline-Modus aktiv', 'warning');
  },

  handleConnectionChange() {
    const connection = this.getConnectionInfo();
    console.log('[AdvancedIntegration] Verbindung geändert:', connection);

    // Adaptive Loading basierend auf Verbindung
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      this.enableDataSaveMode();
    } else {
      this.disableDataSaveMode();
    }
  },

  enableDataSaveMode() {
    console.log('[AdvancedIntegration] Datensparmodus aktiviert');
    document.body.classList.add('data-save-mode');
    // Deaktiviere Animationen
    document.body.style.setProperty('--transition-base', '0s');
  },

  disableDataSaveMode() {
    document.body.classList.remove('data-save-mode');
    document.body.style.removeProperty('--transition-base');
  },

  // PWA Support
  initPWA() {
    if (!this.config.enablePWA || !this.environment.capabilities.serviceWorker) {
      console.log('[AdvancedIntegration] PWA nicht unterstützt oder deaktiviert');
      return;
    }

    this.registerServiceWorker();
    this.setupPWAInstallPrompt();
  },

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.state.serviceWorkerRegistered = true;

      console.log('[AdvancedIntegration] Service Worker registriert:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdatePrompt();
          }
        });
      });

    } catch (error) {
      console.error('[AdvancedIntegration] Service Worker Fehler:', error);
    }
  },

  setupPWAInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Zeige Install-Button
      this.showInstallButton(() => {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[AdvancedIntegration] PWA installiert');
            this.state.isPWAInstalled = true;
          }
          deferredPrompt = null;
        });
      });
    });

    window.addEventListener('appinstalled', () => {
      console.log('[AdvancedIntegration] PWA wurde installiert');
      this.state.isPWAInstalled = true;
    });
  },

  showInstallButton(callback) {
    const button = document.createElement('button');
    button.textContent = 'App installieren';
    button.className = 'btn btn-primary pwa-install-btn';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      animation: slideInUp 0.3s ease;
    `;

    button.addEventListener('click', callback);
    document.body.appendChild(button);
  },

  // Cookie Consent
  initCookieConsent() {
    if (!this.config.enableCookieConsent) return;

    const consent = localStorage.getItem('cookie_consent');
    if (consent) {
      this.state.cookieConsent = JSON.parse(consent);
      return;
    }

    this.showCookieConsent();
  },

  showCookieConsent() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <p>Wir verwenden Cookies um Ihre Erfahrung zu verbessern.</p>
        <div class="cookie-consent-buttons">
          <button class="btn btn-primary" data-accept="all">Alle akzeptieren</button>
          <button class="btn btn-secondary" data-accept="essential">Nur Notwendige</button>
        </div>
      </div>
    `;

    banner.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.accept;
        this.handleCookieConsent(type);
        banner.remove();
      });
    });

    document.body.appendChild(banner);
  },

  handleCookieConsent(type) {
    const consent = {
      essential: true,
      analytics: type === 'all',
      marketing: type === 'all',
      timestamp: Date.now(),
    };

    this.state.cookieConsent = consent;
    localStorage.setItem('cookie_consent', JSON.stringify(consent));

    // Load analytics wenn erlaubt
    if (consent.analytics) {
      this.loadAnalytics();
    }
  },

  loadAnalytics() {
    // Google Analytics, Matomo, etc. laden
    console.log('[AdvancedIntegration] Analytics wird geladen...');
  },

  // Form Enhancements
  initFormEnhancements() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      this.enhanceForm(form);
    });
  },

  enhanceForm(form) {
    // Real-time Validation
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      });
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!this.validateForm(form)) {
        return;
      }

      await this.submitForm(form);
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    if (field.required && !value) {
      isValid = false;
      message = 'Dieses Feld ist erforderlich';
    } else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      message = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    } else if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      message = 'Bitte geben Sie eine gültige Telefonnummer ein';
    }

    this.setFieldValidation(field, isValid, message);

    return isValid;
  },

  validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  setFieldValidation(field, isValid, message) {
    const wrapper = field.closest('.form-group') || field.parentElement;

    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      wrapper.querySelector('.error-message')?.remove();
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');

      let errorEl = wrapper.querySelector('.error-message');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }
  },

  async submitForm(form) {
    const data = new FormData(form);
    const button = form.querySelector('button[type="submit"]');

    // Disable submit button
    button.disabled = true;
    button.textContent = 'Wird gesendet...';

    try {
      const response = await fetch(form.action || this.config.apiEndpoint + '/contact', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        this.showNotification('Nachricht erfolgreich gesendet!', 'success');
        form.reset();
      } else {
        throw new Error('Server Fehler');
      }

    } catch (error) {
      console.error('[AdvancedIntegration] Form Fehler:', error);
      this.showNotification('Fehler beim Senden. Bitte versuchen Sie es später erneut.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = '📤 Nachricht senden';
    }
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{8,}$/.test(phone);
  },

  // Social Sharing
  initSocialSharing() {
    const shareButtons = document.querySelectorAll('[data-share]');

    shareButtons.forEach(button => {
      button.addEventListener('click', () => {
        const platform = button.dataset.share;
        this.share(platform);
      });
    });
  },

  async share(platform) {
    const data = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.content || '',
      url: window.location.href,
    };

    // Native Web Share API
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share(data);
        console.log('[AdvancedIntegration] Erfolgreich geteilt');
      } catch (error) {
        console.log('[AdvancedIntegration] Teilen abgebrochen');
      }
      return;
    }

    // Platform-spezifisches Sharing
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}`,
      email: `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.text + '\n\n' + data.url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  },

  // Image Optimization
  initImageOptimization() {
    if (!this.environment.capabilities.intersectionObserver) return;

    const images = document.querySelectorAll('img[data-src]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
    });

    images.forEach(img => observer.observe(img));
  },

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    // WebP Support
    if (this.environment.capabilities.webp && img.dataset.webp) {
      img.src = img.dataset.webp;
    } else if (src) {
      img.src = src;
    }

    if (srcset) {
      img.srcset = srcset;
    }

    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  },

  // Auto-Update System
  setupAutoUpdate() {
    if (!this.config.enableAutoUpdate) return;

    setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateCheckInterval);
  },

  async checkForUpdates() {
    try {
      const response = await fetch('/version.json?t=' + Date.now());
      const data = await response.json();

      if (data.version !== this.config.version) {
        this.showUpdatePrompt();
      }

    } catch (error) {
      console.warn('[AdvancedIntegration] Update-Check fehlgeschlagen');
    }
  },

  showUpdatePrompt() {
    this.showNotification(
      'Neue Version verfügbar. Seite neu laden?',
      'info',
      [
        { text: 'Jetzt aktualisieren', action: () => location.reload() },
        { text: 'Später', action: () => {} }
      ]
    );
  },

  // Feature Flags
  initFeatureFlags() {
    const flags = {
      newDesign: false,
      betaFeatures: false,
      analytics: true,
    };

    // Load from localStorage
    const stored = localStorage.getItem('feature_flags');
    if (stored) {
      Object.assign(flags, JSON.parse(stored));
    }

    this.featureFlags = flags;

    // Apply feature flags
    Object.entries(flags).forEach(([flag, enabled]) => {
      if (enabled) {
        document.body.classList.add(`feature-${flag}`);
      }
    });
  },

  isFeatureEnabled(flag) {
    return this.featureFlags[flag] === true;
  },

  // Sync Pending Changes
  async syncPendingChanges() {
    if (this.state.pendingUpdates.length === 0) return;

    console.log('[AdvancedIntegration] Synchronisiere ausstehende Änderungen...');

    for (const update of this.state.pendingUpdates) {
      try {
        await fetch(update.url, update.options);
        this.state.pendingUpdates = this.state.pendingUpdates.filter(u => u !== update);
      } catch (error) {
        console.error('[AdvancedIntegration] Sync-Fehler:', error);
      }
    }
  },

  // Notifications
  showNotification(message, type = 'info', actions = []) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <p>${message}</p>
        ${actions.length > 0 ? `
          <div class="notification-actions">
            ${actions.map(action => `
              <button class="btn btn-sm">${action.text}</button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    if (actions.length > 0) {
      notification.querySelectorAll('button').forEach((btn, index) => {
        btn.addEventListener('click', () => {
          actions[index].action();
          notification.remove();
        });
      });
    } else {
      setTimeout(() => notification.remove(), 5000);
    }

    document.body.appendChild(notification);
  },
};

// Auto-Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdvancedIntegration.init());
} else {
  AdvancedIntegration.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedIntegration;
}

window.AdvancedIntegration = AdvancedIntegration;
