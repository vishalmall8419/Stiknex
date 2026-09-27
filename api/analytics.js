// Suppress Node's url.parse deprecation warning caused by Google SDKs
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning, ...args) {
    if (args[0] === 'DeprecationWarning' && warning && typeof warning === 'string' && warning.includes('url.parse')) return;
    return originalEmitWarning.call(process, warning, ...args);
};

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { verifyAdminToken } from './_utils/auth.js';
import fs from 'fs';
import path from 'path';

function getAnalyticsClient() {
  let creds;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
        let cleaned = raw.trim();
        if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
        creds = JSON.parse(cleaned);
        if (creds.private_key) {
            // Fix Vercel newlines
            creds.private_key = creds.private_key.replace(/\\n/g, '\n');
        }
    } catch (e) {
        throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON env variable: ' + e.message);
    }
  } else {
    try {
      const jsonPath = path.join(process.cwd(), 'stiknex-analytics-3c4c573bd912.json');
      creds = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (err) {
      throw new Error('Could not find GOOGLE_SERVICE_ACCOUNT_JSON or the json file.');
    }
  }
  return new BetaAnalyticsDataClient({
    credentials: { client_email: creds.client_email, private_key: creds.private_key },
  });
}

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || '556064917';

export default async function handler(req, res) {
  try {
    const auth = verifyAdminToken(req);
    if (!auth.valid) return res.status(401).json({ success: false, message: auth.message });

    const { range = '28' } = req.query;
    const days = Math.min(Number(range) || 28, 1825);
    const client = getAnalyticsClient();
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'today' }];

    // 1. Overview
    const [overviewRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges,
      metrics: [
        { name: 'activeUsers' }, { name: 'newUsers' }, { name: 'sessions' }, 
        { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, 
        { name: 'bounceRate' }, { name: 'eventCount' }, { name: 'conversions' }
      ],
    });
    const ov = overviewRes.rows?.[0]?.metricValues || [];
    const overview = {
      activeUsers: Number(ov[0]?.value ?? 0), newUsers: Number(ov[1]?.value ?? 0), sessions: Number(ov[2]?.value ?? 0),
      pageViews: Number(ov[3]?.value ?? 0), avgSessionDur: Number(Number(ov[4]?.value ?? 0).toFixed(1)),
      bounceRate: Number((Number(ov[5]?.value ?? 0) * 100).toFixed(1)), totalEvents: Number(ov[6]?.value ?? 0),
      conversions: Number(ov[7]?.value ?? 0)
    };

    // 2. Daily Chart
    const [dailyRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges,
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'bounceRate' }, { name: 'eventCount' }, { name: 'conversions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });
        // Fill missing dates for the requested range so charts render continuously
    const completeDailyChart = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}${mm}${dd}`;
      
      const existingRow = dailyRes.rows?.find(r => r.dimensionValues[0].value === dateStr);
      if (existingRow) {
        completeDailyChart.push({
          date: dateStr,
          users: Number(existingRow.metricValues[0].value),
            newUsers: Number(existingRow.metricValues[1].value),
            sessions: Number(existingRow.metricValues[2].value),
            pageViews: Number(existingRow.metricValues[3].value),
            avgSessionDur: Number(existingRow.metricValues[4].value),
            bounceRate: Number(existingRow.metricValues[5].value),
            eventCount: Number(existingRow.metricValues[6].value),
            conversions: Number(existingRow.metricValues[7].value),
            returningUsers: Number(existingRow.metricValues[0].value) - Number(existingRow.metricValues[1].value)
        });
      } else {
        completeDailyChart.push({
          date: dateStr, users: 0, newUsers: 0, sessions: 0, pageViews: 0, avgSessionDur: 0, bounceRate: 0, eventCount: 0, conversions: 0, returningUsers: 0
        });
      }
    }
    const dailyChart = completeDailyChart;

    // 3. Pages
    const [pagesRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'newUsers' }, { name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }, { name: 'conversions' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 15,
    });
    const topPages = (pagesRes.rows || []).map(r => ({
      path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value), users: Number(r.metricValues[1].value),
      newUsers: Number(r.metricValues[2].value), sessions: Number(r.metricValues[3].value),
      bounceRate: (Number(r.metricValues[4].value)*100).toFixed(1), avgTime: Number(r.metricValues[5].value).toFixed(1),
      conversions: Number(r.metricValues[6].value)
    }));

    // 4. Countries
    const [countryRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges, dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 8,
    });
    const topCountries = (countryRes.rows || []).map(r => ({ country: r.dimensionValues[0].value, users: Number(r.metricValues[0].value) }));

    // 5. Devices
    const [deviceRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges, dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    });
    const devices = (deviceRes.rows || []).map(r => ({ device: r.dimensionValues[0].value, users: Number(r.metricValues[0].value) }));

    // 6. Traffic Sources
    const [sourceRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges, dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'conversions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8,
    });
    const trafficSources = (sourceRes.rows || []).map(r => ({
      channel: r.dimensionValues[0].value, users: Number(r.metricValues[0].value), sessions: Number(r.metricValues[1].value),
      engRate: (Number(r.metricValues[2].value)*100).toFixed(1), avgTime: Number(r.metricValues[3].value).toFixed(1),
      conversions: Number(r.metricValues[4].value)
    }));

    // 7. Events
    const [eventsRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`, dateRanges, dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 10,
    });
    const events = (eventsRes.rows || []).map(r => ({
      name: r.dimensionValues[0].value, count: Number(r.metricValues[0].value), users: Number(r.metricValues[1].value)
    }));

    // 8. Realtime
    let realtimeActive = 0, realtimeMinutes = [], realtimeDetails = [];
    try {
      const [rtRes] = await client.runRealtimeReport({ property: `properties/${PROPERTY_ID}`, dimensions: [{ name: 'minutesAgo' }], metrics: [{ name: 'activeUsers' }] });
      const minMap = {};
      (rtRes.rows || []).forEach(r => { minMap[r.dimensionValues[0].value] = Number(r.metricValues[0].value); realtimeActive += Number(r.metricValues[0].value); });
      for(let i=29; i>=0; i--) realtimeMinutes.push({ time: `-${i}m`, value: minMap[String(i)] || 0 });

      const [rtDetailRes] = await client.runRealtimeReport({ property: `properties/${PROPERTY_ID}`, dimensions: [{ name: 'unifiedScreenName' }, { name: 'country' }], metrics: [{ name: 'activeUsers' }] });
      realtimeDetails = (rtDetailRes.rows || []).map(r => ({ page: r.dimensionValues[0].value, country: r.dimensionValues[1].value, users: Number(r.metricValues[0].value) }));
    } catch (e) { console.error("RT Error", e.message); }

    return res.status(200).json({
      success: true,
      data: { overview, dailyChart, topPages, topCountries, devices, trafficSources, events, realtimeActive, realtimeMinutes, realtimeDetails },
    });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}

