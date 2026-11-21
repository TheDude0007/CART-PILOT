// Local-only dev server mimicking Vercel's file routing. NOT deployed.
// Lets us verify the static frontend + serverless handlers work together.
import http from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const handlers = {
  '/api/health': (await import('./api/health.js')).default,
  '/api/auth': (await import('./api/auth.js')).default,
  '/api/catalog': (await import('./api/catalog.js')).default,
  '/api/cart': (await import('./api/cart.js')).default,
  '/api/rewards': (await import('./api/rewards.js')).default,
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const query = Object.fromEntries(url.searchParams);

  if (handlers[pathname]) {
    let body = '';
    for await (const c of req) body += c;
    req.query = query;
    req.body = body ? (() => { try { return JSON.parse(body); } catch { return null; } })() : null;
    // shim express-like res
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res; };
    return handlers[pathname](req, res);
  }
  // static
  try {
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    const data = await readFile(path.join(__dirname, 'public', file));
    res.end(data);
  } catch { res.statusCode = 404; res.end('not found'); }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`dev server on http://localhost:${PORT}`));
