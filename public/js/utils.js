export function toggleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(bookId);
    
    if (index === -1) {
      wishlist.push(bookId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return true;
    } else {
      wishlist.splice(index, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return false;
    }
}

export function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show fixed-top mx-auto mt-3';
    alertDiv.style.maxWidth = '500px';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.prepend(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 2500);
    }, 5000);
}