import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // In SPA mode with middleware, Vite doesn't automatically serve index.html 
    // from the root unless we specifically handle it or let the middleware fall through.
    // However, for the best experience in this environment, we specifically serve it.
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // Read index.html
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        // Apply Vite HTML transforms. This injects the Vite client, and also applies
        // HTML transforms from Vite plugins, e.g. ecosystem plugins that inject scripts.
        template = await vite.transformIndexHtml(url, template);
        // Send the transformed HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace so it maps back
        // to your actual source code.
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Static assets from ROOT (like firebase-applet-config.json) - serve FIRST in production
    // but only for specific files to avoid conflicts with index.html
    app.use('/firebase-applet-config.json', express.static(path.join(__dirname, "firebase-applet-config.json")));

    // Production: serve built files
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
