/* ============================================
   JAVASCRIPT VERBESSERUNGEN & ERWEITERUNGEN
   Benjamin Gillmann Photography Website
   ============================================ */

// ===== THEME TOGGLE FUNCTIONALITY =====
(function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add animation class
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
})();

// ===== LAZY LOADING FOR IMAGES =====
(function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
})();

// ===== FORM VALIDATION =====
(function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        const showError = (input, message) => {
            const errorDiv = document.getElementById(`${input.id}-error`);
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.classList.add('show');
                errorDiv.style.display = 'block';
                input.setAttribute('aria-invalid', 'true');
            }
        };
        
        const clearError = (input) => {
            const errorDiv = document.getElementById(`${input.id}-error`);
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.classList.remove('show');
                errorDiv.style.display = 'none';
                input.setAttribute('aria-invalid', 'false');
            }
        };
        
        const validateName = () => {
            if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).');
                return false;
            }
            clearError(nameInput);
            return true;
        };
        
        const validateEmail = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return false;
            }
            clearError(emailInput);
            return true;
        };
        
        const validateMessage = () => {
            if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Ihre Nachricht sollte mindestens 10 Zeichen lang sein.');
                return false;
            }
            clearError(messageInput);
            return true;
        };
        
        // Real-time validation
        if (nameInput) nameInput.addEventListener('blur', validateName);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);
        if (messageInput) messageInput.addEventListener('blur', validateMessage);
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();
            
            if (isNameValid && isEmailValid && isMessageValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoading = submitBtn.querySelector('.btn-loading');
                
                if (btnText && btnLoading) {
                    btnText.style.display = 'none';
                    btnLoading.style.display = 'inline-flex';
                }
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Show success message
                    const successDiv = document.getElementById('form-success');
                    if (successDiv) {
                        successDiv.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
                        successDiv.style.display = 'block';
                    }
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    if (btnText && btnLoading) {
                        btnText.style.display = 'inline';
                        btnLoading.style.display = 'none';
                    }
                    submitBtn.disabled = false;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (successDiv) successDiv.style.display = 'none';
                    }, 5000);
                }, 2000);
            }
        });
    }
})();

// ===== GALLERY FILTER FUNCTIONALITY =====
(function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.photo-grid-item, .gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
})();

// ===== STATS COUNTER ANIMATION =====
(function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target || element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = entry.target.closest('.stat-item');
                if (statItem) {
                    statItem.classList.add('animated');
                    const numberElement = entry.target;
                    animateCounter(numberElement);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => observer.observe(number));
})();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#main') {
                e.preventDefault();
                const target = document.getElementById('main') || document.body;
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll hint functionality
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', () => {
            const nextSection = scrollHint.closest('section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
})();

// ===== MOBILE MENU IMPROVEMENTS =====
(function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
    }
})();

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
(function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .featured-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
})();

// ===== PERFORMANCE MONITORING =====
(function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    }
})();

// ===== ACCESSIBILITY: KEYBOARD NAVIGATION =====
(function initKeyboardNavigation() {
    // Trap focus in mobile menu when open
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navLinks && menuToggle) {
        navLinks.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = navLinks.querySelectorAll('a, button');
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
        });
    }
})();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send errors to an analytics service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send errors to an analytics service here
});

console.log('✅ All improvements loaded successfully!');
