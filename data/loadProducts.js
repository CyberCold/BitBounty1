function displaySearchResults(products) {
    const resultContainer = document.getElementById('searchResults');
    resultContainer.innerHTML = ''; // Очищаем контейнер

    if (products.length === 0) {
        resultContainer.innerHTML = '<p>Товары не найдены.</p>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');  // Вместо id используем класс
            productElement.innerHTML = `
                <div class="product">
                    <a href="product-details.html?id=${product.id}" class="product-link">
                        <img src="${product.img}" alt="${product.name}" class="product-img" />
                    </a>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">€${product.price}</p>
                        <div class="product-quantity">
                            <button class="decrease">-</button>
                            <span class="quantity">1</span>
                            <button class="increase">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}">Add to cart</button>
                    </div>
                </div>
            `;
            resultContainer.appendChild(productElement);

            // Найдем кнопки и quantity для данной карточки товара
            const increaseBtn = productElement.querySelector('.increase');
            const decreaseBtn = productElement.querySelector('.decrease');
            const quantitySpan = productElement.querySelector('.quantity');
            const addToCartBtn = productElement.querySelector('.add-to-cart');

            // Увеличение количества
            increaseBtn.addEventListener('click', function() {
                let currentQuantity = parseInt(quantitySpan.textContent) || 0;
                quantitySpan.textContent = currentQuantity + 1;
            });

            // Уменьшение количества
            decreaseBtn.addEventListener('click', function() {
                let currentQuantity = parseInt(quantitySpan.textContent) || 0;
                if (currentQuantity > 1) {  // Минимальное количество — 1
                    quantitySpan.textContent = currentQuantity - 1;
                }
            });

            // Добавить товар в корзину
            addToCartBtn.addEventListener('click', function() {
                const quantity = parseInt(quantitySpan.textContent);
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const productInCart = cart.find(item => item.id === product.id);

                if (productInCart) {
                    productInCart.quantity += quantity; // Увеличиваем количество, если товар уже в корзине
                } else {
                    cart.push({
                        id: product.id, // Добавляем id товара в объект
                        name: product.name,
                        price: product.price,
                        img: product.img,
                        quantity: quantity
                    });
                }

                // Сохраняем обновленную корзину в localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartIcon();
            });
        });
    }
}
