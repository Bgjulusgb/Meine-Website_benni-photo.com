// ==========================================
// PRELOADER FUNCTIONALITY
// Modern page preloader with smooth fade-out and progress tracking
// ==========================================

'use strict';

(function() {
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');

    if (!preloader) {
      return;
    }
    
    let isHidden = false;
    
    const hidePreloader = () => {
      if (isHidden) return;
      isHidden = true;
      
      preloader.classList.add('hidden');
      preloader.setAttribute('aria-hidden', 'true');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.remove();
        }
        document.body.classList.add('loaded');

        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('preloaderHidden'));
      }, 600);
    };
    
    // Track loading progress
    let resourcesLoaded = 0;
    let totalResources = 0;
    
    // Count total resources
    const images = document.querySelectorAll('img');
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    totalResources = images.length + links.length;
    
    // Track image loading
    images.forEach(img => {
      if (img.complete) {
        resourcesLoaded++;
      } else {
        img.addEventListener('load', () => resourcesLoaded++);
        img.addEventListener('error', () => resourcesLoaded++);
      }
    });
    
    // Track stylesheet loading
    links.forEach(link => {
      if (link.sheet) {
        resourcesLoaded++;
      } else {
        link.addEventListener('load', () => resourcesLoaded++);
        link.addEventListener('error', () => resourcesLoaded++);
      }
    });
    
    // Progress check interval
    const progressInterval = setInterval(() => {
      const progress = totalResources > 0 ? (resourcesLoaded / totalResources) * 100 : 100;
      
      if (progress >= 100 || resourcesLoaded >= totalResources) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    // Hide preloader when page is fully loaded
    const handleLoad = () => {
      clearInterval(progressInterval);
      
      // Add minimum display time for smooth experience (400ms)
      setTimeout(() => {
        hidePreloader();
      }, 400);
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }
    
    // Fallback: Hide preloader after max 8 seconds
    const fallbackTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      hidePreloader();
    }, 8000);
    
    // Clear fallback if hidden normally
    window.addEventListener('preloaderHidden', () => {
      clearTimeout(fallbackTimeout);
    }, { once: true });
  };
  
  // Initialize immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader, { once: true });
  } else {
    initPreloader();
  }
})();
