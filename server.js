const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80; // Use port 80 for HTTP

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Serve games.html for the /games or /games/ path
    if (req.url === '/games/' || req.url === '/games') {
        filePath = path.join(__dirname, 'games.html');
    }

    // Prevent directory listing by serving a 404 for directories
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
        return;
    }

    // Automatically append .html if no extension is provided
    if (!path.extname(filePath)) {
        filePath += '.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
