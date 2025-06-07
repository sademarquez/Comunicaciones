// js/products.js

import { appState } from './main.js';
import { addToCart } from './cart.js'; // Importar addToCart

/**
 * Formatea un número como moneda colombiana.
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
    if (typeof value !== 'number') return value; // Si ya es un string (e.g., "Desde X"), devolverlo tal cual
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0 // Sin decimales para pesos colombianos
    }).format(value);
}

/**
 * Crea una tarjeta de producto para celulares y accesorios.
 * @param {object} product - Objeto del producto.
 * @returns {HTMLElement} - Elemento de tarjeta de producto.
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const priceHtml = product.isOnOffer && product.offerPrice
        ? `<span class="old-price">${formatCurrency(product.price)}</span> <span class="current-price">${formatCurrency(product.offerPrice)}</span>`
        : `<span class="current-price">${formatCurrency(product.price)}</span>`;

    card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" class="product-image">
        <h4 class="product-name">${product.name}</h4>
        <p class="product-description">${product.description}</p>
        <div class="product-price">${priceHtml}</div>
        <div class="product-actions">
            <button class="btn btn-secondary add-to-cart-btn" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Agregar al Carrito
            </button>
            <a href="${product.whatsapp_link}" target="_blank" class="btn btn-whatsapp">
                <i class="fab fa-whatsapp"></i> Preguntar
            </a>
        </div>
    `;

    // Añadir evento al botón "Agregar al Carrito"
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product.id));

    return card;
}

/**
 * Crea una tarjeta de información para servicios técnicos o créditos.
 * @param {object} item - Objeto del servicio o crédito.
 * @returns {HTMLElement} - Elemento de tarjeta de información.
 */
function createInfoCard(item) {
    const card = document.createElement('div');
    card.classList.add('info-card'); // Nueva clase para estos tipos de tarjeta

    let whatsappButton = '';
    if (item.whatsapp_link) {
        whatsappButton = `<a href="${item.whatsapp_link}" target="_blank" class="btn btn-whatsapp btn-small">
            <i class="fab fa-whatsapp"></i> Consultar
        </a>`;
    } else if (item.isBookable) {
        // Si es un servicio técnico y se puede agendar, no necesita botón de WhatsApp aquí
        // La cita se gestiona con el formulario de la sección.
        // Podríamos poner un enlace a la sección de cita.
        whatsappButton = `<a href="#service-tech-section" class="btn btn-primary btn-small">
            <i class="fas fa-calendar-alt"></i> Agendar Cita
        </a>`;
    }

    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" class="info-image">
        <h4 class="info-name">${item.name}</h4>
        <p class="info-description">${item.description}</p>
        <div class="info-price">${item.price}</div>
        <div class="info-actions">
            ${whatsappButton}
        </div>
    `;
    return card;
}


/**
 * Renderiza los productos en un contenedor HTML.
 * @param {Array} productsToRender - La lista de productos a mostrar.
 * @param {string} containerSelector - Selector CSS del contenedor donde se renderizarán.
 */
export function renderProducts(productsToRender, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Contenedor no encontrado para renderizar productos: ${containerSelector}`);
        return;
    }

    container.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    if (productsToRender.length === 0) {
        container.innerHTML = '<p class="no-results">No hay productos disponibles en esta categoría.</p>';
        return;
    }

    productsToRender.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

/**
 * Renderiza los servicios técnicos y opciones de crédito.
 * @param {Array} itemsToRender - La lista de servicios o créditos a mostrar.
 * @param {string} containerSelector - Selector CSS del contenedor.
 */
export function renderServicesAndCredits(itemsToRender, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Contenedor no encontrado para renderizar servicios/créditos: ${containerSelector}`);
        return;
    }

    container.innerHTML = ''; // Limpiar el contenedor

    if (itemsToRender.length === 0) {
        container.innerHTML = '<p class="no-results">No hay opciones disponibles en esta sección.</p>';
        return;
    }

    itemsToRender.forEach(item => {
        container.appendChild(createInfoCard(item));
    });
}


/**
 * Configura los filtros de productos (marca y precio) y la búsqueda.
 * @param {Array} allProducts - Todos los productos cargados inicialmente.
 */
export function setupProductFilters(allProducts) {
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput'); // Asumiendo que searchInput está en main.js

    if (!brandFilter || !priceFilter) {
        console.warn('Elementos de filtro no encontrados. Los filtros de producto no funcionarán.');
        return;
    }

    // Llenar filtro de marcas dinámicamente
    const uniqueBrands = [...new Set(allProducts.filter(p => p.category === 'Celular' || p.category === 'Accesorio').map(p => p.brand))];
    brandFilter.innerHTML = '<option value="">Todas las Marcas</option>';
    uniqueBrands.sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });

    const applyFilters = () => {
        let filtered = allProducts.filter(p => p.category === 'Celular' || p.category === 'Accesorio'); // Solo celulares y accesorios para estos filtros

        // Filtrar por marca
        const selectedBrand = brandFilter.value;
        if (selectedBrand) {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }

        // Ordenar por precio
        const priceOrder = priceFilter.value;
        if (priceOrder === 'asc') {
            filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (priceOrder === 'desc') {
            filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        }

        // Renderizar solo los productos de la categoría de celulares si es el filtro principal
        renderProducts(filtered.filter(p => p.category === 'Celular'), '#celularesGrid');
        renderProducts(filtered.filter(p => p.category === 'Accesorio'), '#accesoriosGrid');
    };

    brandFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    // Nota: La lógica de búsqueda en tiempo real o por botón está en search.js
    // Si la búsqueda debe interactuar con estos filtros, se haría aquí.

    // Inicializar filtros al cargar la página si hay parámetros en la URL o un estado guardado
    // applyFilters(); // Se llamará cuando se carguen los productos inicialmente en main.js
}


/**
 * Carga y renderiza las marcas dinámicamente en la sección "Explora por Marca".
 * @param {Array} products - Todos los productos cargados.
 */
export function renderBrands(products) {
    const brandsListContainer = document.getElementById('brandsList');
    if (!brandsListContainer) {
        console.warn('Contenedor de marcas no encontrado.');
        return;
    }

    brandsListContainer.innerHTML = ''; // Limpiar marcas estáticas

    // Usar las marcas definidas en config.json (appState.brands)
    if (appState.brands && appState.brands.length > 0) {
        appState.brands.forEach(brand => {
            const brandItem = document.createElement('a');
            brandItem.href = `#celulares-section?brand=${encodeURIComponent(brand.name)}`;
            brandItem.classList.add('brand-item');
            brandItem.innerHTML = `
                <img src="${brand.logoUrl}" alt="Logo ${brand.name}" loading="lazy">
                <span>${brand.name}</span>
            `;
            // Opcional: añadir un evento para filtrar al hacer clic en la marca
            brandItem.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('brandFilter').value = brand.name;
                document.getElementById('brandFilter').dispatchEvent(new Event('change'));
                document.getElementById('celulares-section').scrollIntoView({ behavior: 'smooth' });
            });
            brandsListContainer.appendChild(brandItem);
        });
    } else {
        // Fallback si no hay marcas en config, se pueden extraer de productos
        const uniqueBrandsFromProducts = new Map();
        products.filter(p => p.category === 'Celular' || p.category === 'Accesorio').forEach(product => {
            if (!uniqueBrandsFromProducts.has(product.brand)) {
                // Asumiendo un patrón de logo para marcas no definidas en config
                uniqueBrandsFromProducts.set(product.brand, `images/icons/${product.brand.toLowerCase().replace(/\s/g, '-')}-logo.svg`);
            }
        });

        uniqueBrandsFromProducts.forEach((logoUrl, brandName) => {
            const brandItem = document.createElement('a');
            brandItem.href = `#celulares-section?brand=${encodeURIComponent(brandName)}`;
            brandItem.classList.add('brand-item');
            brandItem.innerHTML = `
                <img src="${logoUrl}" alt="Logo ${brandName}" loading="lazy">
                <span>${brandName}</span>
            `;
            brandItem.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('brandFilter').value = brandName;
                document.getElementById('brandFilter').dispatchEvent(new Event('change'));
                document.getElementById('celulares-section').scrollIntoView({ behavior: 'smooth' });
            });
            brandsListContainer.appendChild(brandItem);
        });
    }
}
