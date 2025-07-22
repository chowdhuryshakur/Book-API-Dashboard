import { fetchBookDetails } from './api.js';
import { toggleWishlist, showError } from './utils.js'

document.addEventListener('DOMContentLoaded', async () => {
  const spinner = document.getElementById('loading-spinner');
  const container = document.getElementById('wishlist-container');
  const emptyMessage = document.getElementById('empty-wishlist');
  
  try {
    spinner.style.display = 'block';
    container.innerHTML = '';
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    // Fetch details for each book in wishlist
    const bookPromises = wishlist.map(bookId => fetchBookDetails(bookId));
    const books = await Promise.all(bookPromises);
    
    books.forEach(book => {
      container.innerHTML += `
        <div class="col">
          <div class="card h-100">
            <img src="${book.formats['image/jpeg'] || 'placeholder.jpg'}" 
                 class="card-img-top" 
                 alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text">By: ${book.authors.map(a => a.name).join(', ')}</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-danger remove-btn" data-id="${book.id}">
                  Remove
                </button>
                <a href="/book.html?id=${book.id}" class="btn btn-sm btn-outline-primary">
                  Details
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error('Error loading wishlist:', error);
    container.innerHTML = `
      <div class="alert alert-danger">
        Failed to load wishlist. Please try again later.
      </div>
    `;
  } finally {
    spinner.style.display = 'none';
  }

  // Handle remove button clicks
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const bookId = e.target.dataset.id;
      removeFromWishlist(bookId);
      e.target.closest('.col').remove();
      
      // Show empty message if wishlist is now empty
      if (container.children.length === 0) {
        emptyMessage.style.display = 'block';
      }
    }
  });
});

function removeFromWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(id => id !== bookId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
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