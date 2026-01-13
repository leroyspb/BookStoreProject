// Импорт стилей
import '../../src/styles/main.css';

// Импорт компонентов
import Header from '../components/Header/Header.js';
import Slider from '../components/Slider/Slider.js';
import { BooksApi } from './api/booksApi.js';
import { CartStorage } from './utils/cartStorage.js';
import { createStarRating, formatPrice } from './utils/helpers.js';

class BookshopApp {
    constructor() {
        this.api = new BooksApi();
        this.cartStorage = new CartStorage();
        this.components = {};
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Bookshop App...');
        
        try {
            // Инициализация компонентов
            this.components.header = new Header();
            this.components.header.init();
            
            this.components.slider = new Slider();
            this.components.slider.init();
            
            // Инициализация категорий
            this.setupCategoryHandlers();
            
            // Загрузка начальных книг
            await this.loadBooks();
            
            // Инициализация кнопки "Load More"
            this.setupLoadMoreButton();
            
            // Обновляем счетчик корзины
            this.updateCartCounter();
            
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }
    
    setupCategoryHandlers() {
        const categoryLinks = document.querySelectorAll('.category-link');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const category = link.dataset.category;
                if (category === this.api.getCurrentCategory()) return;
                
                // Обновляем активную категорию
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Сбрасываем состояние
                this.api.resetPagination();
                this.api.setCurrentCategory(category);
                
                // Очищаем контейнер книг
                const booksContainer = document.getElementById('books-container');
                booksContainer.innerHTML = '';
                
                // Загружаем книги
                await this.loadBooks();
            });
        });
    }
    
    async loadBooks() {
        const booksContainer = document.getElementById('books-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
            loadMoreBtn.querySelector('.btn-text').textContent = 'Загрузка...';
        }
        
        const books = await this.api.fetchBooks(this.api.getCurrentCategory(), this.api.getCurrentPage());
        
        if (books.length > 0) {
            this.renderBooks(books);
            this.api.incrementPage();
            
            if (books.length < 6) {
                this.api.setHasMoreBooks(false);
            } else {
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'block';
                    loadMoreBtn.querySelector('.btn-text').textContent = 'Load More';
                }
            }
        }
        
        if (loadMoreBtn) {
            loadMoreBtn.querySelector('.btn-text').textContent = 'Load More';
        }
    }
    
    renderBooks(books) {
        const booksContainer = document.getElementById('books-container');
        
        books.forEach(bookData => {
            const bookElement = this.createBookElement(bookData);
            booksContainer.appendChild(bookElement);
        });
    }
    
    createBookElement(bookData) {
        const book = bookData.volumeInfo;
        const saleInfo = bookData.saleInfo;
        
        const thumbnail = book.imageLinks?.thumbnail || 'https://via.placeholder.com/212x300/EFEEF6/5C6A79?text=BOOK+COVER';
        const title = book.title || 'Без названия';
        const shortTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
        const authors = book.authors?.join(', ') || 'Автор неизвестен';
        const description = book.description || 'Описание недоступно.';
        const shortDescription = description.length > 80 ? description.substring(0, 78) + '...' : description;
        const rating = book.averageRating || Math.random() * 2 + 3;
        const reviewCount = book.ratingsCount || Math.floor(Math.random() * 1000);
        
        let priceHtml = '';
        let price = 0;
        
        if (saleInfo?.saleability === "FOR_SALE" && saleInfo.retailPrice) {
            price = saleInfo.retailPrice.amount || 0;
            const currency = saleInfo.retailPrice.currencyCode || "USD";
            const priceDisplay = formatPrice(price, currency);
            priceHtml = `<div class="book_cost">${priceDisplay}</div>`;
        } else if (saleInfo?.saleability === "FREE") {
            price = 0;
            priceHtml = `<div class="book_cost">БЕСПЛАТНО</div>`;
        }
        
        const isInCart = this.cartStorage.isInCart(bookData.id);
        const buttonText = isInCart ? "IN THE CART" : "BUY NOW";
        const buttonClass = isInCart ? "in-cart-btn" : "buy-btn";
        
        const bookElement = document.createElement('div');
        bookElement.className = 'book-card';
        bookElement.innerHTML = `
            <div class="bookshop_market__cards">
                <div class="card">
                    <div class="picture">
                        <img src="${thumbnail}" alt="${title}" class="book-image" loading="lazy">
                    </div>
                    <div class="card--info">
                        <p class="book_author">${authors}</p>
                        <p class="book_name">${shortTitle}</p>
                        <div class="book_rating">
                            ${createStarRating(rating)}
                            <span class="review">(${reviewCount} отзывов)</span>
                        </div>
                        <div class="book_description">${shortDescription}</div>
                        ${priceHtml}
                        <button class="${buttonClass}" 
                                data-book-id="${bookData.id}" 
                                data-book-title="${title}" 
                                data-book-price="${price}">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем обработчик клика на кнопку
        const button = bookElement.querySelector('button');
        button.addEventListener('click', (e) => this.handleCartButtonClick(e));
        
        return bookElement;
    }
    
    handleCartButtonClick(event) {
        const button = event.target;
        const bookId = button.getAttribute('data-book-id');
        const bookTitle = button.getAttribute('data-book-title');
        const bookPrice = parseFloat(button.getAttribute('data-book-price'));
        
        const book = {
            id: bookId,
            title: bookTitle,
            price: bookPrice
        };
        
        if (this.cartStorage.isInCart(bookId)) {
            this.cartStorage.removeFromCart(bookId);
            button.textContent = "BUY NOW";
            button.classList.remove("in-cart-btn");
            button.classList.add("buy-btn");
        } else {
            this.cartStorage.addToCart(book);
            button.textContent = "IN THE CART";
            button.classList.remove("buy-btn");
            button.classList.add("in-cart-btn");
        }
        
        this.updateCartCounter();
    }
    
    setupLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', async () => {
            await this.loadBooks();
        });
    }
    
    updateCartCounter() {
        if (this.components.header) {
            this.components.header.updateCart(this.cartStorage.getCart());
        }
    }
}

// Запускаем приложение когда DOM готов
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookshopApp();
});