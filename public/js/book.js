import { fetchBookDetails } from './api.js';
import { toggleWishlist, showError } from './utils.js'

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (bookId) {
        try {
            document.body.classList.add('loading');
            const book = await fetchBookDetails(bookId);
            document.body.classList.remove('loading');
            renderBookDetails(book);
        } catch (error) {
            console.error("Error loading book:", error);
            document.getElementById('book-title').textContent = "Error loading book";
        }
    }
});

function renderBookDetails(book) {
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-id').innerHTML = `<strong>Book ID:</strong> ${book.id}`;
    document.getElementById('book-author').textContent = 
    book.authors?.map(a => a.name).join(', ') || 'Unknown Author';
    
    const coverImg = document.getElementById('book-cover');
    coverImg.src = book.formats['image/jpeg'] || 'placeholder.jpg';
    coverImg.alt = `Cover of ${book.title}`;
    
    const detailsList = document.getElementById('book-details');
    detailsList.innerHTML = `
        <li><strong>Genre:</strong> ${book.subjects?.slice(0, 3).join(', ') || 'N/A'}</li>
        <li><strong>Download:</strong> 
            ${book.formats['text/html'] ? 
                `<a href="${book.formats['text/html']}" target="_blank">HTML</a>` : ''}
            ${book.formats['application/pdf'] ? 
                ` | <a href="${book.formats['application/pdf']}" target="_blank">PDF</a>` : ''}
        </li>
    `;
    
    // Wishlist button functionality
    const wishlistBtn = document.getElementById('wishlist-btn'); 

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(book.id.toString());  
    console.log(wishlist, book.id, index)
    wishlistBtn.innerHTML = index > -1 ? '♥ In Wishlist' : '♡ Add to Wishlist';
    wishlistBtn.classList.toggle('btn-danger', index > -1);
    wishlistBtn.classList.toggle('btn-outline-danger', index === -1);

    wishlistBtn.addEventListener('click', () => {
        const isInWishlist = toggleWishlist(book.id.toString());
        wishlistBtn.innerHTML = isInWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist';
        wishlistBtn.classList.toggle('btn-danger', isInWishlist);
        wishlistBtn.classList.toggle('btn-outline-danger', !isInWishlist);
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