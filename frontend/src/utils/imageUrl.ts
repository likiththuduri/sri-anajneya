import { getApiBaseUrl } from '../api/client';

export const DEFAULT_PRODUCT_FALLBACK = '/urea.png';
export const DEFAULT_HERO_FALLBACK = '/sri-anjaneya-shop.png';
export const DEFAULT_LOGO_FALLBACK = '/anjaneya-logo.jpeg';

/**
 * Resolves any image URL to ensure cross-device and cross-deployment compatibility.
 * - Absolute URLs (https://res.cloudinary.com/... or https://images.unsplash.com/...) are preserved.
 * - Data URLs (data:image/...) and blob URLs are preserved.
 * - Static frontend public assets (/anjaneya-logo.jpeg, /sri-anjaneya-shop.png, /urea.png, /logo.svg, /favicon) are returned as-is.
 * - Relative backend paths (/api/images/..., /uploads/...) are automatically prefixed with the backend base URL (e.g. Render).
 */
export const resolveImageUrl = (
  url?: string | null,
  fallback: string = DEFAULT_PRODUCT_FALLBACK
): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const clean = url.trim();

  // Already an absolute URL or inline data URI
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Static frontend public assets served by Vite / Vercel
  if (
    clean.startsWith('/anjaneya-logo') ||
    clean.startsWith('/sri-anjaneya-shop') ||
    clean.startsWith('/urea') ||
    clean.startsWith('/logo.svg') ||
    clean.startsWith('/favicon')
  ) {
    return clean;
  }

  // Relative path from backend (/api/images/..., /uploads/...)
  const baseUrl = getApiBaseUrl();
  if (clean.startsWith('/')) {
    return `${baseUrl}${clean}`;
  }
  return `${baseUrl}/${clean}`;
};
