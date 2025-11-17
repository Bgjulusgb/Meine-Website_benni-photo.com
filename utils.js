// ==========================================
// UTILITY FUNCTIONS
// Helper functions used across the application
// ==========================================

'use strict';

// ==========================================
// DEBOUNCE FUNCTION
// Limits function execution frequency
// ==========================================

const debounce = (func, delay = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// ==========================================
// THROTTLE FUNCTION
// Ensures function runs at most once per interval
// ==========================================

const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ==========================================
// SMOOTH SCROLL TO ELEMENT
// ==========================================

const smoothScrollTo = (target, offset = 80) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// ==========================================
// DETECT IF ELEMENT IS IN VIEWPORT
// ==========================================

const isInViewport = (element, offset = 0) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
};

// ==========================================
// GET COOKIE VALUE
// ==========================================

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// ==========================================
// SET COOKIE
// ==========================================

const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

// ==========================================
// DELETE COOKIE
// ==========================================

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// ==========================================
// FORMAT DATE
// ==========================================

const formatDate = (date, locale = 'de-DE') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ==========================================
// COPY TO CLIPBOARD
// ==========================================

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        console.error('Fallback: Could not copy text', err);
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy text', err);
    return false;
  }
};

// ==========================================
// GENERATE UNIQUE ID
// ==========================================

const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ==========================================
// SANITIZE HTML
// Prevents XSS attacks
// ==========================================

const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

// ==========================================
// TRUNCATE TEXT
// ==========================================

const truncateText = (text, maxLength = 100, ellipsis = '...') => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + ellipsis;
};

// ==========================================
// CHECK IF MOBILE DEVICE
// ==========================================

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ==========================================
// CHECK IF TOUCH DEVICE
// ==========================================

const isTouchDevice = () => {
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         (navigator.msMaxTouchPoints > 0);
};

// ==========================================
// GET SCROLL PERCENTAGE
// ==========================================

const getScrollPercentage = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return (winScroll / height) * 100;
};

// ==========================================
// PRELOAD IMAGES
// ==========================================

const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    })
  );
};

// ==========================================
// LAZY LOAD IMAGE
// ==========================================

const lazyLoadImage = (img) => {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalHeight !== 0) {
      resolve(img);
      return;
    }
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
    
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
};

// ==========================================
// WAIT FOR FUNCTION
// Delays execution
// ==========================================

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ==========================================
// RETRY FUNCTION
// Retries async function with exponential backoff
// ==========================================

const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await wait(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

// ==========================================
// EXPORT FOR MODULE USAGE
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    smoothScrollTo,
    isInViewport,
    getCookie,
    setCookie,
    deleteCookie,
    formatDate,
    copyToClipboard,
    generateId,
    sanitizeHTML,
    truncateText,
    isMobile,
    isTouchDevice,
    getScrollPercentage,
    preloadImages,
    lazyLoadImage,
    wait,
    retry
  };
}
