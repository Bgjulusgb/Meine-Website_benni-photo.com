/**
 * FORM ENHANCEMENTS
 * Moderne Formular-Interaktionen und Validierung
 */

(function() {
  'use strict';

  // Warte bis DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initFloatingLabels();
    initFormValidation();
    initCheckboxInteractions();
  }

  /**
   * Floating Labels - Aktiviere/Deaktiviere basierend auf Wert
   */
  function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group-modern');

    formGroups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      if (!input) return;

      // Initial check
      checkValue(input, group);

      // Event listeners
      input.addEventListener('input', () => checkValue(input, group));
      input.addEventListener('change', () => checkValue(input, group));
      input.addEventListener('blur', () => checkValue(input, group));
    });

    function checkValue(input, group) {
      if (input.value && input.value.trim() !== '') {
        group.classList.add('has-value');
      } else {
        group.classList.remove('has-value');
      }
    }
  }

  /**
   * Form Validation - Erweiterte Validierung mit visuellen Hinweisen
   */
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formGroups = form.querySelectorAll('.form-group-modern');

    // Entferne default Browser-Validierung
    form.setAttribute('novalidate', 'novalidate');

    // Validiere Felder bei Blur
    formGroups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      if (!input) return;

      input.addEventListener('blur', () => {
        validateField(input, group);
      });

      input.addEventListener('input', () => {
        // Entferne Fehler bei Eingabe
        if (group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    });

    // Form Submit Validierung
    form.addEventListener('submit', (e) => {
      let isValid = true;

      formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (!input) return;

        if (!validateField(input, group)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();

        // Scroll zum ersten Fehler
        const firstError = form.querySelector('.form-group-modern.error');
        if (firstError) {
          firstError.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          const input = firstError.querySelector('input, select, textarea');
          if (input) {
            setTimeout(() => input.focus(), 500);
          }
        }
      }
    });
  }

  /**
   * Validiere einzelnes Feld
   */
  function validateField(input, group) {
    const isRequired = input.hasAttribute('required');
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';

    // Required Check
    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'Dieses Feld ist erforderlich';
    }

    // Email Validation
    if (isValid && type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      }
    }

    // Tel Validation
    if (isValid && type === 'tel' && value) {
      const telRegex = /^[+\d\s\-()]+$/;
      if (!telRegex.test(value)) {
        isValid = false;
        errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein';
      }
    }

    // Select Validation
    if (isRequired && input.tagName === 'SELECT' && (!value || value === '')) {
      isValid = false;
      errorMessage = 'Bitte wählen Sie eine Option';
    }

    // Textarea Min Length
    if (isValid && input.tagName === 'TEXTAREA' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Bitte geben Sie mindestens 10 Zeichen ein';
    }

    // Update UI
    if (!isValid) {
      group.classList.add('error');

      // Füge Fehlermeldung hinzu falls noch nicht vorhanden
      let errorEl = group.querySelector('.form-error-message');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error-message';
        input.parentNode.insertBefore(errorEl, input.nextSibling);
      }
      errorEl.textContent = errorMessage;
    } else {
      group.classList.remove('error');

      const errorEl = group.querySelector('.form-error-message');
      if (errorEl) {
        errorEl.remove();
      }
    }

    return isValid;
  }

  /**
   * Checkbox Interactions - Verbesserte Interaktionen
   */
  function initCheckboxInteractions() {
    const checkboxLabels = document.querySelectorAll('.checkbox-label');

    checkboxLabels.forEach(label => {
      const checkbox = label.querySelector('.checkbox-input');
      if (!checkbox) return;

      // Tastatur-Support
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });

      // Focus Styles
      checkbox.addEventListener('focus', () => {
        label.style.outline = '2px solid var(--text-primary)';
        label.style.outlineOffset = '2px';
      });

      checkbox.addEventListener('blur', () => {
        label.style.outline = 'none';
      });
    });
  }

  /**
   * Smooth Scroll für Anker-Links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Init Smooth Scroll
  initSmoothScroll();

})();
