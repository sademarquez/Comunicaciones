// js/main.js

import { initCarousel } from './carousel.js';
import { loadProducts, renderProducts, setupProductFilters } from './products.js';
import { setupSearch } from './search.js';
import { initCart, updateCartCount } from './cart.js';

// Objeto de estado global
export const appState = {
    products: [],
    cart: [],
    banners: [],
    // Puedes añadir más estados como:
    // filters: { brand: '', priceOrder: '', search: '' },
    // isLoading: false,
    // currentPage: 'home'
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado. Inicializando la aplicación...');

    // 1. Inicializar el carrito (carga desde localStorage)
    initCart();
    updateCartCount(); // Actualiza el contador del carrito en el header

    // 2. Cargar datos (productos, banners, etc.)
    await loadInitialData();

    // 3. Inicializar funcionalidades principales
    initCarousel(appState.banners); // Pasar los banners cargados
    renderProducts(appState.products, '#newProductsGrid', { limit: 8, isNew: true }); // Mostrar novedades
    renderProducts(appState.products, '#allProductsGrid'); // Mostrar todos los celulares
    // Aquí puedes llamar a renderProducts para accesorios si tienes una categoría específica

    // 4. Configurar filtros y búsqueda
    setupProductFilters(appState.products);
    setupSearch();

    // 5. Configurar el menú móvil (si existe)
    setupMobileMenu();

    console.log('Aplicación inicializada con estado:', appState);
});

async function loadInitialData() {
    try {
        // Cargar productos
        const productsResponse = await fetch('data/products.json');
        if (!productsResponse.ok) throw new Error('Error al cargar productos');
        appState.products = await productsResponse.json();
        console.log('Productos cargados:', appState.products.length);

        // Cargar configuración (incluye banners por ahora)
        const configResponse = await fetch('data/config.json');
        if (!configResponse.ok) throw new Error('Error al cargar configuración');
        const config = await configResponse.json();
        appState.banners = config.banners || [];
        console.log('Banners cargados:', appState.banners.length);

        // Cargar marcas (si las tienes en un JSON separado o las extraes de productos)
        // Por ahora, las generaremos desde los productos en products.js
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        // Implementar un fallback o mostrar un mensaje al usuario
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times'); // Cambia el icono a una 'X'
        });

        // Cerrar menú si se hace clic fuera o en un enlace
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'LI') {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
}// js/main.js

import { initCarousel } from './carousel.js';
import { loadProducts, renderProducts, setupProductFilters } from './products.js';
import { setupSearch } from './search.js';
import { initCart, updateCartCount } from './cart.js';

// Objeto de estado global
export const appState = {
    products: [],
    cart: [],
    banners: [],
    // Puedes añadir más estados como:
    // filters: { brand: '', priceOrder: '', search: '' },
    // isLoading: false,
    // currentPage: 'home'
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado. Inicializando la aplicación...');

    // 1. Inicializar el carrito (carga desde localStorage)
    initCart();
    updateCartCount(); // Actualiza el contador del carrito en el header

    // 2. Cargar datos (productos, banners, etc.)
    await loadInitialData();

    // 3. Inicializar funcionalidades principales
    initCarousel(appState.banners); // Pasar los banners cargados
    renderProducts(appState.products, '#newProductsGrid', { limit: 8, isNew: true }); // Mostrar novedades
    renderProducts(appState.products, '#allProductsGrid'); // Mostrar todos los celulares
    // Aquí puedes llamar a renderProducts para accesorios si tienes una categoría específica

    // 4. Configurar filtros y búsqueda
    setupProductFilters(appState.products);
    setupSearch();

    // 5. Configurar el menú móvil (si existe)
    setupMobileMenu();

    console.log('Aplicación inicializada con estado:', appState);
});

async function loadInitialData() {
    try {
        // Cargar productos
        const productsResponse = await fetch('data/products.json');
        if (!productsResponse.ok) throw new Error('Error al cargar productos');
        appState.products = await productsResponse.json();
        console.log('Productos cargados:', appState.products.length);

        // Cargar configuración (incluye banners por ahora)
        const configResponse = await fetch('data/config.json');
        if (!configResponse.ok) throw new Error('Error al cargar configuración');
        const config = await configResponse.json();
        appState.banners = config.banners || [];
        console.log('Banners cargados:', appState.banners.length);

        // Cargar marcas (si las tienes en un JSON separado o las extraes de productos)
        // Por ahora, las generaremos desde los productos en products.js
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        // Implementar un fallback o mostrar un mensaje al usuario
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times'); // Cambia el icono a una 'X'
        });

        // Cerrar menú si se hace clic fuera o en un enlace
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'LI') {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
}
