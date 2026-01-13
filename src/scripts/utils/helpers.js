export function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return `<span class="stars">${stars}</span>`;
}

export function formatPrice(price, currency) {
    if (price === 0) return "БЕСПЛАТНО";
    
    let convertedPrice = price;
    
    if (currency === "USD") {
        convertedPrice = price * 90;
    } else if (currency === "EUR") {
        convertedPrice = price * 100;
    }
    
    return `${Math.round(convertedPrice)} ₽`;
}