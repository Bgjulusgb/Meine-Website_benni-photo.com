/**
 * TYPING ANIMATIONS
 * Moderne Schreibmaschinen-Animationen für Texte
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
    initTypewriter();
    initTextReveal();
  }

  /**
   * Typewriter Effect - Schreibmaschinen-Animation
   */
  function initTypewriter() {
    const elements = document.querySelectorAll('[data-typewriter]');

    elements.forEach(element => {
      const text = element.getAttribute('data-typewriter') || element.textContent;
      const speed = parseInt(element.getAttribute('data-typewriter-speed')) || 100;
      const delay = parseInt(element.getAttribute('data-typewriter-delay')) || 0;
      const cursor = element.getAttribute('data-typewriter-cursor') !== 'false';
      const loop = element.getAttribute('data-typewriter-loop') === 'true';

      // Wenn mehrere Texte (durch | getrennt)
      const texts = text.split('|').map(t => t.trim());

      // Setze initialen leeren Text
      element.textContent = '';

      // Füge Cursor hinzu
      if (cursor) {
        element.classList.add('typewriter-cursor');
      }

      // Starte nach Delay
      setTimeout(() => {
        if (texts.length > 1) {
          typewriterMultiple(element, texts, speed, loop);
        } else {
          typewriterSingle(element, texts[0], speed);
        }
      }, delay);
    });
  }

  /**
   * Typewriter - Single Text
   */
  function typewriterSingle(element, text, speed) {
    let index = 0;

    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        // Animation beendet
        element.classList.add('typewriter-complete');
      }
    }

    type();
  }

  /**
   * Typewriter - Multiple Texts (Rotation)
   */
  function typewriterMultiple(element, texts, speed, loop) {
    let textIndex = 0;

    function typeText() {
      const currentText = texts[textIndex];
      let charIndex = 0;

      // Typing
      function type() {
        if (charIndex < currentText.length) {
          element.textContent += currentText.charAt(charIndex);
          charIndex++;
          setTimeout(type, speed);
        } else {
          // Warte, dann lösche
          setTimeout(deleteText, 2000);
        }
      }

      // Deleting
      function deleteText() {
        if (element.textContent.length > 0) {
          element.textContent = element.textContent.slice(0, -1);
          setTimeout(deleteText, speed / 2);
        } else {
          // Nächster Text
          textIndex = (textIndex + 1) % texts.length;

          // Loop oder stop
          if (loop || textIndex !== 0) {
            setTimeout(typeText, 500);
          }
        }
      }

      type();
    }

    typeText();
  }

  /**
   * Text Reveal - Wort-für-Wort Animation
   */
  function initTextReveal() {
    const elements = document.querySelectorAll('[data-text-reveal]');

    elements.forEach(element => {
      const delay = parseInt(element.getAttribute('data-text-reveal-delay')) || 0;
      const stagger = parseInt(element.getAttribute('data-text-reveal-stagger')) || 50;

      // Teile Text in Wörter
      const text = element.textContent;
      const words = text.split(' ');

      // Erstelle Spans für jedes Wort
      element.innerHTML = '';
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.className = 'text-reveal-word';
        span.style.animationDelay = `${delay + (index * stagger)}ms`;
        element.appendChild(span);

        // Füge Leerzeichen hinzu (außer beim letzten Wort)
        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  /**
   * Observer für Scroll-basierte Animationen
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  // Beobachte Elemente mit data-scroll-reveal
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    observer.observe(el);
  });

})();
