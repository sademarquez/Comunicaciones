// js/carousel.js

let currentSlide = 0;
let autoSlideInterval;
const slideDuration = 6000; // Duración de cada slide en milisegundos

let carouselTrack;
let carouselDotsContainer;
let slides = [];
let dots = [];
let carouselPrevBtn;
let carouselNextBtn;

/**
 * Inicializa el carrusel con los banners proporcionados.
 * @param {Array} bannersData - Array de objetos de banners.
 */
export function initCarousel(bannersData) {
    carouselTrack = document.getElementById('carouselTrack');
    carouselPrevBtn = document.getElementById('carouselPrev');
    carouselNextBtn = document.getElementById('carouselNext');
    carouselDotsContainer = document.getElementById('carouselDots');

    if (!carouselTrack || !carouselDotsContainer || !carouselPrevBtn || !carouselNextBtn) {
        console.warn('Elementos del carrusel no encontrados. Inicialización abortada.');
        return;
    }

    carouselTrack.innerHTML = '';
    carouselDotsContainer.innerHTML = '';
    slides = [];
    dots = [];

    if (bannersData && bannersData.length > 0) {
        bannersData.forEach((banner, index) => {
            const slideElement = createSlideElement(banner);
            carouselTrack.appendChild(slideElement);
            slides.push(slideElement); // Guardar referencia al elemento creado

            const dotElement = createDotElement(index);
            dotElement.addEventListener('click', () => showSlide(index));
            carouselDotsContainer.appendChild(dotElement);
            dots.push(dotElement); // Guardar referencia al elemento creado
        });

        // Configurar botones de navegación
        carouselPrevBtn.addEventListener('click', showPrev);
        carouselNextBtn.addEventListener('click', showNext);

        // Asegurarse de que el primer slide y dot estén activos al inicio
        updateCarousel();
        startAutoSlide();
    } else {
        console.warn('No se encontraron datos de banners para el carrusel. Carrusel deshabilitado.');
        // Ocultar el carrusel si no hay banners
        const heroSection = document.getElementById('hero');
        if (heroSection) heroSection.style.display = 'none';
    }
}

/**
 * Crea un elemento de slide para el carrusel.
 * @param {object} banner - Objeto con datos del banner.
 * @returns {HTMLElement}
 */
function createSlideElement(banner) {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    slide.style.backgroundImage = `url(${banner.imageUrl})`; // Carga la imagen como fondo CSS
    
    // Contenido del slide (título, descripción, botón)
    const caption = document.createElement('div');
    caption.classList.add('carousel-caption');

    const title = document.createElement('h2');
    title.textContent = banner.title;

    const description = document.createElement('p');
    description.textContent = banner.description;

    const button = document.createElement('a');
    button.href = banner.link;
    button.classList.add('btn', 'btn-primary'); // Clases para el botón
    button.textContent = banner.buttonText || 'Ver Más';

    caption.appendChild(title);
    caption.appendChild(description);
    caption.appendChild(button);
    slide.appendChild(caption);

    return slide;
}

/**
 * Crea un elemento de punto de navegación para el carrusel.
 * @param {number} index
 * @returns {HTMLElement}
 */
function createDotElement(index) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.dataset.slideIndex = index;
    return dot;
}

/**
 * Muestra un slide específico por índice.
 * @param {number} index
 */
function showSlide(index) {
    if (slides.length === 0) return;

    // Detener el auto-slide al interactuar manualmente
    stopAutoSlide();

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Calcula el desplazamiento basado en el porcentaje (100% por slide)
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;

    updateCarousel();

    // Reiniciar el auto-slide después de un breve retraso
    startAutoSlide();
}

/**
 * Actualiza las clases 'active' para slides y puntos de navegación.
 */
function updateCarousel() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
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

/**
 * Muestra el siguiente slide.
 */
function showNext() {
    showSlide(currentSlide + 1);
}

/**
 * Muestra el slide anterior.
 */
function showPrev() {
    showSlide(currentSlide - 1);
}

/**
 * Inicia el auto-slide del carrusel.
 */
function startAutoSlide() {
    stopAutoSlide(); // Asegurarse de que no haya múltiples intervalos
    autoSlideInterval = setInterval(showNext, slideDuration);
}

/**
 * Detiene el auto-slide del carrusel.
 */
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}
