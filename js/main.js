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
    // Here you would implement actual cart logic (e.g., saving to localStorage or sessionStorage)
}

// Загружаем продукты при запуске
loadProducts();



