export default class Header {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('bookshop_cart')) || [];
    }
    
    render() {
        return `
            <div class="nav">
                <div class="nav__logo">
                    <img class="logo-img" src="assets/images/svg/Bookshop logo.svg" alt="logo Bookshop">
                </div>
                <div class="nav__list">
                    <li><a id="nav__list--active" href="#">books</a></li>
                    <li><a href="#">audiobooks</a></li>
                    <li><a href="#">Stationery & gifts</a></li>
                    <li><a href="#">blog</a></li>
                </div>
                <div class="nav__icons">
                    <span class="nav_icon"><img src="assets/images/svg/user.svg" alt="icon user"></span>
                    <span class="nav_icon"><img src="assets/images/svg/search.svg" alt="icon search"></span>
                    <span class="nav_icon"><img src="assets/images/svg/shop bag.svg" alt="icon bag"></span>
                </div>
            </div>
        `;
    }
    
    init() {
        const headerElement = document.getElementById('header');
        if (headerElement) {
            headerElement.innerHTML = this.render();
            this.updateCartCounter();
        }
    }
    
    updateCartCounter() {
        const bagContainer = document.querySelector('.nav_icon img[alt="icon bag"]')?.closest('.nav_icon');
        
        if (!bagContainer) return;
        
        const oldCounter = bagContainer.querySelector('.cart-counter');
        if (oldCounter) oldCounter.remove();
        
        if (this.cart.length > 0) {
            const counterSpan = document.createElement('button');
            counterSpan.className = 'cart-counter';
            counterSpan.textContent = this.cart.length;
            bagContainer.appendChild(counterSpan);
        }
    }
    
    updateCart(cart) {
        this.cart = cart;
        this.updateCartCounter();
    }
}