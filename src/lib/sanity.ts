import { createClient } from '@sanity/client';
import { PortfolioItem } from '../types';

// Detect if Sanity credentials are provided
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-07-19';

export const isSanityConfigured = !!(projectId && projectId !== 'your_project_id_here');

// Lazy initialize client to prevent startup crashes when keys are missing
let clientInstance: any = null;

export function getSanityClient() {
  if (!isSanityConfigured) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // fast cached responses
    });
  }
  return clientInstance;
}

/**
 * Proxy-fetching functions:
 * Fetches the data from the Express server backend proxy to avoid CORS and securely use read-tokens.
 */

export async function fetchProjectsFromSanity(): Promise<PortfolioItem[]> {
  if (!isSanityConfigured) {
    console.info('[Sanity CMS] Falling back to default high-fidelity local content. Configure VITE_SANITY_PROJECT_ID to stream live content.');
    return [];
  }

  try {
    const response = await fetch('/api/sanity/projects');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Sanity CMS] Error fetching projects from backend proxy, using fallback data:', error);
    return [];
  }
}

export async function fetchTestimonialsFromSanity(): Promise<any[]> {
  if (!isSanityConfigured) {
    return [];
  }

  try {
    const response = await fetch('/api/sanity/testimonials');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Sanity CMS] Error fetching testimonials from backend proxy, using fallback data:', error);
    return [];
  }
}
