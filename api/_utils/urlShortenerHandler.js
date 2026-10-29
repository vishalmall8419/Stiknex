import crypto from 'crypto';
import connectToDatabase from './db.js';
import ShortUrl from '../_models/ShortUrl.js';
import UrlClick from '../_models/UrlClick.js';

const HASH_SALT = process.env.URL_HASH_SALT || 'stiknex_salt_url_2026_protect';

// Generate collision-resistant alphanumeric code (6 characters)
function generateShortCode(length = 6) {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

// Helper to sanitize and validate URLs
function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Bot & crawler detection from user agent
function detectBot(ua = '') {
  const lower = ua.toLowerCase();
  const botSignatures = [
    { name: 'Googlebot', pattern: /googlebot/ },
    { name: 'Bingbot', pattern: /bingbot/ },
    { name: 'Twitterbot', pattern: /twitterbot/ },
    { name: 'FacebookBot', pattern: /facebookexternalhit/ },
    { name: 'LinkedInBot', pattern: /linkedinbot/ },
    { name: 'Slackbot', pattern: /slackbot/ },
    { name: 'Discordbot', pattern: /discordbot/ },
    { name: 'WhatsApp', pattern: /whatsapp/ },
    { name: 'TelegramBot', pattern: /telegrambot/ },
    { name: 'Applebot', pattern: /applebot/ },
    { name: 'YandexBot', pattern: /yandexbot/ },
    { name: 'Baiduspider', pattern: /baiduspider/ },
    { name: 'DuckDuckBot', pattern: /duckduckbot/ },
    { name: 'Pinterestbot', pattern: /pinterest/ },
    { name: 'Embedly', pattern: /embedly/ },
    { name: 'QuoraBot', pattern: /quora link preview/ },
    { name: 'Curl/Wget', pattern: /(curl|wget|python-requests|go-http-client|axios|postmanruntime)/ },
  ];

  for (const bot of botSignatures) {
    if (bot.pattern.test(lower)) {
      return { isBot: true, botName: bot.name };
    }
  }

  // Generic bot indicators
  if (lower.includes('bot') || lower.includes('spider') || lower.includes('crawler') || lower.includes('preview')) {
    return { isBot: true, botName: 'Automated Crawler' };
  }

  return { isBot: false, botName: '' };
}

// Parse device, browser, and OS from User Agent
function parseUserAgent(ua = '') {
  const lower = ua.toLowerCase();

  // 1. Device Type
  let deviceType = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile';
  }

  // 2. Browser
  let browser = 'Other';
  if (lower.includes('edg/')) browser = 'Edge';
  else if (lower.includes('chrome') && !lower.includes('edg/')) browser = 'Chrome';
  else if (lower.includes('safari') && !lower.includes('chrome')) browser = 'Safari';
  else if (lower.includes('firefox')) browser = 'Firefox';
  else if (lower.includes('opr/') || lower.includes('opera')) browser = 'Opera';
  else if (lower.includes('samsungbrowser')) browser = 'Samsung Internet';

  // 3. Operating System
  let os = 'Other';
  if (lower.includes('windows')) os = 'Windows';
  else if (lower.includes('macintosh') || lower.includes('mac os')) os = 'macOS';
  else if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ios')) os = 'iOS';
  else if (lower.includes('android')) os = 'Android';
  else if (lower.includes('linux')) os = 'Linux';
  else if (lower.includes('cros')) os = 'Chrome OS';

  return { deviceType, browser, os };
}

// Extract clean referrer domain
function parseReferrer(rawReferrer = '') {
  if (!rawReferrer || rawReferrer.trim() === '') {
    return { referrer: '', referrerDomain: 'Direct / None' };
  }
  try {
    const url = new URL(rawReferrer);
    let domain = url.hostname.replace(/^www\./, '');
    if (domain.includes('google.')) domain = 'Google';
    else if (domain.includes('bing.')) domain = 'Bing';
    else if (domain.includes('duckduckgo.')) domain = 'DuckDuckGo';
    else if (domain.includes('t.co') || domain.includes('twitter.com') || domain.includes('x.com')) domain = 'X / Twitter';
    else if (domain.includes('facebook.com')) domain = 'Facebook';
    else if (domain.includes('linkedin.com')) domain = 'LinkedIn';
    else if (domain.includes('instagram.com')) domain = 'Instagram';
    else if (domain.includes('reddit.com')) domain = 'Reddit';
    else if (domain.includes('youtube.com')) domain = 'YouTube';
    return { referrer: rawReferrer, referrerDomain: domain };
  } catch (_) {
    return { referrer: rawReferrer, referrerDomain: 'Direct / None' };
  }
}

// Generate privacy-conscious pseudonymous visitor hash (No raw IP stored)
function getPseudonymousVisitorHash(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';
  const ua = req.headers['user-agent'] || '';
  const monthKey = new Date().toISOString().slice(0, 7); // monthly rotation for privacy
  return crypto
    .createHmac('sha256', HASH_SALT)
    .update(`${monthKey}:${ip}:${ua}`)
    .digest('hex')
    .slice(0, 24);
}

// Render error or link status HTML page
function renderStatusPage(res, { title, heading, message, status = 200, code = '' }) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Stiknex</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    h1 { font-size: 24px; margin-top: 16px; margin-bottom: 12px; color: #f1f5f9; }
    p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.2s; }
    .btn:hover { background: #4f46e5; }
    .code-badge { font-family: monospace; background: rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 4px; color: #a5b4fc; }
  </style>
</head>
<body>
  <div class="card">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    <h1>${heading}</h1>
    <p>${message}</p>
    ${code ? `<p>Short Code: <span class="code-badge">${code}</span></p>` : ''}
    <a href="/url-shortener" class="btn">Create Your Own Short URL</a>
  </div>
</body>
</html>`);
}

// MAIN HANDLER FOR ALL SHORTENER AND CLICK TRACKING ACTIONS
export default async function handleUrlShortener(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawAction = req.query.action || '';
  // Normalize subAction e.g. "shortener-links" -> "links"
  const action = rawAction.replace(/^shortener-/, '');

  try {
    await connectToDatabase();

    // 1. REDIRECT & RECORD CLICK EVENT SERVER-SIDE
    if (action === 'redirect') {
      const code = req.query.code || req.query.c || '';
      if (!code) {
        return renderStatusPage(res, {
          title: 'Link Not Found',
          heading: 'Missing Short Code',
          message: 'No short URL code was provided in the request.',
          status: 404,
        });
      }

      const shortUrl = await ShortUrl.findOne({ shortCode: code });
      if (!shortUrl) {
        return renderStatusPage(res, {
          title: 'Link Not Found',
          heading: 'Short Link Not Found',
          message: 'The requested short link does not exist or may have been deleted.',
          status: 404,
          code,
        });
      }

      // Check if disabled
      if (shortUrl.disabled) {
        return renderStatusPage(res, {
          title: 'Link Disabled',
          heading: 'Link Temporarily Disabled',
          message: 'The owner of this short link has temporarily disabled redirects.',
          status: 403,
          code,
        });
      }

      // Check if expired
      if (shortUrl.expiresAt && new Date(shortUrl.expiresAt) < new Date()) {
        return renderStatusPage(res, {
          title: 'Link Expired',
          heading: 'This Link Has Expired',
          message: 'This short link was configured with an expiration date and is no longer active.',
          status: 410,
          code,
        });
      }

      // Server-side click tracking metrics
      const ua = req.headers['user-agent'] || '';
      const { isBot, botName } = detectBot(ua);
      const { deviceType, browser, os } = parseUserAgent(ua);
      const rawReferrer = req.headers['referer'] || req.headers['referrer'] || '';
      const { referrer, referrerDomain } = parseReferrer(rawReferrer);

      // Geolocation from Vercel edge headers
      const countryCode = req.headers['x-vercel-ip-country'] || 'XX';
      const country = countryCode !== 'XX' ? countryCode : 'Unknown';
      const region = req.headers['x-vercel-ip-country-region'] || 'Unknown';
      const city = req.headers['x-vercel-ip-city'] || 'Unknown';

      // Privacy-conscious pseudonymous visitor hash
      const visitorHash = getPseudonymousVisitorHash(req);

      // Determine unique visitor without storing raw IP
      let isUnique = false;
      if (!isBot) {
        const existingClick = await UrlClick.findOne({
          shortUrlId: shortUrl._id,
          visitorHash,
        }).select('_id');
        if (!existingClick) {
          isUnique = true;
        }
      }

      // Persist click event asynchronously
      const clickEvent = new UrlClick({
        shortUrlId: shortUrl._id,
        shortCode: shortUrl.shortCode,
        timestamp: new Date(),
        visitorHash,
        isUnique,
        isBot,
        botName,
        country,
        countryCode,
        region,
        city,
        deviceType: isBot ? 'bot' : deviceType,
        browser,
        os,
        referrer,
        referrerDomain,
      });

      // Update counters on ShortUrl document
      const updateData = {
        $inc: {
          clicks: 1,
          uniqueClicks: isUnique ? 1 : 0,
          botClicks: isBot ? 1 : 0,
        },
        $set: {
          lastClickedAt: new Date(),
        },
      };

      await Promise.all([clickEvent.save(), ShortUrl.updateOne({ _id: shortUrl._id }, updateData)]);

      // Build target URL (attach UTM campaign params if configured)
      let destination = shortUrl.originalUrl;
      try {
        const destObj = new URL(destination);
        if (shortUrl.utmSource && !destObj.searchParams.has('utm_source')) {
          destObj.searchParams.set('utm_source', shortUrl.utmSource);
        }
        if (shortUrl.utmMedium && !destObj.searchParams.has('utm_medium')) {
          destObj.searchParams.set('utm_medium', shortUrl.utmMedium);
        }
        if (shortUrl.utmCampaign && !destObj.searchParams.has('utm_campaign')) {
          destObj.searchParams.set('utm_campaign', shortUrl.utmCampaign);
        }
        if (shortUrl.utmTerm && !destObj.searchParams.has('utm_term')) {
          destObj.searchParams.set('utm_term', shortUrl.utmTerm);
        }
        if (shortUrl.utmContent && !destObj.searchParams.has('utm_content')) {
          destObj.searchParams.set('utm_content', shortUrl.utmContent);
        }
        destination = destObj.toString();
      } catch (_) {}

      // Fast HTTP 302 Redirect
      res.writeHead(302, {
        Location: destination,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      return res.end();
    }

    // 2. CREATE NEW SHORT URL
    if (action === 'shorten') {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      const {
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
      } = req.body || {};

      if (!originalUrl || !isValidHttpUrl(originalUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid destination URL starting with http:// or https://',
        });
      }

      if (!ownerKey || typeof ownerKey !== 'string' || ownerKey.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid owner credentials.',
        });
      }

      let shortCode = '';

      if (customCode && customCode.trim()) {
        const cleanCustom = customCode.trim().toLowerCase();
        // Validation: only letters, numbers, hyphens, and underscores between 3 and 30 chars
        if (!/^[a-z0-9_-]{3,30}$/.test(cleanCustom)) {
          return res.status(400).json({
            success: false,
            error: 'Custom alias must be 3-30 characters long and contain only letters, numbers, hyphens, or underscores.',
          });
        }

        // Check if customCode is reserved
        const reserved = ['admin', 'api', 'tools', 'whiteboard', 'notebook', 'blog', 'about', 'dashboard', 'login'];
        if (reserved.includes(cleanCustom)) {
          return res.status(400).json({
            success: false,
            error: 'This custom alias is reserved by the system. Please pick another.',
          });
        }

        // Check availability
        const exists = await ShortUrl.findOne({ shortCode: cleanCustom });
        if (exists) {
          return res.status(409).json({
            success: false,
            error: `Alias "${cleanCustom}" is already taken. Please choose a different one.`,
          });
        }
        shortCode = cleanCustom;
      } else {
        // Generate random unique code
        let attempts = 0;
        while (attempts < 5) {
          const candidate = generateShortCode(6);
          const exists = await ShortUrl.findOne({ shortCode: candidate });
          if (!exists) {
            shortCode = candidate;
            break;
          }
          attempts++;
        }
        if (!shortCode) {
          shortCode = generateShortCode(8);
        }
      }

      // Expiration date parsing
      let parsedExpiry = null;
      if (expiresAt) {
        const d = new Date(expiresAt);
        if (!isNaN(d.getTime()) && d > new Date()) {
          parsedExpiry = d;
        }
      }

      const newShort = new ShortUrl({
        shortCode,
        originalUrl: originalUrl.trim(),
        title: title?.trim() || '',
        campaign: campaign?.trim() || '',
        utmSource: utmSource?.trim() || '',
        utmMedium: utmMedium?.trim() || '',
        utmCampaign: utmCampaign?.trim() || '',
        utmTerm: utmTerm?.trim() || '',
        utmContent: utmContent?.trim() || '',
        ownerKey: ownerKey.trim(),
        expiresAt: parsedExpiry,
      });

      await newShort.save();

      return res.status(201).json({
        success: true,
        link: newShort,
      });
    }

    // 3. LIST OWNER'S SHORT URLS (PAGINATED & SEARCHABLE)
    if (action === 'links') {
      const ownerKey = req.query.ownerKey || req.body?.ownerKey;
      if (!ownerKey) {
        return res.status(400).json({ success: false, error: 'Owner key required' });
      }

      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const search = (req.query.search || '').trim();
      const statusFilter = req.query.status || 'all'; // all | active | expired | disabled
      const sortBy = req.query.sort || 'newest'; // newest | oldest | clicks | last_clicked

      const query = { ownerKey };

      if (search) {
        query.$or = [
          { shortCode: { $regex: search, $options: 'i' } },
          { originalUrl: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { campaign: { $regex: search, $options: 'i' } },
        ];
      }

      const now = new Date();
      if (statusFilter === 'active') {
        query.disabled = false;
        query.$or = [{ expiresAt: null }, { expiresAt: { $gt: now } }];
      } else if (statusFilter === 'expired') {
        query.expiresAt = { $lte: now };
      } else if (statusFilter === 'disabled') {
        query.disabled = true;
      }

      let sortQuery = { createdAt: -1 };
      if (sortBy === 'oldest') sortQuery = { createdAt: 1 };
      else if (sortBy === 'clicks') sortQuery = { clicks: -1, createdAt: -1 };
      else if (sortBy === 'last_clicked') sortQuery = { lastClickedAt: -1, createdAt: -1 };

      const [links, total] = await Promise.all([
        ShortUrl.find(query)
          .sort(sortQuery)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        ShortUrl.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        links,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // 4. REAL-TIME DETAILED LINK ANALYTICS
    if (action === 'link-stats') {
      const shortCode = req.query.shortCode || req.query.code;
      const ownerKey = req.query.ownerKey;

      if (!shortCode) {
        return res.status(400).json({ success: false, error: 'Short code required' });
      }

      const link = await ShortUrl.findOne({ shortCode }).lean();
      if (!link) {
        return res.status(404).json({ success: false, error: 'Short link not found' });
      }

      // Security: Validate ownerKey to prevent random users from inspecting private analytics
      if (!ownerKey || link.ownerKey !== ownerKey) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized. You do not have permission to view analytics for this short link.',
        });
      }

      const range = req.query.range || '30d'; // 24h | 7d | 30d | 90d | all
      const startDate = new Date();
      if (range === '24h') startDate.setHours(startDate.getHours() - 24);
      else if (range === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (range === '90d') startDate.setDate(startDate.getDate() - 90);
      else if (range === 'all') startDate.setFullYear(2020);
      else startDate.setDate(startDate.getDate() - 30); // 30d default

      const baseMatch = {
        shortUrlId: link._id,
        timestamp: { $gte: startDate },
      };

      // Aggregate: Total, Unique, Bots in this range
      const [
        overallCounts,
        timeSeriesData,
        countryData,
        deviceData,
        browserData,
        osData,
        referrerData,
        recentClicks,
      ] = await Promise.all([
        // 1. Overall counts in range
        UrlClick.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: null,
              totalClicks: { $sum: 1 },
              uniqueVisitors: { $sum: { $cond: ['$isUnique', 1, 0] } },
              botClicks: { $sum: { $cond: ['$isBot', 1, 0] } },
              humanClicks: { $sum: { $cond: ['$isBot', 0, 1] } },
            },
          },
        ]),

        // 2. Time series (Hourly for 24h, Daily for 7d+)
        UrlClick.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id:
                range === '24h'
                  ? {
                      $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' },
                    }
                  : {
                      $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
                    },
              clicks: { $sum: 1 },
              uniques: { $sum: { $cond: ['$isUnique', 1, 0] } },
              bots: { $sum: { $cond: ['$isBot', 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // 3. Top Countries
        UrlClick.aggregate([
          { $match: { ...baseMatch, isBot: false } },
          { $group: { _id: '$country', code: { $first: '$countryCode' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),

        // 4. Devices
        UrlClick.aggregate([
          { $match: { ...baseMatch, isBot: false } },
          { $group: { _id: '$deviceType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // 5. Browsers
        UrlClick.aggregate([
          { $match: { ...baseMatch, isBot: false } },
          { $group: { _id: '$browser', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // 6. Operating Systems
        UrlClick.aggregate([
          { $match: { ...baseMatch, isBot: false } },
          { $group: { _id: '$os', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // 7. Top Referrer Domains
        UrlClick.aggregate([
          { $match: { ...baseMatch, isBot: false } },
          { $group: { _id: '$referrerDomain', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),

        // 8. Recent 25 raw click logs
        UrlClick.find(baseMatch)
          .sort({ timestamp: -1 })
          .limit(25)
          .select('timestamp country countryCode region city deviceType browser os referrerDomain isUnique isBot botName')
          .lean(),
      ]);

      const counts = overallCounts[0] || {
        totalClicks: 0,
        uniqueVisitors: 0,
        botClicks: 0,
        humanClicks: 0,
      };

      return res.status(200).json({
        success: true,
        link,
        analytics: {
          range,
          overview: {
            lifetimeClicks: link.clicks || 0,
            lifetimeUniques: link.uniqueClicks || 0,
            lifetimeBots: link.botClicks || 0,
            rangeClicks: counts.totalClicks,
            rangeUniques: counts.uniqueVisitors,
            rangeBots: counts.botClicks,
            rangeHumans: counts.humanClicks,
            humanPercentage: counts.totalClicks > 0 ? Math.round((counts.humanClicks / counts.totalClicks) * 100) : 100,
            firstClickedAt: link.createdAt,
            lastClickedAt: link.lastClickedAt,
          },
          timeline: timeSeriesData.map((t) => ({
            date: t._id,
            clicks: t.clicks,
            uniques: t.uniques,
            bots: t.bots,
          })),
          countries: countryData.map((c) => ({
            name: c._id || 'Unknown',
            code: c.code || 'XX',
            clicks: c.count,
            percentage: counts.humanClicks > 0 ? Math.round((c.count / counts.humanClicks) * 100) : 0,
          })),
          devices: deviceData.map((d) => ({
            type: d._id || 'desktop',
            clicks: d.count,
            percentage: counts.humanClicks > 0 ? Math.round((d.count / counts.humanClicks) * 100) : 0,
          })),
          browsers: browserData.map((b) => ({
            name: b._id || 'Other',
            clicks: b.count,
            percentage: counts.humanClicks > 0 ? Math.round((b.count / counts.humanClicks) * 100) : 0,
          })),
          os: osData.map((o) => ({
            name: o._id || 'Other',
            clicks: o.count,
            percentage: counts.humanClicks > 0 ? Math.round((o.count / counts.humanClicks) * 100) : 0,
          })),
          referrers: referrerData.map((r) => ({
            domain: r._id || 'Direct / None',
            clicks: r.count,
            percentage: counts.humanClicks > 0 ? Math.round((r.count / counts.humanClicks) * 100) : 0,
          })),
          recentClicks,
        },
      });
    }

    // 5. UPDATE SHORT URL METADATA (DESTINATION, EXPIRES, DISABLED)
    if (action === 'update-link') {
      if (req.method !== 'PATCH' && req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      const { shortCode, ownerKey, originalUrl, title, campaign, disabled, expiresAt } = req.body || {};

      if (!shortCode || !ownerKey) {
        return res.status(400).json({ success: false, error: 'shortCode and ownerKey required' });
      }

      const link = await ShortUrl.findOne({ shortCode, ownerKey });
      if (!link) {
        return res.status(404).json({ success: false, error: 'Link not found or access denied.' });
      }

      if (originalUrl !== undefined) {
        if (!isValidHttpUrl(originalUrl)) {
          return res.status(400).json({ success: false, error: 'Invalid destination URL.' });
        }
        link.originalUrl = originalUrl.trim();
      }

      if (title !== undefined) link.title = title.trim();
      if (campaign !== undefined) link.campaign = campaign.trim();
      if (disabled !== undefined) link.disabled = Boolean(disabled);

      if (expiresAt !== undefined) {
        if (!expiresAt) {
          link.expiresAt = null;
        } else {
          const d = new Date(expiresAt);
          if (!isNaN(d.getTime())) link.expiresAt = d;
        }
      }

      await link.save();
      return res.status(200).json({ success: true, link });
    }

    // 6. DELETE SHORT URL AND ALL ITS CLICKS
    if (action === 'delete-link') {
      if (req.method !== 'DELETE' && req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      const { shortCode, ownerKey } = req.body || req.query || {};

      if (!shortCode || !ownerKey) {
        return res.status(400).json({ success: false, error: 'shortCode and ownerKey required' });
      }

      const link = await ShortUrl.findOne({ shortCode, ownerKey });
      if (!link) {
        return res.status(404).json({ success: false, error: 'Link not found or access denied.' });
      }

      await Promise.all([
        ShortUrl.deleteOne({ _id: link._id }),
        UrlClick.deleteMany({ shortUrlId: link._id }),
      ]);

      return res.status(200).json({ success: true, message: 'Link and analytics deleted successfully.' });
    }

    // 7. EXPORT ANALYTICS CSV
    if (action === 'export-csv') {
      const shortCode = req.query.shortCode || req.query.code;
      const ownerKey = req.query.ownerKey;

      if (!shortCode || !ownerKey) {
        return res.status(400).send('shortCode and ownerKey required');
      }

      const link = await ShortUrl.findOne({ shortCode, ownerKey }).lean();
      if (!link) {
        return res.status(404).send('Link not found or unauthorized');
      }

      const clicks = await UrlClick.find({ shortUrlId: link._id })
        .sort({ timestamp: -1 })
        .limit(5000)
        .lean();

      let csv = 'Timestamp,ShortCode,IsUnique,IsBot,BotName,Country,Region,City,Device,Browser,OS,ReferrerDomain\n';
      clicks.forEach((c) => {
        const time = new Date(c.timestamp).toISOString();
        const row = [
          time,
          `"${c.shortCode}"`,
          c.isUnique ? 'Yes' : 'No',
          c.isBot ? 'Yes' : 'No',
          `"${(c.botName || '').replace(/"/g, '""')}"`,
          `"${(c.country || '').replace(/"/g, '""')}"`,
          `"${(c.region || '').replace(/"/g, '""')}"`,
          `"${(c.city || '').replace(/"/g, '""')}"`,
          `"${c.deviceType}"`,
          `"${(c.browser || '').replace(/"/g, '""')}"`,
          `"${(c.os || '').replace(/"/g, '""')}"`,
          `"${(c.referrerDomain || '').replace(/"/g, '""')}"`,
        ];
        csv += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="stiknex-${shortCode}-analytics.csv"`);
      return res.status(200).send(csv);
    }

    return res.status(400).json({ success: false, error: 'Unknown shortener action.' });
  } catch (err) {
    console.error('URL Shortener Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
