import { fetchBooks } from './api.js'
import { toggleWishlist, showError } from './utils.js'

let currentPage = 1;
let allGenres = new Set();

function setupEventListeners() {
    document.getElementById('search').addEventListener('input', (e) => {
      loadBooks(1, e.target.value);
    });
  
    document.getElementById('genre-filter').addEventListener('change', (e) => {
      loadBooks(1, document.getElementById('search').value, e.target.value);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadBooks();
  setupEventListeners();
});

function extractGenres(books) {
    const genreFilter = document.getElementById('genre-filter');
    
    books.forEach(book => {
      book.subjects?.forEach(subject => {
        allGenres.add(subject.split(' -- ')[0]); // Extract main genre
      });
    });
  
    // Populate dropdown
    genreFilter.innerHTML = `
      <option value="">All Genres</option>
      ${Array.from(allGenres).map(genre => `
        <option value="${genre}">${genre}</option>
      `).join('')}
    `;
}

async function loadBooks(page = 1, search = "", genre = "") {
    try {
      document.body.classList.add('loading');
      const data = await fetchBooks(page, search, genre);
      renderBooks(data.results);
      renderPagination(data);
      extractGenres(data.results);
    } catch (error) {
      showError("Failed to load books. Please try again.");
    } finally {
      document.body.classList.remove('loading');
    }
  }

let currentListeners = [];
function renderBooks(books) {
    // Remove old listeners
    currentListeners.forEach(cleanup => cleanup());
    currentListeners = [];

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = books?.length < 1 ? `
      <div><h6 class='text-danger'>No book found!</h6></div>
    ` : books.map(book => `
      <div class="col">
        <div class="card h-100">
          <img src="${book.formats['image/jpeg'] || 'placeholder.jpg'}" class="card-img-top" style="height:550px;">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">By: ${book.authors.map(a => a.name).join(', ')}</p>
            <div class='d-flex justify-content-between align-items-center'>
              <button class="btn btn-sm ${wishlist.includes(book.id.toString()) ? 'btn-danger' : 'btn-outline-danger'} wishlist-btn" 
                      data-id="${book.id}">
                ${wishlist.includes(book.id.toString()) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
              </button>
              <a href="/book.html?id=${book.id}" class="btn btn-sm btn-outline-primary ms-2">
                Details
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  
    // wishlist button handlers
    // bookList.addEventListener('click', (e) => {
    //   if (e.target.classList.contains('wishlist-btn')) {
    //     const bookId = e.target.dataset.id;
    //     const isInWishlist = toggleWishlist(bookId);
    //     console.log('11', bookId)
    //     e.target.classList.toggle('btn-outline-danger', !isInWishlist);
    //     e.target.classList.toggle('btn-danger', isInWishlist);
    //     e.target.textContent = isInWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist';

    //     currentListeners.push(() => bookList.removeEventListener('click', handler));
    //   }
    // });
  }
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      const bookId = wishBtn.dataset.id;
      const isInWishlist = toggleWishlist(bookId);
      
      wishBtn.classList.toggle('btn-outline-danger', !isInWishlist);
      wishBtn.classList.toggle('btn-danger', isInWishlist);
      wishBtn.textContent = isInWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist';
    }
  });

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    if (data.previous) {
      pagination.innerHTML += `
        <button class="btn btn-outline-primary mx-1" data-page="${currentPage - 1}">
          Previous
        </button>
      `;
    }
  
    if (data.next) {
      pagination.innerHTML += `
        <button class="btn btn-outline-primary mx-1" data-page="${currentPage + 1}">
          Next
        </button>
      `;
    }
  
    // Page number buttons (e.g., 1 2 3 ...)
    const totalPages = Math.ceil(data.count / 32);
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      pagination.innerHTML += `
        <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1" 
                data-page="${i}">
          ${i}
        </button>
      `;
    }
  
    // Event delegation for pagination buttons
    pagination.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        currentPage = parseInt(e.target.dataset.page);
        loadBooks(currentPage, document.getElementById('search').value);
      }
    });
}

// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Initialize dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}