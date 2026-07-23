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
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[Serverless] Error fetching testimonials from Sanity:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch testimonials' });
  }
}
