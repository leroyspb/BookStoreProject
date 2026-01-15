import { API_CONFIG } from '../../../config.js';

const API_KEY = API_CONFIG.API_KEY;
const BOOKS_PER_PAGE = 6;

const categoryQueries = {
  architecture: "architecture",
  art: "art OR fashion",
  biography: "biography",
  business: "business",
  crafts: "crafts OR hobbies",
  drama: "drama",
  fiction: "fiction",
  food: "food OR drink OR cooking",
  health: "health OR wellbeing",
  history: "history OR politics",
  humor: "humor OR comedy",
  poetry: "poetry",
  psychology: "psychology",
  science: "science",
  technology: "technology",
  travel: "travel OR maps",
};

export class BooksApi {
    constructor() {
        this.currentCategory = 'architecture';
        this.currentPage = 0;
        this.isLoading = false;
        this.hasMoreBooks = true;
    }
    
    async fetchBooks(category, page = 0) {
        if (this.isLoading || !this.hasMoreBooks) return [];
        
        this.isLoading = true;
        const startIndex = page * BOOKS_PER_PAGE;
        const query = categoryQueries[category] || categoryQueries.architecture;
        
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${BOOKS_PER_PAGE}&key=${API_CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('BooksApi Error:', error);
            return [];
        } finally {
            this.isLoading = false;
        }
    }
    
    resetPagination() {
        this.currentPage = 0;
        this.hasMoreBooks = true;
    }
    
    setHasMoreBooks(hasMore) {
        this.hasMoreBooks = hasMore;
    }
    
    getCurrentCategory() {
        return this.currentCategory;
    }
    
    setCurrentCategory(category) {
        this.currentCategory = category;
    }
    
    incrementPage() {
        this.currentPage++;
    }
    
    getCurrentPage() {
        return this.currentPage;
    }

     setActiveCategory(category) {
        this.currentCategory = category;
        
        // Удаляем класс active со всех кнопок
        document.querySelectorAll('.category-link').forEach(a => {
            a.classList.remove('active');
        });
        
        // Добавляем класс active к текущей кнопке
        const activelink = document.querySelector(`[data-category="${category}"]`);
        if (activelink) {
            activelink.classList.add('active');
        }
    }
}

