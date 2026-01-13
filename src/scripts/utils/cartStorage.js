const CART_STORAGE_KEY = 'bookshop_cart';

export class CartStorage {
    constructor() {
        this.cart = this.loadCart();
    }
    
    loadCart() {
        try {
            const cartData = localStorage.getItem(CART_STORAGE_KEY);
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    addToCart(book) {
        const existingIndex = this.cart.findIndex(item => item.id === book.id);
        
        if (existingIndex === -1) {
            this.cart.push(book);
            this.saveCart();
            return true;
        }
        return false;
    }
    
    removeFromCart(bookId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== bookId);
        this.saveCart();
        return this.cart.length !== initialLength;
    }
    
    isInCart(bookId) {
        return this.cart.some(item => item.id === bookId);
    }
    
    getCartCount() {
        return this.cart.length;
    }
    
    getCart() {
        return [...this.cart];
    }
}