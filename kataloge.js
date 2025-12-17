let cart = [];
let total = 0;

function addToCart(button) {
    // Правильное получение родительского элемента товара
    let saleItem = button.closest('.sale-item');
    let name = saleItem.querySelector('h3').innerText;

    // Очищаем текст от лишних символов
    let priceText = saleItem.querySelector('.new-price').innerText;
    let price = parseFloat(priceText.replace('руб', '').replace(',', '.').trim());

    // Проверяем, есть ли уже такой товар в корзине
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Добавляем товар в массив
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    // Обновляем корзину
    showCart();

    // Визуальная обратная связь вместо alert
    let originalText = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i> Добавлено';
    button.style.backgroundColor = '#28a745';

    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '#ff6b6b';
    }, 1500);
}

// Функция удаления из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}

// Функция изменения количества
function changeQuantity(index, delta) {
    cart[index].quantity += delta;

    // Если количество стало 0 или меньше - удаляем товар
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    showCart();
}

function showCart() {
    let cartDiv = document.getElementById('cart-items');
    let totalSpan = document.getElementById('total-price');

    cartDiv.innerHTML = '';
    total = 0;

    // Если корзина пуста
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p id="empty-cart-message">Корзина пуста</p>';
        totalSpan.textContent = '0.00';
        return;
    }

    // Добавляем товары
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-name">${item.name}</div>
                <button class="remove-item" onclick="removeFromCart(${i})">×</button>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-quantity">
                    <button onclick="changeQuantity(${i}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${i}, 1)">+</button>
                </div>
                <div class="cart-item-price">${itemTotal.toFixed(2)} руб</div>
            </div>
        `;

        cartDiv.appendChild(itemDiv);
    }
    updateTotal();
}

function updateTotal() {
    let totalSpan = document.getElementById('total-price');
    let delivery = document.getElementById('delivery');

    let finalTotal = total;

    if (delivery && delivery.value === 'courier') {
        finalTotal += 5;
    }

    totalSpan.textContent = finalTotal.toFixed(2);
}

function toggleAddress() {
    let delivery = document.getElementById('delivery');
    let addressDiv = document.getElementById('address-group');

    if (delivery.value === 'courier') {
        addressDiv.style.display = 'block';
    } else {
        addressDiv.style.display = 'none';
    }

    updateTotal();
}

// Отправка формы
function submitOrder(event) {
    event.preventDefault();

    let fullname = document.getElementById('fullname').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;

    if (cart.length === 0) {
        alert('Добавьте товары в корзину!');
        return;
    }

    // Валидация
    if (!fullname || !phone || !email) {
        alert('Заполните все обязательные поля!');
        return;
    }

    // Показываем успешное сообщение
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('order-notice').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';

    // Выводим информацию о заказе в консоль (в реальном проекте здесь был бы AJAX запрос)
    console.log('Заказ оформлен:', {
        cart: cart,
        total: total,
        customer: { fullname, phone, email }
    });

    // Очищаем через 3 секунды
    setTimeout(function() {
        document.getElementById('order-form').reset();
        document.getElementById('address-group').style.display = 'none';

        cart = [];
        showCart();

        document.getElementById('submit-btn').style.display = 'block';
        document.getElementById('order-notice').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    }, 3000);
}

window.onload = function() {
    // Инициализируем корзину
    showCart();

    // Назначаем обработчики
    let orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.onsubmit = submitOrder;
    }

    let delivery = document.getElementById('delivery');
    if (delivery) {
        delivery.onchange = toggleAddress;
    }

    // Также обновляем итог при загрузке страницы
    updateTotal();
};