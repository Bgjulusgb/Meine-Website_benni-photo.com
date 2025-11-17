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
      // OPTION 1: Send to your backend API
      // const response = await fetch('https://your-api.com/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // OPTION 2: Use Formspree (simple integration)
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // OPTION 3: Simulate success for demo (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = { ok: true };

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
      console.error('Form submission error:', error);
      showNotification('❌ Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt per E-Mail.', 'error');
      trackEvent('Contact', 'Form Submit', 'Error');
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
      console.error('Newsletter subscription error:', error);
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
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
          }
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

  // Console log for debugging
  console.log('Event tracked:', { category, action, label, value });
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
        
        console.log('Page Load Time:', loadTime + 'ms');
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
            console.log('LCP:', lcp + 'ms');
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation failed:', e);
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fid = Math.round(entry.processingStart - entry.startTime);
              trackEvent('Performance', 'FID', 'Value', fid);
              console.log('FID:', fid + 'ms');
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observation failed:', e);
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
            console.log('CLS:', clsValue.toFixed(3));
          });
        } catch (e) {
          console.warn('CLS observation failed:', e);
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
    
    console.log('Analytics initialized');
  }
};

// ==========================================
// ERROR TRACKING
// ==========================================

const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    trackEvent('Error', 'JavaScript Error', event.message, 0);
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('Error', 'Unhandled Promise Rejection', event.reason, 0);
    console.error('Unhandled rejection:', event.reason);
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
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize in optimal order
  initCookieConsent();
  initContactForm();
  initNewsletter();
  initSocialSharing();
  initPerformanceMonitoring();
  initErrorTracking();
  trackPageView();
  
  // Log initialization for debugging
  console.log('Backend initialized successfully');
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
