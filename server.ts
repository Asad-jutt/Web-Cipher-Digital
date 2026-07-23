import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Sanity Client on the server side with the authorization token
const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2026-07-19';
const token = process.env.SANITY_API_TOKEN;

const isSanityConfigured = !!(projectId && projectId !== 'your_project_id_here');

let sanityClient: any = null;
if (isSanityConfigured) {
  console.log(`[Server] Initializing Sanity Client: Project ID: ${projectId}, Dataset: ${dataset}, API Version: ${apiVersion}, Token Present: ${!!token}`);
  sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token, // Server-side has token to bypass draft rules and private dataset controls
    useCdn: false, // Server calls should use fresh data
  });
} else {
  console.log('[Server] Sanity CMS is not configured. Falling back to local data.');
}

// CORS middleware for iframe and API accessibility
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// API Routes
app.get('/api/sanity/projects', async (req, res) => {
  if (!sanityClient) {
    return res.status(404).json({ error: 'Sanity not configured' });
  }

  try {
    const query = `*[_type == "project" || _type == "portfolioProject" || _type == "portfolio_project"] | order(_createdAt desc) {
      "id": _id,
      "title": coalesce(title, name, "Untitled Project"),
      "category": coalesce(category, "WEB EXPERIENCE"),
      "description": coalesce(description, ""),
      "client": coalesce(client->name, clientName, "Vortex Labs"),
      "year": coalesce(year, "2026"),
      "tags": coalesce(tags[]->name, ["Sanity CMS", "Astro"]),
      "mockStats": coalesce(mockStats, [])
    }`;
    const rawData = await sanityClient.fetch(query);
    
    // Deduplicate draft and published versions (preferring draft for latest live preview)
    const map = new Map();
    for (const item of rawData) {
      const cleanId = item.id.replace(/^drafts\./, '');
      const isDraft = item.id.startsWith('drafts.');
      if (!map.has(cleanId) || isDraft) {
        map.set(cleanId, { ...item, id: cleanId });
      }
    }
    const data = Array.from(map.values());
    res.json(data);
  } catch (error: any) {
    console.error('[Server] Error fetching projects from Sanity:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
});

app.get('/api/sanity/testimonials', async (req, res) => {
  if (!sanityClient) {
    return res.status(404).json({ error: 'Sanity not configured' });
  }

  try {
    const query = `*[_type == "testimonial"] {
      "id": _id,
      type,
      quote,
      author,
      "avatar": avatar.asset->url,
      colorClass,
      accentColor,
      bgGlow,
      borderColor,
      hoverBorder,
      "project": project->title
    }`;
    const data = await sanityClient.fetch(query);
    res.json(data);
  } catch (error: any) {
    console.error('[Server] Error fetching testimonials from Sanity:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch testimonials' });
  }
});

// Vite middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
