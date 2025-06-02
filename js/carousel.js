// js/carousel.js

let currentSlide = 0;
let autoSlideInterval;
const slideDuration = 5000; // Duración de cada slide en milisegundos

let carouselTrack;
let carouselDotsContainer;
let slides = [];
let dots = [];

export function initCarousel(bannersData) {
    carouselTrack = document.getElementById('carouselTrack');
    const carouselPrevBtn = document.getElementById('carouselPrev');
    const carouselNextBtn = document.getElementById('carouselNext');
    carouselDotsContainer = document.getElementById('carouselDots');

    if (!carouselTrack || !carouselDotsContainer) {
        console.warn('Elementos del carrusel no encontrados. Inicialización abortada.');
        return;
    }

    // Limpiar contenido estático y cargar banners dinámicamente
    carouselTrack.innerHTML = '';
    carouselDotsContainer.innerHTML = '';

    if (bannersData && bannersData.length > 0) {
        bannersData.forEach((banner, index) => {
            const slideElement = createSlideElement(banner);
            carouselTrack.appendChild(slideElement);

            const dotElement = createDotElement(index);
            carouselDotsContainer.appendChild(dotElement);
        });
        slides = Array.from(carouselTrack.children);
        dots = Array.from(carouselDotsContainer.children);

        // Asegurarse de que el primer slide y dot estén activos al inicio
        updateCarousel();
        startAutoSlide();
    } else {
        console.warn('No se encontraron datos de banners para el carrusel.');
        // Puedes dejar un slide de placeholder o ocultar el carrusel
    }

    carouselPrevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        showSlide(currentSlide - 1);
        startAutoSlide();
    });

    carouselNextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        showSlide(currentSlide + 1);
        startAutoSlide();
    });

    carouselDotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            clearInterval(autoSlideInterval);
            const index = dots.indexOf(e.target);
            showSlide(index);
            startAutoSlide();
        }
    });

    // Swipe en móviles (opcional, requiere más lógica)
    // let touchStartX = 0;
    // carouselTrack.addEventListener('touchstart', (e) => {
    //     touchStartX = e.touches[0].clientX;
    // });
    // carouselTrack.addEventListener('touchend', (e) => {
    //     const touchEndX = e.changedTouches[0].clientX;
    //     if (touchEndX < touchStartX - 50) { // Swipe left
    //         clearInterval(autoSlideInterval);
    //         showSlide(currentSlide + 1);
    //         startAutoSlide();
    //     } else if (touchEndX > touchStartX + 50) { // Swipe right
    //         clearInterval(autoSlideInterval);
    //         showSlide(currentSlide - 1);
    //         startAutoSlide();
    //     }
    // });
}

function createSlideElement(banner) {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    slide.style.backgroundImage = `url(${banner.imageUrl})`; // Carga la imagen como fondo CSS

    const caption = document.createElement('div');
    caption.classList.add('carousel-caption');

    const title = document.createElement('h2');
    title.textContent = banner.title;

    const description = document.createElement('p');
    description.textContent = banner.description;

    const button = document.createElement('a');
    button.href = banner.link;
    button.classList.add('btn-primary');
    button.textContent = banner.buttonText || 'Ver Más';

    caption.appendChild(title);
    caption.appendChild(description);
    caption.appendChild(button);
    slide.appendChild(caption);

    return slide;
}


function createDotElement(index) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.dataset.slideIndex = index;
    return dot;
}

function showSlide(index) {
    if (slides.length === 0) return;

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;

    updateCarousel();
}

function updateCarousel() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active'); // Opcional, para aplicar estilos a la slide activa
        } else {
            slide.classList.remove('active');
        }
    });

    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, slideDuration);
}
