import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const server = http.createServer((req, res) => {
    // 1. Handle root path
    if (req.url === '/') {
        serveFile(res, './public/index.html');
        return;
    }

    // 2. Handle other HTML files
    if (req.url.endsWith('.html')) {
        serveFile(res, `./public${req.url}`);
        return;
    }

    // 3. Handle CSS/JS files
    const ext = path.extname(req.url);
    if (['.js', '.css'].includes(ext)) {
        serveFile(res, `./public${req.url}`);
        return;
    }

    // 4. Handle book details route
    if (req.url.startsWith('/book.html')) {
        serveFile(res, './public/book.html');
        return;
    }
    // 5. Handle wishlist route route
    if (req.url.startsWith('/wishlist')) {
        serveFile(res, './public/wishlist.html');
        return;
    }

    // 5. 404 for everything else
    res.writeHead(404);
    res.end('Not Found');
});

function serveFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
    if (err) {
        res.writeHead(404);
        res.end('File not found');
    } else {
        // Set correct Content-Type
        const ext = path.extname(filePath);
        const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
        }[ext] || 'text/plain';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    }
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
  