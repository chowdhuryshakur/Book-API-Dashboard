# Book Explorer Dashboard  

A responsive web application for browsing books from the Gutendex API with wishlist functionality.  

## Features

- 📚 Browse books with pagination
- 🔍 Real-time search by title
- 🏷️ Filter by genre/category
- ❤️ Wishlist with localStorage persistence
- 📱 Fully responsive design
- ⚡ Single Page Application (SPA) navigation

## Tech Stack

- **Frontend**: Vanilla JavaScript, Bootstrap 5
- **API**: [Gutendex](https://gutendex.com/)

## Setup  
1. Clone the repo:
   ```bash
   https://github.com/chowdhuryshakur/Book-API-Dashboard.git
   ```

2. Start the server locally:
   ```bash
    cd book-api-dashboard
    npx serve public
   ```
3. Open http://localhost:3000

## API Endpoints
```bash
// Fetch books with pagination
`https://gutendex.com/books?page=${page}`

// Search books
`https://gutendex.com/books?search=${query}`

// Get book details
`https://gutendex.com/books/${bookId}`
```

## Project Structure
```bash
book-api-dashboard/
├── public/
│   ├── index.html          # Homepage with book listings
│   ├── wishlist.html       # Wishlist page
│   ├── book.html           # Book details page
│   ├── css/
│   │   └── styles.css      # Custom styles
│   └── js/
│       ├── app.js          # Main application logic
│       ├── api.js          # API communication
│       ├── wishlist.js     # Wishlist management
│       └── book.js         # Book details page logic
├── server.js               # Node.js server
├── README.md               # Project documentation
└── .gitignore
```
