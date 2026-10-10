/**
 * Generate a stable, unique Smart Tag ID.
 * Format: PZ-XXXXXXXX (8 hex characters)
 */
export function generateTagId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PZ-${id}`;
}

/**
 * Get the public URL for a smart tag.
 */
export function getTagPublicUrl(tagId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/#/tag/${tagId}`;
}
