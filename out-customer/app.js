// Wretched Designs Customer Site JavaScript

// Global state
let galleryData = [];
let productsData = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    loadProducts();

    // Set initial page
    showPage('home');
});

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show requested page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav active state
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Find and activate current nav link
    const currentLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Load gallery data
async function loadGallery() {
    try {
        const response = await fetch('./data/gallery.json');
        const data = await response.json();
        galleryData = data.images || [];
        renderGallery();
    } catch (error) {
        console.error('Failed to load gallery:', error);
        // Fallback data
        galleryData = [
            {
                id: "art-1",
                url: "./Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg",
                title: "Cyberpunk Art #1",
                description: "Digital art with cyberpunk aesthetic",
                category: "Art"
            },
            {
                id: "art-2",
                url: "./Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg",
                title: "Cyberpunk Art #2",
                description: "Digital art with cyberpunk aesthetic",
                category: "Art"
            }
        ];
        renderGallery();
    }
}

// Load products data
async function loadProducts() {
    try {
        const response = await fetch('./data/products.json');
        const data = await response.json();
        productsData = data.products || [];
        renderProducts();
    } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback data
        productsData = [
            {
                id: "prod-1",
                name: "Cyberpunk T-Shirt",
                description: "Premium quality t-shirt with cyberpunk design",
                price: 24.99,
                image: "./Images/Shirts/6e6b35c8-59a0-4ac4-9489-b08e05475e87.jpg",
                category: "Shirts"
            },
            {
                id: "prod-2",
                name: "Neon Coffee Cup",
                description: "Custom printed coffee cup with neon design",
                price: 19.99,
                image: "./Images/Cups/0769b870-babf-40e7-8a82-0682dc5abcfb.jpg",
                category: "Cups"
            }
        ];
        renderProducts();
    }
}

// Render gallery
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = galleryData.map(item => `
        <div class="gallery-item" onclick="openModal('${item.url}', '${item.title}')">
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-info">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = productsData.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onclick="openModal('${product.image}', '${product.name}')">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="product-price">$${product.price}</div>
                <button class="buy-button" onclick="buyProduct('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Modal functions
function openModal(imageSrc, title) {
    const modal = document.querySelector('.modal-overlay');
    const modalImg = document.querySelector('.modal-img');

    modalImg.src = imageSrc;
    modalImg.alt = title;
    modal.style.display = 'flex';

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    modal.style.display = 'none';

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Product purchase function (placeholder)
function buyProduct(productId) {
    alert('Coming Soon! Payment processing will be available soon.');
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Prevent modal close when clicking on modal content
document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
});