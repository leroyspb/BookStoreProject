const projects = [
  {
    id: 1,
    name: "Banner blackfriday",
    image: "assets/images/jpg/blackfriday.jpg",
  },
  {
    id: 2,
    name: "Banner checkout",
    image: "assets/images/jpg/checkout.jpg",
  },
  {
    id: 3,
    name: "Banner top10",
    image: "assets/images/jpg/top10.jpg",
  },
];

export default class Slider {
    constructor() {
        this.currentSlide = 0;
        this.autoPlayInterval = null;
    }
    
    render() {
        return `
            <div class="container">
                <div class="slider-container">
                    <img src="${projects[0].image}" alt="${projects[0].name}" class="main-image" id="main-image">
                </div>
                <div class="slider-controls">
                    <div class="dots-container" id="dots-container"></div>
                </div>
            </div>
        `;
    }
    
    init() {
        const sliderElement = document.getElementById('slider');
        if (sliderElement) {
            sliderElement.innerHTML = this.render();
            this.initSlider();
            this.startAutoPlay();
        }
    }
    
    initSlider() {
        const dotsContainer = document.getElementById('dots-container');
        
        projects.forEach((project, index) => {
            const dot = document.createElement("button");
            dot.className = `dot ${index === 0 ? "active" : ""}`;
            dot.setAttribute("data-index", index);
            dot.setAttribute("aria-label", `Go to slide ${index + 1}: ${project.name}`);
            
            const dotCircle = document.createElement("span");
            dotCircle.className = "dot-circle";
            dot.appendChild(dotCircle);
            dotsContainer.appendChild(dot);
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const dotsContainer = document.getElementById('dots-container');
        const mainImage = document.getElementById('main-image');
        
        dotsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("dot") || e.target.classList.contains("dot-circle")) {
                const dot = e.target.classList.contains("dot") ? e.target : e.target.parentElement;
                const index = parseInt(dot.getAttribute("data-index"));
                this.goToSlide(index);
            }
        });
        
        mainImage.addEventListener("mouseenter", () => this.stopAutoPlay());
        mainImage.addEventListener("mouseleave", () => this.startAutoPlay());
        dotsContainer.addEventListener("mouseenter", () => this.stopAutoPlay());
        dotsContainer.addEventListener("mouseleave", () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        if (index < 0) index = projects.length - 1;
        if (index >= projects.length) index = 0;
        
        this.currentSlide = index;
        this.updateSlide();
    }
    
    updateSlide() {
        const project = projects[this.currentSlide];
        const mainImage = document.getElementById('main-image');
        const dots = document.querySelectorAll('.dot');
        
        mainImage.style.opacity = "0";
        setTimeout(() => {
            mainImage.src = project.image;
            mainImage.alt = project.name;
            mainImage.style.opacity = "1";
        }, 200);
        
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}