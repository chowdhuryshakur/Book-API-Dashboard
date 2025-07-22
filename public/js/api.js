const API_URL = "https://gutendex.com/books";

export const fetchBooks = async (page = 1, search = "", genre = "") => {
    try {
      let url = `${API_URL}?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (genre) url += `&topic=${encodeURIComponent(genre)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch books. Check your connection.');
    }
}

export const fetchBookDetails = async (bookId) => {
    try {
      const response = await fetch(`https://gutendex.com/books/${bookId}`);
      if (!response.ok) throw new Error('Book not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book:', error);
      return {
        id: bookId,
        title: "Unknown Book",
        authors: [{ name: "Unknown Author" }],
        formats: {}
      };
    }
  }