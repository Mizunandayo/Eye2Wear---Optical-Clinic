import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Simple server is working!');
});

server.listen(3002, '127.0.0.1', () => {
  console.log('Simple server running on port 3002');
});