// js/cart.js

import { appState } from './main.js';

const CART_STORAGE_KEY = 'celularmania_cart';
let cartSidebar;
let cartItemsContainer;
let cartTotalPriceElement;
let cartCountElement;

export function initCart() {
    cartSidebar = document.getElementById('cartSidebar'); // Tendremos que añadir este div en el HTML
    cartItemsContainer = document.getElementById('cartItems'); // Tendremos que añadir este div en el HTML
    cartTotalPriceElement = document.getElementById('cartTotalPrice'); // Tendremos que añadir este span/div
    cartCountElement = document.getElementById('cartCount');

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
            toggleCartSidebar();
        });
    }

    // Renderizar el carrito inicialmente
    renderCartItems();
    updateCartCount();

    console.log('Módulo de carrito inicializado. Carrito:', appState.cart);
}

export function addToCart(productId) {
    const product = appState.products.find(p => p.id === productId);

    if (!product) {
        console.error('Producto no encontrado para agregar al carrito:', productId);
        return;
    }

    const existingItem = appState.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.isOnOffer && product.offerPrice ? product.offerPrice : product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    }

    saveCart();
    renderCartItems();
    updateCartCount();
    showToastNotification(`${product.name} añadido al carrito.`); // Opcional: notificación
    toggleCartSidebar(true); // Abrir el carrito automáticamente
    console.log('Producto añadido al carrito. Carrito actual:', appState.cart);
}

export function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
    showToastNotification('Producto eliminado del carrito.');
    console.log('Producto eliminado del carrito. Carrito actual:', appState.cart);
}

export function updateCartItemQuantity(productId, newQuantity) {
    const item = appState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
            updateCartCount();
            console.log('Cantidad de producto actualizada. Carrito actual:', appState.cart);
        }
    }
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(appState.cart));
}

function renderCartItems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (appState.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
    } else {
        appState.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toLocaleString('es-CO')}</p>
                    <div class="cart-item-quantity">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="cart-remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(itemElement);

            totalPrice += item.price * item.quantity;
        });
    }

    if (cartTotalPriceElement) {
        cartTotalPriceElement.textContent = `$${totalPrice.toLocaleString('es-CO')}`;
    }

    // Añadir event listeners a los botones de cantidad y eliminar
    cartItemsContainer.querySelectorAll('.cart-item-quantity button').forEach(button => {
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
            const id = e.target.dataset.id;
            removeFromCart(id);
        });
    });
}

export function updateCartCount() {
    if (cartCountElement) {
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems.toString();
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none'; // Mostrar/ocultar el badge
    }
}

function toggleCartSidebar(forceOpen = false) {
    if (cartSidebar) {
        if (forceOpen) {
            cartSidebar.classList.add('open');
        } else {
            cartSidebar.classList.toggle('open');
        }
    }
}

function showToastNotification(message) {
    // Implementar una notificación toast simple
    // Por ahora, solo un console.log
    console.log('Notificación:', message);
    // En fases futuras, se añadiría un div al body y se mostraría/ocultaría con CSS.
}
