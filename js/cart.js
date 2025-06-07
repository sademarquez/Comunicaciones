// js/cart.js

import { appState } from './main.js'; // Importar el estado global (que contiene products)

const CART_STORAGE_KEY = 'comunicacionesluna_cart'; // Clave específica para tu empresa
let cartSidebar;
let cartItemsContainer;
let cartTotalPriceElement;
let cartCountElement;
let checkoutBtn;
let closeCartBtn;
let welcomeCartItemCount; // Elemento para el contador en el mensaje de bienvenida


/**
 * Inicializa el módulo del carrito.
 */
export function initCart() {
    cartSidebar = document.getElementById('cartSidebar');
    cartItemsContainer = document.getElementById('cartItems');
    cartTotalPriceElement = document.getElementById('cartTotalPrice');
    cartCountElement = document.getElementById('cartCount');
    checkoutBtn = document.getElementById('checkoutBtn');
    closeCartBtn = document.getElementById('closeCartBtn');
    welcomeCartItemCount = document.getElementById('welcomeCartItemCount'); // Obtener referencia aquí

    // Cargar el carrito desde localStorage
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
        appState.cart = JSON.parse(storedCart);
    } else {
        appState.cart = [];
    }

    // Configurar event listeners para el icono del carrito y el botón de cerrar
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCartSidebar(true); // Fuerza la apertura
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            toggleCartSidebar(false); // Fuerza el cierre
        });
    }

    // Configurar botón de checkout de WhatsApp
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Renderizar el carrito inicialmente
    renderCartItems();
    updateCartCount();

    console.log('Módulo de carrito inicializado. Carrito:', appState.cart);
}

/**
 * Agrega un producto al carrito.
 * @param {string} productId - ID del producto a agregar.
 */
export function addToCart(productId) {
    // Asegurarse de que appState.products esté cargado
    if (appState.products.length === 0) {
        console.error('Los productos no están cargados en appState. No se puede agregar al carrito.');
        showToastNotification('Error: Los productos no se han cargado correctamente.');
        return;
    }

    const product = appState.products.find(p => p.id === productId);

    if (!product) {
        console.error('Producto no encontrado para agregar al carrito:', productId);
        showToastNotification('Error: Producto no encontrado.');
        return;
    }

    // No permitir agregar servicios o créditos al carrito de compra
    if (product.category === 'Servicio Técnico' || product.category === 'Créditos') {
        showToastNotification(`Por favor, utiliza el botón "Consultar" o "Agendar Cita" para ${product.category}.`);
        return;
    }

    const existingItem = appState.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.offerPrice || product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    }

    saveCart();
    renderCartItems();
    updateCartCount();
    toggleCartSidebar(true); // Abrir sidebar automáticamente al añadir
    showToastNotification(`${product.name} agregado al carrito!`);
}

/**
 * Remueve un producto del carrito.
 * @param {string} productId - ID del producto a remover.
 */
function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
    showToastNotification('Producto eliminado del carrito.');
}

/**
 * Actualiza la cantidad de un ítem en el carrito.
 * @param {string} productId - ID del producto.
 * @param {number} newQuantity - Nueva cantidad.
 */
function updateCartItemQuantity(productId, newQuantity) {
    const item = appState.cart.find(i => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartItems();
            updateCartCount();
        }
    }
}

/**
 * Guarda el carrito en localStorage.
 */
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(appState.cart));
}

/**
 * Renderiza los ítems del carrito en el sidebar.
 */
function renderCartItems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (appState.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (checkoutBtn) checkoutBtn.disabled = false;
        appState.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">${formatCurrency(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="cart-remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(itemElement);
            totalPrice += item.price * item.quantity;
        });
    }

    if (cartTotalPriceElement) {
        cartTotalPriceElement.textContent = formatCurrency(totalPrice);
    }

    // Añadir event listeners a los botones de cantidad y remover
    cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            const item = appState.cart.find(i => i.id === id);
            if (item) {
                let newQuantity = item.quantity;
                if (action === 'increase') {
                    newQuantity++;
                } else if (action === 'decrease') {
                    newQuantity--;
                }
                updateCartItemQuantity(id, newQuantity);
            }
        });
    });

    cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id; // Usar currentTarget porque el icono está dentro del botón
            removeFromCart(id);
        });
    });
}

/**
 * Actualiza el contador de ítems en el icono del carrito y el mensaje de bienvenida.
 */
export function updateCartCount() {
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems.toString();
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none'; // Mostrar/ocultar el badge
    }
    if (welcomeCartItemCount) {
        welcomeCartItemCount.textContent = totalItems.toString();
    }
}

/**
 * Retorna el número total de ítems en el carrito.
 * @returns {number}
 */
export function getCartTotalItems() {
    return appState.cart.reduce((sum, item) => sum + item.quantity, 0);
}


/**
 * Alterna la visibilidad del sidebar del carrito.
 * @param {boolean} [forceOpen] - Si es true, fuerza la apertura; si es false, fuerza el cierre.
 */
function toggleCartSidebar(forceOpen = undefined) {
    if (cartSidebar) {
        if (forceOpen === true) {
            cartSidebar.classList.add('open');
        } else if (forceOpen === false) {
            cartSidebar.classList.remove('open');
        } else {
            cartSidebar.classList.toggle('open');
        }
    }
}

/**
 * Maneja el proceso de checkout via WhatsApp.
 */
function handleCheckout() {
    if (appState.cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de comprar.');
        return;
    }

    let message = "Hola, me gustaría comprar los siguientes productos de COMUNICACIONES LUNA:\n\n";
    let totalPrice = 0;

    appState.cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} (${formatCurrency(item.price * item.quantity)})\n`;
        totalPrice += item.price * item.quantity;
    });

    message += `\nTotal: ${formatCurrency(totalPrice)}\n\n`;
    message += "Por favor, confírmenme la disponibilidad y los pasos para la compra.";

    // Número de WhatsApp de la empresa (asegúrate que esté en config.json o cámbialo aquí)
    const whatsappNumber = appState.contactPhone || '+573201234567'; // Fallback por si no carga de config
    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    // Opcional: Vaciar el carrito después de enviar a WhatsApp
    // appState.cart = [];
    // saveCart();
    // renderCartItems();
    // updateCartCount();
    // showToastNotification('Pedido enviado a WhatsApp! Te contactaremos pronto.');
    // toggleCartSidebar(false); // Cerrar carrito
}

/**
 * Formatea un número como moneda colombiana.
 * Mover esta función al archivo utils.js o similar si se usa en más lugares
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value);
}

/**
 * Muestra una notificación toast (simulada por ahora).
 * @param {string} message
 */
function showToastNotification(message) {
    console.log('Notificación Toast:', message);
    // TODO: Implementar una notificación toast visualmente atractiva en el futuro
}
