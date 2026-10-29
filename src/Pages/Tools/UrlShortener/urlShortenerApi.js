// Client API helper for Stiknex URL Shortener & Analytics

const OWNER_KEY_STORAGE = 'stiknex_shortener_owner_key';

export function getOwnerKey() {
  try {
    let key = localStorage.getItem(OWNER_KEY_STORAGE);
    if (!key || key.length < 8) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      const randomHex = Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      key = 'owk_' + randomHex + Date.now().toString(36);
      localStorage.setItem(OWNER_KEY_STORAGE, key);
    }
    return key;
  } catch (_) {
    return 'owk_fallback_' + Date.now().toString(36);
  }
}

// 1. Create Short URL
export async function createShortUrl({
  originalUrl,
  customCode,
  title,
  campaign,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  expiresAt,
}) {
  const ownerKey = getOwnerKey();
  const res = await fetch('/api/shortener/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalUrl,
      customCode,
      title,
      campaign,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      expiresAt,
      ownerKey,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create short URL');
  }
  return data.link;
}

// 2. Fetch Owner's Links
export async function fetchOwnerLinks({ page = 1, limit = 20, search = '', status = 'all', sort = 'newest' }) {
  const ownerKey = getOwnerKey();
  const params = new URLSearchParams({
    ownerKey,
    page: String(page),
    limit: String(limit),
    search,
    status,
    sort,
  });
  const res = await fetch(`/api/shortener/links?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch links');
  }
  return data;
}

// 3. Fetch Real-Time Detailed Link Analytics
export async function fetchLinkAnalytics(shortCode, range = '30d') {
  const ownerKey = getOwnerKey();
  const params = new URLSearchParams({
    shortCode,
    ownerKey,
    range,
  });
  const res = await fetch(`/api/shortener/link-stats?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch analytics');
  }
  return data;
}

// 4. Update Link (Destination, Disabled state, Expiry)
export async function updateShortLink(shortCode, updates) {
  const ownerKey = getOwnerKey();
  const res = await fetch('/api/shortener/update-link', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shortCode,
      ownerKey,
      ...updates,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update short URL');
  }
  return data.link;
}

// 5. Delete Link
export async function deleteShortLink(shortCode) {
  const ownerKey = getOwnerKey();
  const res = await fetch('/api/shortener/delete-link', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shortCode,
      ownerKey,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete short URL');
  }
  return data;
}

// 6. CSV Export URL
export function getCsvExportUrl(shortCode) {
  const ownerKey = getOwnerKey();
  return `/api/shortener/export-csv?shortCode=${encodeURIComponent(shortCode)}&ownerKey=${encodeURIComponent(ownerKey)}`;
}
