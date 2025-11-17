/* ==========================================
   JAVASCRIPT FUNCTIONALITY ENHANCEMENT
   Zusätzliche UI/UX Funktionen
   ========================================== */

// ==========================================
// LIGHTBOX GALLERY
// ==========================================

const initLightbox = () => {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-container">
      <button class="lightbox-close" aria-label="Schließen">×</button>
      <button class="lightbox-nav prev" aria-label="Vorheriges Bild">←</button>
      <img src="" alt="">
      <button class="lightbox-nav next" aria-label="Nächstes Bild">→</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  let currentIndex = 0;
  let images = [];

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightboxImage = () => {
    const img = lightbox.querySelector('img');
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt;
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  };

  // Event Listeners
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.next').addEventListener('click', showNext);
  lightbox.querySelector('.prev').addEventListener('click', showPrev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Initialize gallery items
  const galleryItems = document.querySelectorAll('.photo-card, .gallery-item');
  images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.style.cursor = 'pointer';
  });
};

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================

const initSearch = () => {
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  const searchClear = document.querySelector('.search-clear');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    searchContainer?.classList.toggle('has-value', value.length > 0);

    // Filter gallery items
    const items = document.querySelectorAll('.photo-card, .gallery-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = text.includes(value.toLowerCase());
      item.style.display = matches ? '' : 'none';
    });
  });

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchContainer?.classList.remove('has-value');
    document.querySelectorAll('.photo-card, .gallery-item').forEach(item => {
      item.style.display = '';
    });
    searchInput.focus();
  });
};

// ==========================================
// CATEGORY FILTER
// ==========================================

const initFilters = () => {
  const filterBtns = document.querySelectorAll('.category-btn, .filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;
      const items = document.querySelectorAll('.photo-card, .gallery-item, .masonry-item');

      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = '';
          item.classList.remove('hidden');
        } else {
          item.style.display = 'none';
          item.classList.add('hidden');
        }
      });
    });
  });
};

// ==========================================
// CAROUSEL / SLIDER
// ==========================================

const initCarousel = () => {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-nav-prev');
    const nextBtn = carousel.querySelector('.carousel-nav-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    };

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
      });
    });

    // Auto-play
    let autoplay = setInterval(nextSlide, 5000);
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => {
      autoplay = setInterval(nextSlide, 5000);
    });
  });
};

// ==========================================
// MODAL SYSTEM
// ==========================================

const initModals = () => {
  const openModalButtons = document.querySelectorAll('[data-modal-target]');
  const closeModalButtons = document.querySelectorAll('.modal-close');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modalTarget;
      const modal = document.querySelector(modalId);
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-backdrop');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modalBackdrops.forEach(backdrop => {
    if (backdrop.dataset.closeOnBackdrop === 'true') {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(backdrop => {
        if (backdrop.classList.contains('active')) {
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });
};

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

const initBackToTop = () => {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================

const initScrollProgress = () => {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progressBar.style.transform = `scaleX(${scrolled / 100})`;
  }, { passive: true });
};

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

const initLazyLoading = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// ==========================================
// FORM VALIDATION
// ==========================================

const initFormValidation = () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('.form-input, .form-textarea');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateInput(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      let isValid = true;

      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
};

const validateInput = (input) => {
  const formGroup = input.closest('.form-group');
  let errorMsg = formGroup?.querySelector('.form-error');

  // Remove existing error
  formGroup?.classList.remove('error', 'success');
  if (errorMsg) errorMsg.remove();

  // Check if required
  if (input.hasAttribute('required') && !input.value.trim()) {
    showError(formGroup, 'Dieses Feld ist erforderlich');
    return false;
  }

  // Email validation
  if (input.type === 'email' && input.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      showError(formGroup, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return false;
    }
  }

  // Success state
  formGroup?.classList.add('success');
  return true;
};

const showError = (formGroup, message) => {
  formGroup?.classList.add('error');
  const errorMsg = document.createElement('span');
  errorMsg.className = 'form-error';
  errorMsg.textContent = message;
  formGroup?.appendChild(errorMsg);
};

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

const showToast = (message, duration = 3000) => {
  const toast = document.querySelector('.toast') || createToast();
  const toastMessage = toast.querySelector('.toast-message');
  
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

const createToast = () => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-message"></span>
    <button class="toast-action">OK</button>
  `;
  document.body.appendChild(toast);

  toast.querySelector('.toast-action').addEventListener('click', () => {
    toast.classList.remove('show');
  });

  return toast;
};

// ==========================================
// PARALLAX EFFECT
// ==========================================

const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax, .parallax-slow, .parallax-medium, .parallax-fast');
  
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = el.classList.contains('parallax-fast') ? 0.6 :
                    el.classList.contains('parallax-medium') ? 0.4 :
                    el.classList.contains('parallax-slow') ? 0.2 : 0.3;
      
      el.style.setProperty('--scroll-progress', scrolled * speed);
    });
  }, { passive: true });
};

// ==========================================
// COPY TO CLIPBOARD
// ==========================================

const initCopyButtons = () => {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || btn.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
};

// ==========================================
// INITIALIZE ALL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initSearch();
  initFilters();
  initCarousel();
  initModals();
  initBackToTop();
  initScrollProgress();
  initLazyLoading();
  initFormValidation();
  initParallax();
  initCopyButtons();
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initLightbox,
    initSearch,
    initFilters,
    initCarousel,
    initModals,
    showToast
  };
}
