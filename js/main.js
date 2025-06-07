// js/main.js

import { initCarousel } from './carousel.js';
import { loadProducts, renderProducts, setupProductFilters, renderBrands, renderServicesAndCredits } from './products.js';
import { setupSearch } from './search.js';
import { initCart, updateCartCount, getCartTotalItems } from './cart.js'; // Importar getCartTotalItems

// Objeto de estado global
export const appState = {
    products: [],
    cart: [],
    banners: [],
    brands: [] // Para las marcas, si se cargan desde config.json
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado. Inicializando la aplicación...');

    // 1. Inicializar el carrito (carga desde localStorage)
    initCart();
    updateCartCount(); // Actualiza el contador del carrito en el header

    // Actualizar el contador en el mensaje de bienvenida
    const welcomeCartItemCount = document.getElementById('welcomeCartItemCount');
    if (welcomeCartItemCount) {
        welcomeCartItemCount.textContent = getCartTotalItems();
    }


    // 2. Cargar datos (productos, banners, etc.)
    await loadInitialData(); // Esta función ahora cargará todo

    // 3. Inicializar funcionalidades principales
    initCarousel(appState.banners); // Pasar los banners cargados
    
    // Renderizar categorías de productos (celulares y accesorios)
    renderProducts(appState.products.filter(p => p.category === 'Celular'), '#celularesGrid');
    renderProducts(appState.products.filter(p => p.category === 'Accesorio'), '#accesoriosGrid');

    // Renderizar servicios y créditos en sus secciones específicas
    renderServicesAndCredits(appState.products.filter(p => p.category === 'Servicio Técnico'), '#serviceTechGrid');
    renderServicesAndCredits(appState.products.filter(p => p.category === 'Créditos'), '#creditosGrid');


    // 4. Configurar filtros y búsqueda
    setupProductFilters(appState.products); // Filtros para productos (celulares y accesorios)
    setupSearch();

    // 5. Configurar el menú móvil
    setupMobileMenu();

    // 6. Configurar la carga de marcas en la sección "Explora por Marca"
    renderBrands(appState.products);

    // 7. Configurar formulario de cita de servicio técnico
    setupAppointmentForm();

    // 8. Configurar navegación rápida por categorías
    setupCategoryQuickAccess();

    console.log('Aplicación inicializada completamente.');
});

/**
 * Carga todos los datos iniciales de la aplicación.
 */
async function loadInitialData() {
    try {
        // Cargar productos
        const productsResponse = await fetch('products.json');
        if (!productsResponse.ok) throw new Error('Error al cargar productos');
        appState.products = await productsResponse.json();
        console.log('Productos cargados:', appState.products.length);

        // Cargar configuración (banners, marcas, etc.)
        const configResponse = await fetch('config.json');
        if (!configResponse.ok) throw new Error('Error al cargar configuración');
        const config = await configResponse.json();
        appState.banners = config.banners || [];
        appState.brands = config.brands || []; // Cargar marcas desde config.json
        console.log('Banners cargados:', appState.banners.length);
        console.log('Marcas cargadas desde config:', appState.brands.length);

    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        // Implementar un fallback o mostrar un mensaje al usuario
        alert('Hubo un error al cargar los datos de la tienda. Intenta de nuevo más tarde.');
    }
}

/**
 * Configura el menú móvil (hamburguesa).
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times'); // Cambia el icono a una 'X'
        });

        // Cerrar menú si se hace clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) { // Solo si el menú está abierto
                    mainNav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }
}

/**
 * Configura el formulario de agendar cita de servicio técnico.
 */
function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    const appServiceTypeSelect = document.getElementById('appServiceType');

    // Llenar las opciones del select de tipo de servicio dinámicamente
    const serviceProducts = appState.products.filter(p => p.category === 'Servicio Técnico');
    appServiceTypeSelect.innerHTML = '<option value="">Selecciona un servicio</option>'; // Limpiar y añadir default
    serviceProducts.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name;
        appServiceTypeSelect.appendChild(option);
    });

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('appName').value;
            const phone = document.getElementById('appPhone').value;
            const serviceType = document.getElementById('appServiceType').value;
            const description = document.getElementById('appDescription').value;

            if (name && phone && serviceType && description) {
                const whatsappMessage = encodeURIComponent(`Hola, soy ${name}. Me gustaría agendar una cita para el servicio de "${serviceType}". Mi teléfono es ${phone}. Descripción del problema: ${description}.`);
                // Asegúrate de que este número de WhatsApp sea el correcto de Comunicaciones Luna
                window.open(`https://wa.me/${appState.contactPhone || '+573201234567'}?text=${whatsappMessage}`, '_blank');
                alert('¡Cita solicitada! Te redirigiremos a WhatsApp para confirmar los detalles.');
                appointmentForm.reset();
            } else {
                alert('Por favor, completa todos los campos del formulario de cita.');
            }
        });
    }
}

/**
 * Configura la navegación rápida por categorías en la sección de "Explora Nuestras Categorías".
 */
function setupCategoryQuickAccess() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir el salto inmediato
            const targetSectionId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetSectionId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
