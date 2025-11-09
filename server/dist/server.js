const express = require('express');
const fs = require('fs');
const path = require('path');

async function start() {
  const app = express();
  const clientDist = path.resolve(__dirname, '..', '..', 'dist', 'client');
  const serverEntry = path.resolve(__dirname, '..', '..', 'dist', 'server', 'src', 'entry-server.js');

  app.use(express.static(clientDist));

  const { render } = require(serverEntry);

  app.get('*', (req, res) => {
    const html = render(req.originalUrl);
    const indexHtml = fs.readFileSync(path.resolve(clientDist, 'index.html'), 'utf8');
    const final = indexHtml.replace('<!--ssr-outlet-->', html);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(final);
  });

  const port = process.env.PORT || 5174;
  app.listen(port, () => {
    console.log('Production SSR server running at http://localhost:' + port);
  });
}

start();
