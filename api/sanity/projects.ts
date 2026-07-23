import { createClient } from '@sanity/client';

export default async function handler(req: any, res: any) {
  // Set CORS headers
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

  const projectId = process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || 'production';
  const apiVersion = process.env.VITE_SANITY_API_VERSION || '2026-07-19';
  const token = process.env.SANITY_API_TOKEN;

  const isSanityConfigured = !!(projectId && projectId !== 'your_project_id_here');

  if (!isSanityConfigured) {
    return res.status(404).json({ error: 'Sanity not configured' });
  }

  try {
    const sanityClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false, // Serverless calls should use fresh data
    });

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
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[Serverless] Error fetching projects from Sanity:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
}
