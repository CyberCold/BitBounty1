// Debounce function to limit the number of calls to the search filter
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Функция для загрузки продуктов
async function loadProducts() {
    try {
        console.log("Загрузка данных...");
        const response = await fetch('/data/products.json'); // Получаем данные
        if (!response.ok) {
            console.error('Ошибка загрузки данных:', response.status);
            return;
        }
        const products = await response.json(); // Загружаем продукты
        console.log('Загруженные продукты:', products); // Выводим их в консоль

        // Передаем данные в функцию отображения
        displaySearchResults(products);

        // Добавляем обработчик для поля поиска с дебаунсом
        const searchInput = document.getElementById('searchInput'); // Получаем поле поиска
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function () {
                const query = searchInput.value.toLowerCase();
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    product.aliases.some(alias => alias.toLowerCase().includes(query))
                );
                displaySearchResults(filteredProducts); // Показываем отфильтрованные продукты
            }, 300)); // 300ms задержка
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}


// Function to handle adding to the cart (simplified)
function addToCart(product, quantity) {
    console.log(`Добавлено в корзину: ${product.name} x ${quantity}`);
    // You can store the cart in localStorage for persistence across pages
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += quantity; // Update quantity if already in cart
    } else {
        cart.push({ ...product, quantity }); // Add new product to cart
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage
}

// Загружаем продукты при запуске
loadProducts();
// Find the Add to Cart button
const addToCartBtn = productElement.querySelector('.add-to-cart');

// Add event listener to the Add to Cart button
addToCartBtn.addEventListener('click', function() {
    const productId = product.id;
    const productName = product.name;
    const productPrice = product.price;
    const quantity = parseInt(quantitySpan.textContent);

    // Add product to the cart (localStorage or other storage)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity; // Increase quantity if already in cart
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage
    alert(`${productName} добавлен в корзину!`); // Optional alert
});
