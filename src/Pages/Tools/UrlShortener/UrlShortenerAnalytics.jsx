import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import PageSEO from '../../../Component/SEO/PageSEO';
import Style from './UrlShortener.module.css';
import {
  fetchLinkAnalytics,
  updateShortLink,
  deleteShortLink,
  getCsvExportUrl,
} from './urlShortenerApi';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const UrlShortenerAnalytics = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit Link Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDestination, setEditDestination] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCampaign, setEditCampaign] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadStats = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      setError('');
      try {
        const res = await fetchLinkAnalytics(code, range);
        setData(res);
        setEditDestination(res.link?.originalUrl || '');
        setEditTitle(res.link?.title || '');
        setEditCampaign(res.link?.campaign || '');
      } catch (err) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    },
    [code, range]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Real-time live polling (every 8 seconds when autoRefresh is enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadStats(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadStats]);

  const copyShortUrl = () => {
    const full = `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateShortLink(code, {
        originalUrl: editDestination,
        title: editTitle,
        campaign: editCampaign,
      });
      setEditModalOpen(false);
      loadStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleDisabled = async () => {
    if (!data?.link) return;
    try {
      await updateShortLink(code, { disabled: !data.link.disabled });
      loadStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete /s/${code} and all recorded analytics?`)) return;
    try {
      await deleteShortLink(code);
      navigate('/url-shortener');
    } catch (err) {
      alert(err.message);
    }
  };

  const overview = data?.analytics?.overview || {};
  const timeline = data?.analytics?.timeline || [];
  const countries = data?.analytics?.countries || [];
  const devices = data?.analytics?.devices || [];
  const browsers = data?.analytics?.browsers || [];
  const osList = data?.analytics?.os || [];
  const referrers = data?.analytics?.referrers || [];
  const recentClicks = data?.analytics?.recentClicks || [];
  const link = data?.link || {};

  return (
    <div className={Style.pageWrapper}>
      <PageSEO
        title={`Analytics for /s/${code} | Stiknex URL Shortener`}
        description="Real-time click tracking, unique visitors, geo distribution, device breakdown, and traffic sources for short link."
        path={`/url-shortener/analytics/${code}`}
        type="webapp"
      />

      <div className={Style.container}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/url-shortener"
            className={Style.actionBtn}
            style={{ display: 'inline-flex', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>All Links</span>
          </Link>
          <span style={{ color: '#52525b' }}>/</span>
          <span style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600 }}>Analytics</span>
          <span style={{ color: '#52525b' }}>/</span>
          <span style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 700 }}>/s/{code}</span>
        </div>

        {/* Link Header Banner */}
        <div
          style={{
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.25rem',
            padding: '1.5rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {link.title || `/s/${code}`}
              </h1>
              {link.disabled ? (
                <span className={`${Style.statusBadge} ${Style.badgeDisabled}`}>Disabled</span>
              ) : link.expiresAt && new Date(link.expiresAt) < new Date() ? (
                <span className={`${Style.statusBadge} ${Style.badgeExpired}`}>Expired</span>
              ) : (
                <span className={`${Style.statusBadge} ${Style.badgeActive}`}>Active</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <a
                href={`/s/${code}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}
              >
                {`${window.location.origin}/s/${code}`}
              </a>
              <button
                type="button"
                className={Style.copyIconBtn}
                onClick={copyShortUrl}
                title="Copy short link"
              >
                <i
                  className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}
                  style={{ color: copied ? '#4ade80' : 'inherit' }}
                ></i>
              </button>
            </div>

            <div style={{ color: '#71717a', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-arrow-turn-down-right" style={{ marginRight: '6px' }}></i>
              {link.originalUrl}
            </div>
          </div>

          {/* Controls: Range + Live Refresh + Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
            {/* Time range selector */}
            <select
              className={Style.selectInput}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>

            {/* Live Auto-Refresh Toggle */}
            <button
              type="button"
              className={`${Style.actionBtn} ${autoRefresh ? Style.primaryActionBtn : ''}`}
              onClick={() => setAutoRefresh((v) => !v)}
              title="Automatically refresh analytics in real-time"
            >
              <i className={`fa-solid fa-bolt ${autoRefresh ? 'fa-beat' : ''}`}></i>
              <span>{autoRefresh ? 'Live ON' : 'Live Sync'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              type="button"
              className={Style.actionBtn}
              onClick={() => loadStats()}
              title="Refresh now"
            >
              <i className={`fa-solid fa-rotate ${isLoading ? 'fa-spin' : ''}`}></i>
            </button>

            {/* CSV Export */}
            <a
              href={getCsvExportUrl(code)}
              className={Style.actionBtn}
              title="Download CSV analytics log"
              download
            >
              <i className="fa-solid fa-download"></i>
              <span>Export CSV</span>
            </a>

            {/* Edit */}
            <button
              type="button"
              className={Style.actionBtn}
              onClick={() => setEditModalOpen(true)}
              title="Edit destination"
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>

            {/* Disable toggle */}
            <button
              type="button"
              className={Style.actionBtn}
              onClick={handleToggleDisabled}
              title={link.disabled ? 'Enable link' : 'Disable link'}
            >
              <i className={`fa-solid ${link.disabled ? 'fa-toggle-off' : 'fa-toggle-on'}`} style={{ color: link.disabled ? '#71717a' : '#4ade80' }}></i>
            </button>

            {/* Delete */}
            <button
              type="button"
              className={Style.actionBtn}
              onClick={handleDelete}
              title="Delete link"
              style={{ color: '#f87171' }}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error ? (
          <div className={Style.emptyState} style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f87171', fontSize: '2rem' }}></i>
            <h3 style={{ color: '#f87171', marginTop: '1rem' }}>{error}</h3>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              Ensure you have the right owner credentials to view this private link.
            </p>
          </div>
        ) : (
          <>
            {/* 4 Big Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  background: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>TOTAL CLICKS</span>
                  <i className="fa-solid fa-mouse-pointer" style={{ color: '#6366f1' }}></i>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem' }}>
                  {overview.rangeClicks || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                  Lifetime: {overview.lifetimeClicks || 0} clicks
                </div>
              </div>

              <div
                style={{
                  background: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>UNIQUE VISITORS</span>
                  <i className="fa-solid fa-users" style={{ color: '#818cf8' }}></i>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '0.5rem' }}>
                  {overview.rangeUniques || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                  Pseudonymous unique visitors
                </div>
              </div>

              <div
                style={{
                  background: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>HUMAN TRAFFIC</span>
                  <i className="fa-solid fa-user-check" style={{ color: '#10b981' }}></i>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>
                  {overview.humanPercentage || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                  {overview.rangeHumans || 0} humans / {overview.rangeBots || 0} bots
                </div>
              </div>

              <div
                style={{
                  background: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>LAST CLICK</span>
                  <i className="fa-solid fa-clock-rotate-left" style={{ color: '#f59e0b' }}></i>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.75rem', lineHeight: 1.3 }}>
                  {overview.lastClickedAt ? new Date(overview.lastClickedAt).toLocaleString() : 'No clicks yet'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                  Created: {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            </div>

            {/* Time Series Area Chart */}
            <div
              style={{
                background: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-chart-area" style={{ color: '#818cf8' }}></i>
                  <span>Clicks Over Time</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6366f1' }}></span> Total Clicks
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#38bdf8' }}></span> Unique Visitors
                  </span>
                </div>
              </div>

              {timeline.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717a' }}>
                  <i className="fa-regular fa-chart-bar" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}></i>
                  <p>No click events recorded for this time window yet.</p>
                </div>
              ) : (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: '#18181b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Area type="monotone" dataKey="clicks" name="Total Clicks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#clickGrad)" />
                      <Area type="monotone" dataKey="uniques" name="Unique Visitors" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#uniqueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* 2-Column Grid: Devices & Operating Systems / Browsers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Devices Card */}
              <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-laptop" style={{ color: '#818cf8' }}></i>
                  <span>Device Breakdown</span>
                </h3>
                {devices.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No device data yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {devices.map((d) => (
                      <div key={d.type}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span style={{ textTransform: 'capitalize', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className={`fa-solid ${d.type === 'mobile' ? 'fa-mobile-screen' : d.type === 'tablet' ? 'fa-tablet-screen-button' : 'fa-laptop'}`}></i>
                            {d.type}
                          </span>
                          <span style={{ color: '#a1a1aa' }}>{d.clicks} ({d.percentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.percentage}%`, height: '100%', background: '#6366f1', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Browsers Card */}
              <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-compass" style={{ color: '#8b5cf6' }}></i>
                  <span>Top Browsers</span>
                </h3>
                {browsers.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No browser data yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {browsers.map((b) => (
                      <div key={b.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span style={{ color: '#e4e4e7' }}>{b.name}</span>
                          <span style={{ color: '#a1a1aa' }}>{b.clicks} ({b.percentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${b.percentage}%`, height: '100%', background: '#8b5cf6', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2-Column Grid: Countries & Referrer Sources */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Geographic Card */}
              <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-globe" style={{ color: '#38bdf8' }}></i>
                  <span>Geographic Distribution (Country)</span>
                </h3>
                {countries.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No geographic data yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {countries.map((c) => (
                      <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {c.code}
                          </span>
                          {c.name}
                        </span>
                        <span style={{ color: '#a1a1aa' }}>
                          {c.clicks} clicks ({c.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Referrer Domains Card */}
              <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-share-nodes" style={{ color: '#10b981' }}></i>
                  <span>Traffic Sources & Referrers</span>
                </h3>
                {referrers.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No referrer data recorded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {referrers.map((r) => (
                      <div key={r.domain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#f4f4f5' }}>{r.domain}</span>
                        <span style={{ color: '#a1a1aa' }}>
                          {r.clicks} clicks ({r.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Clicks Audit Stream */}
            <div
              style={{
                background: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                marginBottom: '2rem',
                overflowX: 'auto',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-list-check" style={{ color: '#818cf8' }}></i>
                <span>Recent Click Stream (Last 25 Events)</span>
              </h3>

              {recentClicks.length === 0 ? (
                <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No click events logged yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>Timestamp</th>
                      <th style={{ padding: '8px 12px' }}>Type</th>
                      <th style={{ padding: '8px 12px' }}>Country</th>
                      <th style={{ padding: '8px 12px' }}>Device / OS</th>
                      <th style={{ padding: '8px 12px' }}>Browser</th>
                      <th style={{ padding: '8px 12px' }}>Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClicks.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e4e4e7' }}>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                          {new Date(c.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {c.isBot ? (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                              Bot: {c.botName || 'Crawler'}
                            </span>
                          ) : c.isUnique ? (
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                              Unique Human
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#d4d4d8', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              Repeat
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {c.country || 'Unknown'} {c.city && c.city !== 'Unknown' ? `(${c.city})` : ''}
                        </td>
                        <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>
                          {c.deviceType} / {c.os}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{c.browser}</td>
                        <td style={{ padding: '10px 12px', color: '#a1a1aa' }}>{c.referrerDomain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Privacy & Compliance Notice */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                fontSize: '0.8rem',
                color: '#71717a',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#818cf8' }}></i>
                Privacy, Accuracy & Data Integrity
              </strong>
              Stiknex URL Shortener prioritizes visitor privacy: raw IP addresses are never stored in our database. Unique visitors are estimated server-side using cryptographic salted pseudonymous hashing with rotating salts. Bot, crawler, and automated preview cards are filtered separately to guarantee accurate human click metrics.
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className={Style.modalBackdrop} onClick={() => setEditModalOpen(false)}>
            <div className={Style.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={Style.modalHeader}>
                <h3 className={Style.modalTitle}>Edit Short Link /s/{code}</h3>
                <button type="button" className={Style.closeModalBtn} onClick={() => setEditModalOpen(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdate} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Destination URL</label>
                  <input
                    type="url"
                    className={Style.subInput}
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    required
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Title / Label</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Campaign Tag</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    value={editCampaign}
                    onChange={(e) => setEditCampaign(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className={Style.actionBtn}
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${Style.actionBtn} ${Style.primaryActionBtn}`}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortenerAnalytics;
