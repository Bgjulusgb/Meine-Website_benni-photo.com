// powerpoint.js – wie eine echte PowerPoint
const slides = document.querySelectorAll('.slide');
const total = slides.length;
let current = 0;

document.getElementById('total').textContent = total;
updateProgress();

function goToSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    current = (n + total) % total;
    slides[current].classList.add('active');
    document.getElementById('current').textContent = current + 1;
    updateProgress();
}

function updateProgress() {
    document.getElementById('progress').style.width = ((current + 1) / total * 100) + '%';
}

document.getElementById('nextBtn').onclick = () => goToSlide(current + 1);
document.getElementById('prevBtn').onclick = () => goToSlide(current - 1);
document.getElementById('fullscreenBtn').onclick = () => document.documentElement.requestFullscreen?.() || document.documentElement.requestFullscreen();

document.addEventListener('keydown', e => {
    if (['ArrowRight', ' ', 'Enter', 'PageDown', 'ArrowDown'].includes(e.key)) goToSlide(current + 1);
    if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) goToSlide(current - 1);
    if (e.key === 'f' || e.key === 'F11') document.documentElement.requestFullscreen();
    if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
});

// Touch-Swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
document.addEventListener('touchend', e => {
    let diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(current + (diff > 0 ? 1 : -1));
});

// Automatischer Vollbild beim Start (optional auskommentieren)
// window.onload = () => document.documentElement.requestFullscreen();
