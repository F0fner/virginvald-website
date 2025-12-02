// site-effects.js - Mushroom scroll rotation

let lastScrollY = window.scrollY;
const mushroom = document.querySelector('.mushroom-spinner');
let currentRotation = 0;

window.addEventListener('scroll', () => {
    const scrollDelta = window.scrollY - lastScrollY;
    currentRotation += scrollDelta * 0.5;
    mushroom.style.transform = `rotate(${currentRotation}deg)`;
    lastScrollY = window.scrollY;
});
