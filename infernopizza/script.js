document.addEventListener('DOMContentLoaded', () => {
    // Главная страница (слайдер)
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        }
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
        showSlide(currentSlide);
    }

    // Кнопка "Заказать сейчас"
    const orderNowBtn = document.querySelector('.order-now');
    if (orderNowBtn) orderNowBtn.addEventListener('click', () => window.location.href = 'menu.html');

    // О нас (анимация временной шкалы)
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        function checkTimeline() {
            const triggerBottom = window.innerHeight * 0.8;
            timelineItems.forEach(item => {
                if (item.getBoundingClientRect().top < triggerBottom) item.classList.add('visible');
            });
        }
        window.addEventListener('scroll', checkTimeline);
        checkTimeline();
    }

    // Отзывы (слайдер)
    const reviews = document.querySelectorAll('.review');
    let currentReview = 0;
    if (reviews.length > 0) {
        function showReview(index) {
            reviews.forEach((review, i) => review.classList.toggle('active', i === index));
        }
        setInterval(() => {
            currentReview = (currentReview + 1) % reviews.length;
            showReview(currentReview);
        }, 4000);
        showReview(currentReview);
    }

    // Меню (корзина и конструктор)
    const cartItems = [];
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const buttons = document.querySelectorAll('.add-to-cart');
    const orderBtn = document.getElementById('order-btn');
    const modal = document.getElementById('order-modal');
    const orderForm = document.getElementById('order-form');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('success-message');
    const cart = document.querySelector('.cart');
    const customPizzaBtn = document.getElementById('custom-pizza-btn');
    const customPizzaModal = document.getElementById('custom-pizza-modal');
    const customPizzaForm = document.getElementById('custom-pizza-form');
    const customPizzaPrice = document.getElementById('custom-pizza-price');

    // Добавление стандартных пицц
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const pizzaName = button.getAttribute('data-name');
            const pizzaPrice = parseInt(button.getAttribute('data-price'));
            cartItems.push({ name: pizzaName, price: pizzaPrice });

            const pizzaCard = button.closest('.pizza-card');
            const pizzaImg = pizzaCard.querySelector('img');
            const flyingPizza = document.createElement('div');
            flyingPizza.classList.add('flying-pizza');
            flyingPizza.style.backgroundImage = `url(${pizzaImg.src})`;
            const buttonRect = button.getBoundingClientRect();
            flyingPizza.style.left = `${buttonRect.left + window.scrollX}px`;
            flyingPizza.style.top = `${buttonRect.top + window.scrollY}px`;
            document.body.appendChild(flyingPizza);

            const cartRect = cart.getBoundingClientRect();
            const deltaX = (cartRect.left + cartRect.width / 2) - (buttonRect.left + buttonRect.width / 2);
            const deltaY = (cartRect.top + cartRect.height / 2) - (buttonRect.top + buttonRect.height / 2);
            flyingPizza.style.animation = `flyToCart 0.8s ease-in-out forwards`;
            flyingPizza.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;

            flyingPizza.addEventListener('animationend', () => {
                flyingPizza.remove();
                updateCart();
            });
        });
    });

    // Обновление корзины
    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price} тг.`;
            cartList.appendChild(li);
            total += item.price;
        });
        cartTotal.textContent = total;
    }

    // Открытие заказа
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('Корзина пуста! Добавьте пиццу перед заказом.');
                return;
            }
            modal.style.display = 'flex';
        });
    }

    // Обработка заказа
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            orderForm.style.display = 'none';
            loading.classList.remove('hidden');
            setTimeout(() => {
                loading.classList.add('hidden');
                successMessage.classList.remove('hidden');
                setTimeout(() => {
                    modal.style.display = 'none';
                    cartItems.length = 0;
                    updateCart();
                    orderForm.style.display = 'block';
                    successMessage.classList.add('hidden');
                }, 2000);
            }, 1500);
        });
    }

    // Конструктор пиццы
    if (customPizzaBtn) {
        customPizzaBtn.addEventListener('click', () => {
            customPizzaModal.style.display = 'flex';
        });

        const ingredients = customPizzaForm.querySelectorAll('input[name="ingredient"]');
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('change', () => {
                let totalPrice = 2000; // Базовая цена
                ingredients.forEach(ing => {
                    if (ing.checked) totalPrice += parseInt(ing.getAttribute('data-price'));
                });
                customPizzaPrice.textContent = totalPrice;
            });
        });

        customPizzaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pizzaName = document.getElementById('pizza-name').value || 'Безымянная пицца';
            let totalPrice = 2000;
            const selectedIngredients = [];
            ingredients.forEach(ing => {
                if (ing.checked) {
                    totalPrice += parseInt(ing.getAttribute('data-price'));
                    selectedIngredients.push(ing.value);
                }
            });
            cartItems.push({ name: pizzaName, price: totalPrice });

            // Анимация полета для кастомной пиццы (без изображения)
            const flyingPizza = document.createElement('div');
            flyingPizza.classList.add('flying-pizza');
            flyingPizza.style.backgroundColor = '#ff5722'; // Заглушка вместо изображения
            const btnRect = customPizzaForm.querySelector('button').getBoundingClientRect();
            flyingPizza.style.left = `${btnRect.left + window.scrollX}px`;
            flyingPizza.style.top = `${btnRect.top + window.scrollY}px`;
            document.body.appendChild(flyingPizza);

            const cartRect = cart.getBoundingClientRect();
            const deltaX = (cartRect.left + cartRect.width / 2) - (btnRect.left + btnRect.width / 2);
            const deltaY = (cartRect.top + cartRect.height / 2) - (btnRect.top + btnRect.height / 2);
            flyingPizza.style.animation = `flyToCart 0.8s ease-in-out forwards`;
            flyingPizza.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;

            flyingPizza.addEventListener('animationend', () => {
                flyingPizza.remove();
                updateCart();
                customPizzaModal.style.display = 'none';
                customPizzaForm.reset();
                customPizzaPrice.textContent = '2000';
            });
        });
    }
});