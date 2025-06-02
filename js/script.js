// script.js - Lógica JavaScript unificada para la Campaña de Ximena Lopez Yule

document.addEventListener('DOMContentLoaded', function () {
    // --- Lógica para el menú móvil (menú de hamburguesa) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // Selecciona todos los enlaces de navegación, tanto desktop como móvil
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            // Actualizar atributo ARIA para accesibilidad
            const isExpanded = mobileMenu.classList.contains('block');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- Lógica para el desplazamiento suave de los enlaces de navegación ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Cierra el menú móvil después de hacer clic en un enlace (si está abierto)
                if (mobileMenu && mobileMenu.classList.contains('block')) {
                    mobileMenu.classList.remove('block');
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Lógica para cambiar el estilo del header al hacer scroll ---
    const mainHeader = document.getElementById('main-header'); // Asegura que el header tenga este ID
    if (mainHeader) { // Verifica si el elemento existe
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Si el scroll es mayor a 50px
                mainHeader.classList.add('header-scrolled');
            } else {
                mainHeader.classList.remove('header-scrolled');
            }
        });
    }


    // --- Lógica para el carrusel infinito de logos ---
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');

    if (carouselTrack && carouselItems.length > 0) {
        // Clona los elementos iniciales y añádelos al final para crear el efecto de bucle
        carouselItems.forEach(item => {
            const clonedItem = item.cloneNode(true);
            carouselTrack.appendChild(clonedItem);
        });
        // La animación CSS se encargará del desplazamiento.
        // Asegúrate de que el CSS tenga la animación `scrollLeft` definida.
    }


    // --- Lógica del Chatbot ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotMessages = document.getElementById('chatbot-messages');

    let faqData = []; // Variable para almacenar los datos del FAQ

    // Función para cargar el FAQ desde faq.json
    async function loadFAQ() {
        try {
            const response = await fetch('data/faq.json'); // Asegúrate de que la ruta sea correcta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            faqData = await response.json();
            // console.log('FAQ cargado:', faqData); // Para depuración
        } catch (error) {
            console.error('Error al cargar el FAQ:', error);
            addChatMessage('bot', 'Lo siento, no pude cargar la información de preguntas frecuentes en este momento. Por favor, intenta de nuevo más tarde.');
        }
    }

    // Función para añadir mensajes al chatbot
    function addChatMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('p-2', 'rounded-lg', 'mb-2', 'max-w-[75%]');
        if (sender === 'user') {
            messageElement.classList.add('bg-purple-gradient-start', 'text-white', 'ml-auto', 'user-message');
            messageElement.textContent = message;
        } else {
            messageElement.classList.add('bg-gray-200', 'text-gray-800', 'mr-auto', 'bot-message');
            messageElement.textContent = message;
        }
        chatbotMessages.appendChild(messageElement);
        // Desplazar hacia abajo para ver el último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Función para procesar el mensaje del usuario y dar una respuesta
    function processUserMessage(message) {
        addChatMessage('user', message);
        const lowerCaseMessage = message.toLowerCase();
        let foundAnswer = false;

        // Iterar sobre las categorías (víctimas, pdet, general)
        for (const categoryKey in faqData) {
            if (faqData.hasOwnProperty(categoryKey)) {
                const category = faqData[categoryKey];
                for (const item of category) {
                    // Buscar palabras clave en la pregunta del usuario
                    const keywordsMatch = item.keywords.some(keyword => lowerCaseMessage.includes(keyword.toLowerCase()));
                    
                    // Si se encuentra una palabra clave, responder con la respuesta correspondiente
                    if (keywordsMatch) {
                        addChatMessage('bot', item.answer);
                        foundAnswer = true;
                        break; // Salir del bucle de ítems una vez que se encuentra una respuesta
                    }
                }
            }
            if (foundAnswer) break; // Si ya se encontró una respuesta, salir del bucle de categorías
        }

        // Si no se encontró ninguna respuesta, mostrar un mensaje por defecto
        if (!foundAnswer) {
            addChatMessage('bot', 'Lo siento, no encontré una respuesta a tu pregunta. Por favor, intenta reformularla o pregunta algo más.');
            addChatMessage('bot', 'Puedes preguntar sobre "propuestas", "eventos", "contacto", "víctimas", "PDET", o temas relacionados con la campaña.');
        }
    }

    // Cargar el FAQ al iniciar la página
    loadFAQ();

    // Manejadores de eventos para el chatbot
    if (chatbotToggleButton && chatbotContainer && chatbotCloseButton && chatbotInput && chatbotSendButton && chatbotMessages) {
        chatbotToggleButton.addEventListener('click', function() {
            chatbotContainer.classList.toggle('hidden');
            chatbotContainer.classList.toggle('block');
            if (chatbotContainer.classList.contains('block')) {
                // Si se abre el chatbot, se puede enviar un mensaje de bienvenida
                if (chatbotMessages.children.length === 0) { // Solo si no hay mensajes previos
                    addChatMessage('bot', '¡Hola! Soy el asistente virtual de Ximena Lopez Yule. ¿En qué puedo ayudarte?');
                }
                chatbotInput.focus(); // Enfocar el input cuando se abre
            }
        });

        chatbotCloseButton.addEventListener('click', function() {
            chatbotContainer.classList.add('hidden');
            chatbotContainer.classList.remove('block');
        });

        chatbotSendButton.addEventListener('click', function() {
            const message = chatbotInput.value.trim();
            if (message) {
                processUserMessage(message);
                chatbotInput.value = '';
            }
        });

        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                chatbotSendButton.click();
            }
        });
    }
});