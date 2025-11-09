const path = require('path');
const express = require('express');

async function start() {
  const app = express();
  const { createServer: createViteServer } = require('vite');

  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
      const appHtml = render(url);

      const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mini Marketplace UNAB</title></head><body><div id="root">${appHtml}</div><script type="module" src="/src/entry-client.tsx"></script></body></html>`;

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(5173, () => {
    console.log('SSR dev server running at http://localhost:5173');
  });
}

start();
