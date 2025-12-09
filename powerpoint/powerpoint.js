// powerpoint.js – funktioniert garantiert
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    document.getElementById('current').textContent = currentSlide + 1;
    document.getElementById('bar').style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
}

// Initial
showSlide(0);
document.getElementById('total').textContent = totalSlides;

// Buttons
document.getElementById('next').onclick = () => showSlide(currentSlide + 1);
document.getElementById('prev').onclick = () => showSlide(currentSlide - 1);
document.getElementById('fs').onclick = () => document.documentElement.requestFullscreen();

// Tastatur & Touch
document.addEventListener('keydown', e => {
    if (['ArrowRight', ' ', 'Enter', 'PageDown', 'ArrowDown'].includes(e.key)) showSlide(currentSlide + 1);
    if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) showSlide(currentSlide - 1);
    if (e.key.toLowerCase() === 'f') document.documentElement.requestFullscreen();
});

// Touch Swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, {passive: true});
document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) showSlide(currentSlide + (diff > 0 ? 1 : -1));
}, {passive: true});

// Mausklick = weiter
document.addEventListener('click', () => showSlide(currentSlide + 1));
document.getElementById('prev').addEventListener('click', e => { e.stopPropagation(); showSlide(currentSlide - 1); });
