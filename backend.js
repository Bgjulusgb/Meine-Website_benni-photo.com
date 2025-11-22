// ==========================================
// BACKEND FUNCTIONALITY & INTEGRATIONS
// Form handling, analytics, sharing, newsletter
// ==========================================

'use strict';

// ==========================================
// CONTACT FORM BACKEND
// ==========================================

const initContactForm = () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate form before submission
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      showNotification('Bitte füllen Sie alle Pflichtfelder aus', 'error');
      return;
    }
    
    // Show loading state with spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><svg style="animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="0"/></svg> Wird gesendet...</span>';
    submitBtn.classList.add('loading');
    submitBtn.style.opacity = '0.7';

    const formData = {
      name: contactForm.querySelector('#name')?.value,
      email: contactForm.querySelector('#email')?.value,
      phone: contactForm.querySelector('#phone')?.value,
      service: contactForm.querySelector('#service')?.value,
      message: contactForm.querySelector('#message')?.value,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    try {
      // ==========================================================
      // BACKEND-INTEGRATION: Wählen Sie eine der folgenden Optionen
      // ==========================================================

      // OPTION 1: Eigenes Backend API
      // Ersetzen Sie 'https://your-api.com/contact' mit Ihrer API-URL
      // const response = await fetch('https://your-api.com/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      //   credentials: 'same-origin', // Für Cookie-basierte Auth
      // });

      // OPTION 2: Formspree (Empfohlen - Einfach & Kostenlos)
      // 1. Gehen Sie zu https://formspree.io
      // 2. Erstellen Sie ein kostenloses Konto
      // 3. Erstellen Sie ein neues Formular und erhalten Sie Ihre Form-ID
      // 4. Ersetzen Sie 'YOUR_FORM_ID' unten mit Ihrer ID
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // OPTION 3: EmailJS (Alternative)
      // Dokumentation: https://www.emailjs.com/docs/

      // OPTION 4: Netlify Forms (wenn auf Netlify gehostet)
      // Fügen Sie einfach 'data-netlify="true"' zum <form>-Tag hinzu

      // ==========================================================
      // DEMO-MODUS (Nur für Tests - In Production entfernen!)
      // ==========================================================
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = { ok: true };

      // WICHTIG: Aktivieren Sie eine der obigen Optionen für Production!

      if (response.ok) {
        showNotification('✓ Nachricht erfolgreich gesendet! Ich melde mich in Kürze bei Ihnen.', 'success');
        contactForm.reset();
        
        // Track successful submission
        trackEvent('Contact', 'Form Submit', 'Success');
        
        // Redirect to thank you page (optional)
        setTimeout(() => {
          // window.location.href = '/thank-you.html';
        }, 2000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Kontaktformular-Fehler:', error);

      // Detaillierte Fehlermeldungen für besseres Debugging
      let errorMessage = '❌ Fehler beim Senden.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += ' Netzwerkverbindung fehlgeschlagen.';
      } else if (error.name === 'AbortError') {
        errorMessage += ' Anfrage wurde abgebrochen (Timeout).';
      } else {
        errorMessage += ' Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt per E-Mail.';
      }

      showNotification(errorMessage, 'error');
      trackEvent('Contact', 'Form Submit', 'Error', error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.classList.remove('loading');
      submitBtn.style.opacity = '1';
    }
  });
  
  // Add real-time validation feedback
  const emailInput = contactForm.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !validateEmail(email)) {
        emailInput.classList.add('error');
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
      } else {
        emailInput.classList.remove('error');
      }
    });
  }
};

// ==========================================
// NEWSLETTER SUBSCRIPTION
// ==========================================

const initNewsletter = () => {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email || !validateEmail(email)) {
      showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      // OPTION 1: Use Mailchimp API
      // const response = await fetch('YOUR_MAILCHIMP_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email })
      // });

      // OPTION 2: Use your backend
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email })
      // });

      // Simulate success (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { ok: true };

      if (response.ok) {
        showNotification('✓ Erfolgreich angemeldet! Danke für Ihr Interesse.', 'success');
        emailInput.value = '';
        trackEvent('Newsletter', 'Subscribe', email);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      showNotification('Fehler bei der Anmeldung. Bitte versuchen Sie es später erneut.', 'error');
      trackEvent('Newsletter', 'Subscribe Error', email);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
};

// ==========================================
// SOCIAL SHARING FUNCTIONALITY
// ==========================================

const initSocialSharing = () => {
  const shareButtons = document.querySelectorAll('.share-btn');
  if (shareButtons.length === 0) return;

  const shareData = {
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.content || '',
    url: window.location.href
  };

  shareButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const platform = button.dataset.platform;
      
      // Track share event
      trackEvent('Social', 'Share', platform);

      // Use native share API if available (mobile)
      if (platform === 'native' && navigator.share) {
        try {
          await navigator.share(shareData);
          showNotification('Danke fürs Teilen!', 'success');
        } catch (error) {
          // Silently handle share errors
        }
        return;
      }

      // Platform-specific sharing
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`,
        email: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareData.url)}`
      };

      if (shareUrls[platform]) {
        if (platform === 'email') {
          window.location.href = shareUrls[platform];
        } else {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
      }
    });
  });
};

// ==========================================
// ANALYTICS TRACKING
// ==========================================

const trackEvent = (category, action, label, value) => {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  // Google Tag Manager
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: 'customEvent',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    });
  }

  // Alternative: Matomo/Piwik
  if (typeof _paq !== 'undefined') {
    _paq.push(['trackEvent', category, action, label, value]);
  }
};

const trackPageView = () => {
  const page = window.location.pathname;
  trackEvent('PageView', 'View', page);
};

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

const initPerformanceMonitoring = () => {
  if (!('performance' in window)) return;

  // Track page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
        trackEvent('Performance', 'Page Load', 'Load Time', loadTime);
      }

      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
            trackEvent('Performance', 'LCP', 'Value', lcp);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP tracking failed
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fid = Math.round(entry.processingStart - entry.startTime);
              trackEvent('Performance', 'FID', 'Value', fid);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // FID tracking failed
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Report CLS on page unload
          window.addEventListener('beforeunload', () => {
            trackEvent('Performance', 'CLS', 'Value', Math.round(clsValue * 1000));
          });
        } catch (e) {
          // CLS tracking failed
        }
      }
    }, 0);
  });
};

// ==========================================
// COOKIE CONSENT (GDPR Compliance)
// ==========================================

const initCookieConsent = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  if (!cookieConsent) {
    showCookieBanner();
  } else {
    initAnalytics();
  }
};

const showCookieBanner = () => {
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Einwilligungsbanner');
  banner.style.cssText = `
    position: fixed;
    bottom: -200px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
    width: calc(100% - 48px);
    background: var(--bg-primary);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 24px 28px;
    z-index: 9999;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(20px);
    transition: bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
    opacity: 0;
  `;
  
  banner.innerHTML = `
    <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 20px;">
      <div style="font-size: 32px; flex-shrink: 0;">🍪</div>
      <div style="flex: 1;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: var(--text-primary);">Cookies & Datenschutz</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
          Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und anonyme Nutzungsstatistiken zu erfassen. 
          <a href="/datenschutz.html" style="color: var(--text-primary); text-decoration: underline;">Mehr erfahren</a>
        </p>
      </div>
    </div>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <button id="acceptCookies" style="flex: 1; min-width: 140px; padding: 12px 24px; background: var(--text-primary); color: var(--bg-primary); border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease;">
        ✓ Akzeptieren
      </button>
      <button id="declineCookies" style="flex: 1; min-width: 140px; padding: 12px 24px; background: transparent; color: var(--text-primary); border: 2px solid var(--border); border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease;">
        Ablehnen
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.style.bottom = '24px';
      banner.style.opacity = '1';
    });
  });
  
  // Button hover effects
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  
  acceptBtn.addEventListener('mouseenter', () => {
    acceptBtn.style.transform = 'translateY(-2px)';
    acceptBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  });
  acceptBtn.addEventListener('mouseleave', () => {
    acceptBtn.style.transform = 'translateY(0)';
    acceptBtn.style.boxShadow = 'none';
  });
  
  declineBtn.addEventListener('mouseenter', () => {
    declineBtn.style.borderColor = 'var(--text-primary)';
    declineBtn.style.background = 'var(--bg-secondary)';
  });
  declineBtn.addEventListener('mouseleave', () => {
    declineBtn.style.borderColor = 'var(--border)';
    declineBtn.style.background = 'transparent';
  });
  
  const removeBanner = () => {
    banner.style.bottom = '-200px';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 600);
  };
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    removeBanner();
    initAnalytics();
    trackEvent('Cookie', 'Consent', 'Accepted');
    showNotification('✓ Cookie-Einstellungen gespeichert', 'success');
  });
  
  declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    removeBanner();
    trackEvent('Cookie', 'Consent', 'Declined');
    showNotification('Cookie-Einstellungen gespeichert', 'info');
  });
};

const initAnalytics = () => {
  // Only initialize analytics if consent was given
  if (localStorage.getItem('cookieConsent') === 'accepted') {
    // Google Analytics 4 initialization
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
  }
};

// ==========================================
// ERROR TRACKING
// ==========================================

const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    trackEvent('Error', 'JavaScript Error', event.message, 0);
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('Error', 'Unhandled Promise Rejection', event.reason, 0);
  });
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  // Create icon based on type
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-6h2v6zm0-8H9V5h2v2z"/></svg>'
  };
  
  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="flex-shrink: 0; margin-top: 2px;">${icons[type] || icons.info}</div>
      <div style="flex: 1;">${message}</div>
      <button class="notification-close" aria-label="Schließen" style="flex-shrink: 0; background: none; border: none; color: inherit; cursor: pointer; padding: 0; font-size: 20px; line-height: 1; opacity: 0.5; transition: opacity 0.2s;">&times;</button>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: -420px;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border);
    z-index: 10000;
    transition: right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    max-width: 380px;
    min-width: 320px;
    font-size: 14px;
    line-height: 1.5;
    backdrop-filter: blur(10px);
  `;
  
  if (type === 'success') {
    notification.style.background = 'var(--text-primary)';
    notification.style.color = 'var(--bg-primary)';
    notification.style.borderColor = 'var(--text-primary)';
  } else if (type === 'error') {
    notification.style.borderColor = 'var(--gray-500)';
    notification.style.background = 'var(--bg-secondary)';
    notification.style.borderWidth = '2px';
  }
  
  document.body.appendChild(notification);
  
  // Close button handler
  const closeBtn = notification.querySelector('.notification-close');
  const closeNotification = () => {
    notification.style.right = '-420px';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  };
  
  closeBtn.addEventListener('click', closeNotification);
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.5');
  
  // Slide in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      notification.style.right = '24px';
    });
  });
  
  // Auto-hide after 5 seconds
  setTimeout(closeNotification, 5000);
};

// ==========================================
// A/B TESTING HELPER
// ==========================================

const getABTestVariant = (testName, variants = ['A', 'B']) => {
  const storageKey = `abtest_${testName}`;
  let variant = localStorage.getItem(storageKey);
  
  if (!variant) {
    variant = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(storageKey, variant);
    trackEvent('ABTest', testName, variant);
  }
  
  return variant;
};

// ==========================================
// WRITING EFFECTS FOR FORMS
// ==========================================

const initWritingEffects = () => {
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');

  formInputs.forEach(input => {
    let typingTimer;

    // Typing indicator
    input.addEventListener('input', () => {
      clearTimeout(typingTimer);
      input.classList.add('typing');

      // Remove typing class after 600ms of no input
      typingTimer = setTimeout(() => {
        input.classList.remove('typing');
      }, 600);
    });

    // Character counter for textarea
    if (input.classList.contains('form-textarea')) {
      const maxLength = input.getAttribute('maxlength') || 500;
      const counter = document.createElement('div');
      counter.className = 'form-character-counter';
      counter.textContent = `0 / ${maxLength}`;

      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(counter);

      input.addEventListener('input', () => {
        const length = input.value.length;
        counter.textContent = `${length} / ${maxLength}`;

        // Highlight when approaching limit
        if (length > maxLength * 0.9) {
          counter.classList.add('limit-approaching');
        } else {
          counter.classList.remove('limit-approaching');
        }
      });
    }

    // Success state on valid input
    input.addEventListener('blur', () => {
      if (input.value.trim().length > 0 && !input.classList.contains('error')) {
        input.classList.add('success');
        setTimeout(() => {
          input.classList.remove('success');
        }, 2000);
      }
    });
  });
};

// ==========================================
// ADVANCED GALLERY BACKEND
// ==========================================

const GalleryBackend = {
  cache: new Map(),
  favorites: new Set(),
  currentFilter: 'all',
  currentSort: 'date-desc',

  init() {
    this.loadFavorites();
    this.initGalleryFilters();
    this.initGallerySort();
    this.initGallerySearch();
    this.initLazyLoading();
    this.initImageDownload();
    this.initGalleryInfiniteScroll();
    this.initImageMetadata();
  },

  // Load favorites from localStorage
  loadFavorites() {
    const saved = localStorage.getItem('gallery_favorites');
    if (saved) {
      this.favorites = new Set(JSON.parse(saved));
      this.updateFavoriteUI();
    }
  },

  saveFavorites() {
    localStorage.setItem('gallery_favorites', JSON.stringify([...this.favorites]));
  },

  // Gallery filtering
  initGalleryFilters() {
    const filterButtons = document.querySelectorAll('[data-gallery-filter]');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.galleryFilter;
        this.currentFilter = filter;

        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items with animation
        galleryItems.forEach((item, index) => {
          const category = item.dataset.category || 'all';
          const shouldShow = filter === 'all' || category === filter;

          setTimeout(() => {
            if (shouldShow) {
              item.style.display = '';
              setTimeout(() => {
                item.classList.add('revealed');
              }, 50);
            } else {
              item.classList.remove('revealed');
              setTimeout(() => {
                item.style.display = 'none';
              }, 300);
            }
          }, index * 30);
        });

        trackEvent('Gallery', 'Filter', filter);
      });
    });
  },

  // Gallery sorting
  initGallerySort() {
    const sortSelect = document.querySelector('[data-gallery-sort]');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      this.currentSort = sortBy;
      this.sortGallery(sortBy);
      trackEvent('Gallery', 'Sort', sortBy);
    });
  },

  sortGallery(sortBy) {
    const container = document.querySelector('.gallery-grid, .grid');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.gallery-item'));

    items.sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return (b.dataset.date || 0) - (a.dataset.date || 0);
        case 'date-asc':
          return (a.dataset.date || 0) - (b.dataset.date || 0);
        case 'title-asc':
          return (a.dataset.title || '').localeCompare(b.dataset.title || '');
        case 'title-desc':
          return (b.dataset.title || '').localeCompare(a.dataset.title || '');
        case 'favorites':
          const aFav = this.favorites.has(a.dataset.imageId);
          const bFav = this.favorites.has(b.dataset.imageId);
          return bFav - aFav;
        default:
          return 0;
      }
    });

    // Re-append in new order with animation
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9)';
      setTimeout(() => {
        container.appendChild(item);
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, index * 30);
      }, 50);
    });
  },

  // Gallery search
  initGallerySearch() {
    const searchInput = document.querySelector('[data-gallery-search]');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.toLowerCase().trim();

      searchTimeout = setTimeout(() => {
        this.searchGallery(query);
        trackEvent('Gallery', 'Search', query);
      }, 300);
    });
  },

  searchGallery(query) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      const title = (item.dataset.title || '').toLowerCase();
      const description = (item.dataset.description || '').toLowerCase();
      const tags = (item.dataset.tags || '').toLowerCase();
      const category = (item.dataset.category || '').toLowerCase();

      const matches = !query ||
        title.includes(query) ||
        description.includes(query) ||
        tags.includes(query) ||
        category.includes(query);

      if (matches) {
        item.style.display = '';
        setTimeout(() => item.classList.add('revealed'), 50);
      } else {
        item.classList.remove('revealed');
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  },

  // Advanced lazy loading for gallery
  initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.dataset.lazySrc;

          if (src && !img.src) {
            // Preload image
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = src;
              img.classList.add('loaded');
              img.classList.add('fade-in');
            };
            tempImg.onerror = () => {
              img.classList.add('error');
              console.error('Failed to load image:', src);
            };
            tempImg.src = src;

            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('.gallery-item img[data-src], .gallery-item img[data-lazy-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  // Image download functionality
  initImageDownload() {
    document.addEventListener('click', async (e) => {
      const downloadBtn = e.target.closest('[data-download-image]');
      if (!downloadBtn) return;

      e.preventDefault();
      const imageUrl = downloadBtn.dataset.downloadImage;
      const filename = downloadBtn.dataset.filename || 'image.jpg';

      try {
        showNotification('Downloading image...', 'info');

        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showNotification('✓ Image downloaded successfully!', 'success');
        trackEvent('Gallery', 'Download', filename);
      } catch (error) {
        console.error('Download failed:', error);
        showNotification('❌ Download failed. Please try again.', 'error');
        trackEvent('Gallery', 'Download Error', filename);
      }
    });
  },

  // Infinite scroll for gallery
  initGalleryInfiniteScroll() {
    const gallery = document.querySelector('.gallery-grid, .grid');
    if (!gallery || !gallery.dataset.infiniteScroll) return;

    let page = 1;
    let loading = false;
    let hasMore = true;

    const loadMore = async () => {
      if (loading || !hasMore) return;

      loading = true;
      const loader = this.createLoader();
      gallery.appendChild(loader);

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/gallery?page=${page + 1}&limit=12`);
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          data.images.forEach(img => {
            const item = this.createGalleryItem(img);
            gallery.appendChild(item);
          });
          page++;
          hasMore = data.hasMore;
          trackEvent('Gallery', 'Load More', `Page ${page}`);
        } else {
          hasMore = false;
          showNotification('No more images to load', 'info');
        }
      } catch (error) {
        console.error('Failed to load more images:', error);
        showNotification('Failed to load more images', 'error');
      } finally {
        loader.remove();
        loading = false;
      }
    };

    // Intersection Observer for infinite scroll
    const sentinel = document.createElement('div');
    sentinel.className = 'gallery-sentinel';
    sentinel.style.height = '1px';
    gallery.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  },

  createLoader() {
    const loader = document.createElement('div');
    loader.className = 'gallery-loader';
    loader.innerHTML = `
      <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1); border-top-color: var(--text-primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 16px; color: var(--text-secondary);">Loading more images...</p>
      </div>
    `;
    return loader;
  },

  createGalleryItem(data) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.category = data.category || '';
    item.dataset.date = data.date || Date.now();
    item.dataset.title = data.title || '';
    item.dataset.imageId = data.id || '';

    item.innerHTML = `
      <img data-src="${data.url}" alt="${data.alt || ''}" loading="lazy">
      <div class="gallery-info">
        <h3>${data.title || 'Untitled'}</h3>
        <p>${data.description || ''}</p>
      </div>
      <button class="gallery-favorite" data-image-id="${data.id}" aria-label="Add to favorites">
        ♥
      </button>
    `;

    return item;
  },

  // Image metadata viewer
  initImageMetadata() {
    document.addEventListener('click', (e) => {
      const infoBtn = e.target.closest('[data-image-info]');
      if (!infoBtn) return;

      const imageId = infoBtn.dataset.imageInfo;
      this.showImageMetadata(imageId);
    });
  },

  async showImageMetadata(imageId) {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/images/${imageId}/metadata`);
      const metadata = await response.json();

      const modal = document.createElement('div');
      modal.className = 'metadata-modal';
      modal.innerHTML = `
        <div class="metadata-modal-content">
          <button class="metadata-close">&times;</button>
          <h3>Image Information</h3>
          <div class="metadata-grid">
            ${metadata.camera ? `<div><strong>Camera:</strong> ${metadata.camera}</div>` : ''}
            ${metadata.lens ? `<div><strong>Lens:</strong> ${metadata.lens}</div>` : ''}
            ${metadata.iso ? `<div><strong>ISO:</strong> ${metadata.iso}</div>` : ''}
            ${metadata.aperture ? `<div><strong>Aperture:</strong> f/${metadata.aperture}</div>` : ''}
            ${metadata.shutter ? `<div><strong>Shutter:</strong> ${metadata.shutter}s</div>` : ''}
            ${metadata.focal ? `<div><strong>Focal Length:</strong> ${metadata.focal}mm</div>` : ''}
            ${metadata.date ? `<div><strong>Date:</strong> ${new Date(metadata.date).toLocaleDateString()}</div>` : ''}
            ${metadata.location ? `<div><strong>Location:</strong> ${metadata.location}</div>` : ''}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);

      modal.querySelector('.metadata-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
      });

      trackEvent('Gallery', 'View Metadata', imageId);
    } catch (error) {
      console.error('Failed to load metadata:', error);
      showNotification('Failed to load image information', 'error');
    }
  },

  updateFavoriteUI() {
    document.querySelectorAll('[data-image-id]').forEach(btn => {
      const imageId = btn.dataset.imageId;
      if (this.favorites.has(imageId)) {
        btn.classList.add('favorited');
      } else {
        btn.classList.remove('favorited');
      }
    });
  }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize in optimal order
  // Note: Preloader is handled by main.js
  initCookieConsent();
  initContactForm();
  initNewsletter();
  initSocialSharing();
  initPerformanceMonitoring();
  initErrorTracking();
  initWritingEffects();
  GalleryBackend.init();
  trackPageView();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.backendFunctions = {
    trackEvent,
    showNotification,
    validateEmail,
    initAnalytics
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackEvent,
    showNotification,
    validateEmail
  };
}
