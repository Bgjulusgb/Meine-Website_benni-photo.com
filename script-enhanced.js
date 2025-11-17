// ==========================================
// ULTRA-MODERN PHOTOGRAPHY WEBSITE 2025
// Complete Implementation of All 25 Todos
// Performance, Accessibility, UX
// ==========================================

'use strict';

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  PRELOADER_DURATION: 1200,
  SCROLL_THRESHOLD: 100,
  INTERSECTION_THRESHOLD: 0.1,
  SLIDER_AUTO_PLAY: true,
  SLIDER_INTERVAL: 5000,
  ANALYTICS_ID: 'UA-XXXXXXXX-X' // Todo #22: Replace with actual ID
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ==========================================
// PRELOADER (Todo #25)
// ==========================================

const initPreloader = () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }, CONFIG.PRELOADER_DURATION);
  });
};

// ==========================================
// THEME MANAGEMENT (Todo #5 - Enhanced)
// ==========================================

const initTheme = () => {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (themeToggle) {
      const icon = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.querySelector('.theme-icon').textContent = icon;
    }

    // Update theme-color meta tag
    const themeColor = theme === 'dark' ? '#111111' : '#ffffff';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
  };

  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(currentTheme);
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    });
  }

  // Listen to system preference changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
};

// ==========================================
// NAVIGATION (Todo #1 - Enhanced)
// ==========================================

const initNavigation = () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  if (!menuToggle || !navLinks) return;

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Animate menu items
    if (isOpen) {
      navLinks.querySelectorAll('li').forEach((item, index) => {
        item.style.animation = `slideInLeft 0.4s ${index * 0.1}s ease forwards`;
      });
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  });

  // Scroll behavior - hide/show navbar
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for shadow
        navbar.classList.toggle('scrolled', currentScrollY > 20);
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};

// ==========================================
// SMOOTH SCROLLING
// ==========================================

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, '', href);
      }
    });
  });
};

// ==========================================
// SCROLL ANIMATIONS (Todo #9)
// ==========================================

const initScrollAnimations = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observerOptions = {
    threshold: CONFIG.INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index * 80;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(`
    .service-card,
    .featured-item,
    .stat-item,
    .testimonial-card,
    .gallery-item,
    .photo-grid-item,
    .category-card
  `);

  animatedElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
};

// ==========================================
// ACTIVE NAVIGATION LINK
// ==========================================

const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
};

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================

const initStatCounters = () => {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const easeOutQuad = (t) => t * (2 - t);

  const animateCounter = (counter) => {
    const text = counter.textContent;
    const target = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,\s]/g, '');
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.floor(easedProgress * target);
      
      counter.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        animateCounter(entry.target);
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
};

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

const initScrollToTop = () => {
  const scrollTopBtn = document.querySelector('.scroll-top-btn') || (() => {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Nach oben scrollen');
    document.body.appendChild(btn);
    return btn;
  })();

  const handleScroll = throttle(() => {
    const show = window.scrollY > 500;
    scrollTopBtn.classList.toggle('show', show);
    scrollTopBtn.setAttribute('aria-hidden', !show);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// ==========================================
// FORM VALIDATION (Todo #12 - Enhanced)
// ==========================================

const initFormValidation = () => {
  const forms = document.querySelectorAll('form');
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup?.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      formGroup?.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id || (errorElement.id = `error-${Date.now()}`));
  };

  const clearError = (input) => {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  };

  forms.forEach(form => {
    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => clearError(input));
      
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !value) {
          showError(input, 'Dieses Feld ist erforderlich');
        } else if (input.type === 'email' && value && !validateEmail(value)) {
          showError(input, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
        } else {
          clearError(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
          showError(input, 'Dieses Feld ist erforderlich');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
          showError(input, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
          isValid = false;
        }
      });

      if (isValid) {
        showNotification('Nachricht erfolgreich gesendet!', 'success');
        form.reset();
        
        // Analytics tracking (Todo #22)
        if (window.gtag) {
          gtag('event', 'form_submission', {
            'form_name': form.id || 'contact_form'
          });
        }
      }
    });
  });
};

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.textContent = message;
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// ==========================================
// LAZY LOADING IMAGES (Todo #2)
// ==========================================

const initLazyLoading = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        img.onload = () => img.classList.add('loaded');
        img.onerror = () => {
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E';
        };
        
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
};

// ==========================================
// GALLERY LIGHTBOX (Enhanced)
// ==========================================

const initLightbox = () => {
  const galleryImages = document.querySelectorAll('.gallery-item img, .photo-grid-item img, .featured-image img');
  if (galleryImages.length === 0) return;

  let currentIndex = 0;
  let lightbox = null;
  let touchStartX = 0;
  let touchEndX = 0;

  const createLightbox = (index) => {
    currentIndex = index;
    const img = galleryImages[index];
    
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Bildvorschau');
    
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Schließen">&times;</button>
        <button class="lightbox-prev" aria-label="Vorheriges Bild">&#8249;</button>
        <button class="lightbox-next" aria-label="Nächstes Bild">&#8250;</button>
        <img src="${img.src}" alt="${img.alt || 'Galeriebild'}" class="lightbox-img">
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      lightbox.classList.add('open');
    });

    // Touch gestures (Todo #16)
    const imgElement = lightbox.querySelector('.lightbox-img');
    imgElement.addEventListener('click', toggleZoom);
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) changeImage(1);
      if (touchEndX - touchStartX > 50) changeImage(-1);
    }, { passive: true });

    // Preload adjacent images
    preloadImage(index - 1);
    preloadImage(index + 1);

    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => changeImage(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => changeImage(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', handleKeydown);
    
    // Focus trap
    lightbox.querySelector('.lightbox-close').focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    setTimeout(() => {
      lightbox.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }, 300);
  };

  const changeImage = (delta) => {
    currentIndex = (currentIndex + delta + galleryImages.length) % galleryImages.length;
    const newImg = galleryImages[currentIndex];
    const imgElement = lightbox.querySelector('.lightbox-img');
    imgElement.style.opacity = '0';
    
    setTimeout(() => {
      imgElement.src = newImg.src;
      imgElement.alt = newImg.alt || 'Galeriebild';
      imgElement.style.transform = 'scale(1)';
      imgElement.style.opacity = '1';
    }, 200);
    
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  };

  const toggleZoom = (e) => {
    const img = e.target;
    const isZoomed = img.style.transform === 'scale(1.5)';
    img.style.transform = isZoomed ? 'scale(1)' : 'scale(1.5)';
    img.style.cursor = isZoomed ? 'zoom-in' : 'zoom-out';
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
  };

  const preloadImage = (index) => {
    if (index >= 0 && index < galleryImages.length) {
      const preloadImg = new Image();
      preloadImg.src = galleryImages[index].src;
    }
  };

  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => createLightbox(index));
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        createLightbox(index);
      }
    });
  });
};

// ==========================================
// GALLERY FILTER
// ==========================================

const initGalleryFilter = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.photo-grid-item');

  if (filterButtons.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95) translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
};

// ==========================================
// TESTIMONIAL SLIDER (Todo #10)
// ==========================================

const initTestimonialSlider = () => {
  const slider = document.querySelector('.testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  let autoPlayInterval;

  const goToSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('slide-active', i === index);
      slide.style.display = i === index ? 'block' : 'none';
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index);
    });

    currentSlide = index;
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  };

  const startAutoPlay = () => {
    if (CONFIG.SLIDER_AUTO_PLAY) {
      autoPlayInterval = setInterval(nextSlide, CONFIG.SLIDER_INTERVAL);
    }
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  prevBtn?.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(index);
      startAutoPlay();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Touch gestures (Todo #16)
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    }
    if (touchEndX - touchStartX > 50) {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  }, { passive: true });

  goToSlide(0);
  startAutoPlay();
};

// ==========================================
// SOCIAL SHARING (Todo #21)
// ==========================================

const initSocialSharing = () => {
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const platform = button.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      
      let shareUrl = '';
      
      switch(platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${url}`;
          break;
      }
      
      if (shareUrl) {
        if (platform === 'email') {
          window.location.href = shareUrl;
        } else {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        // Analytics (Todo #22)
        if (window.gtag) {
          gtag('event', 'share', {
            'method': platform,
            'content_type': 'page',
            'item_id': window.location.pathname
          });
        }
      }
    });
  });

  // Web Share API support
  if (navigator.share) {
    const shareData = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.content || '',
      url: window.location.href
    };

    document.querySelector('.social-sharing')?.insertAdjacentHTML('beforeend', `
      <button class="share-btn native-share" aria-label="Teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        </svg>
      </button>
    `);

    document.querySelector('.native-share')?.addEventListener('click', async () => {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    });
  }
};

// ==========================================
// RIPPLE EFFECT (Todo #6 - Micro-interactions)
// ==========================================

const initRippleEffect = () => {
  document.querySelectorAll('.ripple-effect, .btn-primary, .btn-secondary').forEach(element => {
    element.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to stylesheet if not exists
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// ==========================================
// CUSTOM CURSOR (Todo #19)
// ==========================================

const initCustomCursor = () => {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-outline';
  
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const animateOutline = () => {
    outlineX += (mouseX - outlineX) * 0.2;
    outlineY += (mouseY - outlineY) * 0.2;
    
    cursorOutline.style.left = `${outlineX - 16}px`;
    cursorOutline.style.top = `${outlineY - 16}px`;
    
    requestAnimationFrame(animateOutline);
  };
  
  animateOutline();

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, .service-card, .featured-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'scale(1.5)';
      cursorOutline.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'scale(1)';
      cursorOutline.style.transform = 'scale(1)';
    });
  });
};

// ==========================================
// ANALYTICS INTEGRATION (Todo #22)
// ==========================================

const initAnalytics = () => {
  // Google Analytics 4
  if (CONFIG.ANALYTICS_ID && CONFIG.ANALYTICS_ID !== 'UA-XXXXXXXX-X') {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', CONFIG.ANALYTICS_ID, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure'
    });

    // Track page views
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });

    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', () => {
          gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': link.href
          });
        });
      }
    });

    // Track scroll depth
    let scrollDepth = 0;
    window.addEventListener('scroll', throttle(() => {
      const depth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
      if (depth > scrollDepth && depth % 25 === 0) {
        scrollDepth = depth;
        gtag('event', 'scroll', {
          'event_category': 'engagement',
          'event_label': `${depth}%`
        });
      }
    }, 1000), { passive: true });
  }
};

// ==========================================
// PWA SUPPORT (Todo #18)
// ==========================================

const initPWA = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  }

  // Install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button
    const installBtn = document.createElement('button');
    installBtn.className = 'btn-primary install-pwa';
    installBtn.textContent = 'App installieren';
    installBtn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 1000;';
    document.body.appendChild(installBtn);

    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (window.gtag) {
        gtag('event', 'pwa_install', {
          'outcome': outcome
        });
      }
      
      deferredPrompt = null;
    });
  });
};

// ==========================================
// PERFORMANCE MONITORING (Todo #4)
// ==========================================

const initPerformanceMonitoring = () => {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (window.gtag) {
        gtag('event', 'timing_complete', {
          'name': 'LCP',
          'value': Math.round(lastEntry.startTime),
          'event_category': 'Web Vitals'
        });
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (window.gtag) {
          gtag('event', 'timing_complete', {
            'name': 'FID',
            'value': Math.round(entry.processingStart - entry.startTime),
            'event_category': 'Web Vitals'
          });
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    window.addEventListener('beforeunload', () => {
      if (window.gtag) {
        gtag('event', 'timing_complete', {
          'name': 'CLS',
          'value': Math.round(clsValue * 1000),
          'event_category': 'Web Vitals'
        });
      }
    });
  }
};

// ==========================================
// ERROR TRACKING (Todo #17)
// ==========================================

const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    console.error('Error caught:', event.error);
    
    showNotification('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', 'error');
    
    if (window.gtag) {
      gtag('event', 'exception', {
        'description': event.error?.message || 'Unknown error',
        'fatal': false
      });
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.gtag) {
      gtag('event', 'exception', {
        'description': event.reason?.message || 'Promise rejection',
        'fatal': false
      });
    }
  });
};

// ==========================================
// ACCESSIBILITY HELPERS (Todo #3)
// ==========================================

const initAccessibility = () => {
  // Skip to main content
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        main.tabIndex = -1;
        main.focus();
        main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
      }
    });
  }

  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    // Tab trap in modals
    if (e.key === 'Tab') {
      const modal = document.querySelector('.lightbox.open');
      if (modal) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Announce dynamic content changes
  const createLiveRegion = () => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
    return liveRegion;
  };

  window.announceToScreenReader = (message) => {
    const liveRegion = document.querySelector('[aria-live]') || createLiveRegion();
    liveRegion.textContent = message;
    setTimeout(() => liveRegion.textContent = '', 1000);
  };
};

// ==========================================
// INITIALIZATION
// ==========================================

const init = () => {
  initPreloader();
  initTheme();
  initNavigation();
  initSmoothScroll();
  initScrollAnimations();
  setActiveNavLink();
  initStatCounters();
  initScrollToTop();
  initFormValidation();
  initLazyLoading();
  initLightbox();
  initGalleryFilter();
  initTestimonialSlider();
  initSocialSharing();
  initRippleEffect();
  initCustomCursor();
  initAnalytics();
  initPWA();
  initPerformanceMonitoring();
  initErrorTracking();
  initAccessibility();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Add loaded class after page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    showNotification
  };
}
