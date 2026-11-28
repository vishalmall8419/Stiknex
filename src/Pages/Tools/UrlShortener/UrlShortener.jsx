import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import PageSEO from '../../../Component/SEO/PageSEO';
import Style from './UrlShortener.module.css';
import {
  createShortUrl,
  fetchOwnerLinks,
  updateShortLink,
  deleteShortLink,
  getCsvExportUrl,
} from './urlShortenerApi';

const UrlShortener = () => {
  // Input form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [title, setTitle] = useState('');
  const [campaign, setCampaign] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [expiryOption, setExpiryOption] = useState('never'); // never | 24h | 7d | 30d | custom
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generated Link Success state
  const [newlyCreatedLink, setNewlyCreatedLink] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Link management state
  const [links, setLinks] = useState([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // QR Modal
  const [qrModalLink, setQrModalLink] = useState(null);

  // Fetch Links list
  const loadLinks = useCallback(async () => {
    try {
      setIsLoadingLinks(true);
      const res = await fetchOwnerLinks({
        page,
        limit: 20,
        search,
        status: statusFilter,
        sort: sortBy,
      });
      setLinks(res.links || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLinks(false);
    }
  }, [page, search, statusFilter, sortBy]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  // Handle Shorten Submit
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      let expiresAt = null;
      const now = new Date();
      if (expiryOption === '24h') {
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      } else if (expiryOption === '7d') {
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (expiryOption === '30d') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (expiryOption === 'custom' && customExpiryDate) {
        expiresAt = new Date(customExpiryDate).toISOString();
      }

      const created = await createShortUrl({
        originalUrl: originalUrl.trim(),
        customCode: customCode.trim() || undefined,
        title: title.trim() || undefined,
        campaign: campaign.trim() || undefined,
        utmSource: utmSource.trim() || undefined,
        utmMedium: utmMedium.trim() || undefined,
        utmCampaign: utmCampaign.trim() || undefined,
        utmTerm: utmTerm.trim() || undefined,
        utmContent: utmContent.trim() || undefined,
        expiresAt,
      });

      setNewlyCreatedLink(created);
      setOriginalUrl('');
      setCustomCode('');
      setTitle('');
      setCampaign('');
      setUtmSource('');
      setUtmMedium('');
      setUtmCampaign('');
      setUtmTerm('');
      setUtmContent('');
      setExpiryOption('never');
      setShowAdvanced(false);

      // Reload list
      loadLinks();
    } catch (err) {
      setErrorMessage(err.message || 'Error creating short URL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (shortUrl, code) => {
    const full = `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(full);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleDisabled = async (link) => {
    try {
      await updateShortLink(link.shortCode, { disabled: !link.disabled });
      loadLinks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm(`Are you sure you want to permanently delete short link /s/${shortCode} and all its analytics?`)) {
      return;
    }
    try {
      await deleteShortLink(shortCode);
      loadLinks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={Style.pageWrapper}>
      <PageSEO
        title="Free URL Shortener with Real-Time Analytics & Click Tracking | Stiknex"
        description="Shorten long links, track real-time clicks, unique visitors, geo locations, referrers, and campaign UTM performance. Free, privacy-friendly, zero signup required."
        path="/url-shortener"
        type="webapp"
        keywords="url shortener, link shortener, click tracking, url analytics, utm campaign tracking, qr code generator, free link shortener"
      />

      <div className={Style.container}>
        {/* Header */}
        <header className={Style.headerSection}>
          <div className={Style.badge}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Real-Time Server-Side Analytics & Bot Detection</span>
          </div>
          <h1 className={Style.title}>
            Smart <span className={Style.titleGradient}>URL Shortener</span> & Click Analytics
          </h1>
          <p className={Style.subtitle}>
            Shorten links, track every human and unique click, monitor referrers and countries in real-time,
            and build UTM campaigns without signing up.
          </p>
        </header>

        {/* Shortener Form Card */}
        <div className={Style.shortenCard}>
          <form onSubmit={handleShorten}>
            <div className={Style.primaryInputRow}>
              <div className={Style.urlInputWrap}>
                <i className={`fa-solid fa-link ${Style.inputIcon}`}></i>
                <input
                  type="url"
                  className={Style.mainInput}
                  placeholder="Paste your long destination URL (e.g. https://yourwebsite.com/article...)"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={Style.submitBtn}
                disabled={isSubmitting || !originalUrl.trim()}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-scissors"></i>
                    <span>Shorten URL</span>
                  </>
                )}
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className={Style.errorBanner}>
                <i className={`fa-solid fa-triangle-exclamation ${Style.errorIcon}`}></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Advanced Options Toggle */}
            <button
              type="button"
              className={Style.accordionToggle}
              onClick={() => setShowAdvanced((v) => !v)}
            >
              <i className={`fa-solid ${showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Custom Alias, UTM Tags & Expiration'}</span>
            </button>

            {/* Advanced Grid */}
            {showAdvanced && (
              <div className={Style.advancedGrid}>
                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Custom Alias (Optional)</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. launch2026"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Link Title / Label</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. Product Hunt Launch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Campaign Name</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. Summer Promo"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Expiration</label>
                  <select
                    className={Style.subInput}
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}
                  >
                    <option value="never">Never Expire</option>
                    <option value="24h">After 24 Hours</option>
                    <option value="7d">After 7 Days</option>
                    <option value="30d">After 30 Days</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>

                {expiryOption === 'custom' && (
                  <div className={Style.formGroup}>
                    <label className={Style.formLabel}>Pick Expiry Date</label>
                    <input
                      type="datetime-local"
                      className={Style.subInput}
                      value={customExpiryDate}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                    />
                  </div>
                )}

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>UTM Source</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. twitter, newsletter"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>UTM Medium</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. social, cpc, email"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                  />
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>UTM Campaign</label>
                  <input
                    type="text"
                    className={Style.subInput}
                    placeholder="e.g. spring_sale"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Newly Created Link Result Callout */}
          {newlyCreatedLink && (
            <div className={Style.resultCallout}>
              <div className={Style.resultLeft}>
                <span className={Style.resultTitle}>
                  <i className={`fa-solid fa-circle-check ${Style.successIcon}`}></i>
                  Short Link Ready
                </span>
                <a
                  href={`/s/${newlyCreatedLink.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={Style.shortLinkUrl}
                >
                  {`${window.location.origin}/s/${newlyCreatedLink.shortCode}`}
                </a>
              </div>
              <div className={Style.resultActions}>
                <button
                  type="button"
                  className={`${Style.actionBtn} ${copiedCode === newlyCreatedLink.shortCode ? Style.primaryActionBtn : ''}`}
                  onClick={() => copyToClipboard(newlyCreatedLink.shortCode, newlyCreatedLink.shortCode)}
                >
                  <i className={`fa-solid ${copiedCode === newlyCreatedLink.shortCode ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedCode === newlyCreatedLink.shortCode ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  className={Style.actionBtn}
                  onClick={() => setQrModalLink(newlyCreatedLink)}
                >
                  <i className="fa-solid fa-qrcode"></i>
                  <span>QR Code</span>
                </button>
                <Link
                  to={`/url-shortener/analytics/${newlyCreatedLink.shortCode}`}
                  className={`${Style.actionBtn} ${Style.primaryActionBtn}`}
                >
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>View Real-Time Analytics</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Links Management Section */}
        <section>
          <div className={Style.sectionHeader}>
            <h2 className={Style.sectionTitle}>
              <i className={`fa-solid fa-link ${Style.sectionIcon}`}></i>
              <span>My Links & Performance</span>
            </h2>

            <div className={Style.controlsRow}>
              <input
                type="text"
                className={Style.searchInput}
                placeholder="Search links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className={Style.selectInput}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired</option>
                <option value="disabled">Disabled</option>
              </select>

              <select
                className={Style.selectInput}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="clicks">Most Clicks</option>
                <option value="last_clicked">Recently Clicked</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button
                type="button"
                className={Style.actionBtn}
                onClick={loadLinks}
                title="Refresh list"
              >
                <i className={`fa-solid fa-rotate ${isLoadingLinks ? 'fa-spin' : ''}`}></i>
              </button>
            </div>
          </div>

          {/* Links List */}
          {isLoadingLinks && links.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <i className="fa-solid fa-circle-notch fa-spin fa-2x" style={{ color: '#6366f1' }}></i>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Loading your short links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className={Style.emptyState}>
              <i className={`fa-solid fa-link-slash ${Style.emptyIcon}`}></i>
              <h3 className={Style.emptyTitle}>No Short Links Found</h3>
              <p className={Style.emptyDesc}>
                Paste any destination URL into the box above to generate your first short URL with live click tracking!
              </p>
            </div>
          ) : (
            <div className={Style.linksGrid}>
              {links.map((link) => {
                const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                const fullUrl = `${window.location.origin}/s/${link.shortCode}`;

                return (
                  <div key={link._id} className={Style.linkCard}>
                    <div className={Style.linkCardMain}>
                      <div className={Style.linkTitleRow}>
                        <h4 className={Style.linkTitle}>
                          {link.title || link.shortCode}
                        </h4>
                        {link.disabled ? (
                          <span className={`${Style.statusBadge} ${Style.badgeDisabled}`}>Disabled</span>
                        ) : isExpired ? (
                          <span className={`${Style.statusBadge} ${Style.badgeExpired}`}>Expired</span>
                        ) : (
                          <span className={`${Style.statusBadge} ${Style.badgeActive}`}>Active</span>
                        )}
                        {link.campaign && (
                          <span className={Style.campaignBadge}>
                            #{link.campaign}
                          </span>
                        )}
                      </div>

                      <div className={Style.shortUrlRow}>
                        <a
                          href={`/s/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={Style.shortLinkText}
                        >
                          {fullUrl}
                        </a>
                        <button
                          type="button"
                          className={Style.copyIconBtn}
                          onClick={() => copyToClipboard(fullUrl, link.shortCode)}
                          title="Copy link"
                        >
                          <i
                            className={`fa-solid ${
                              copiedCode === link.shortCode ? 'fa-check' : 'fa-copy'
                            }`}
                            style={{ color: copiedCode === link.shortCode ? '#4ade80' : 'inherit' }}
                          ></i>
                        </button>
                      </div>

                      <span className={Style.originalUrlText} title={link.originalUrl}>
                        <i className="fa-solid fa-arrow-turn-down-right" style={{ marginRight: '6px', opacity: 0.7 }}></i>
                        {link.originalUrl}
                      </span>
                    </div>

                    <div className={Style.linkCardStats}>
                      <div className={Style.statItem}>
                        <span className={Style.statNum}>{link.clicks || 0}</span>
                        <span className={Style.statLabel}>Total Clicks</span>
                      </div>
                      <div className={Style.statItem}>
                        <span className={Style.statNum} style={{ color: '#818cf8' }}>
                          {link.uniqueClicks || 0}
                        </span>
                        <span className={Style.statLabel}>Unique Visitors</span>
                      </div>
                    </div>

                    <div className={Style.linkCardActions}>
                      <Link
                        to={`/url-shortener/analytics/${link.shortCode}`}
                        className={`${Style.actionBtn} ${Style.primaryActionBtn}`}
                        title="View Detailed Analytics"
                      >
                        <i className="fa-solid fa-chart-simple"></i>
                        <span>Analytics</span>
                      </Link>

                      <button
                        type="button"
                        className={Style.actionBtn}
                        onClick={() => setQrModalLink(link)}
                        title="Show QR Code"
                      >
                        <i className="fa-solid fa-qrcode"></i>
                      </button>

                      <button
                        type="button"
                        className={Style.actionBtn}
                        onClick={() => handleToggleDisabled(link)}
                        title={link.disabled ? 'Enable link' : 'Disable link'}
                      >
                        <i className={`fa-solid ${link.disabled ? 'fa-toggle-off' : 'fa-toggle-on'}`} style={{ color: link.disabled ? '#71717a' : '#4ade80' }}></i>
                      </button>

                      <a
                        href={getCsvExportUrl(link.shortCode)}
                        className={Style.actionBtn}
                        title="Download CSV report"
                        download
                      >
                        <i className="fa-solid fa-download"></i>
                      </a>

                      <button
                        type="button"
                        className={Style.actionBtn}
                        onClick={() => handleDelete(link.shortCode)}
                        title="Delete link"
                        style={{ color: '#f87171' }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* QR Code Modal */}
        {qrModalLink && (
          <div className={Style.modalBackdrop} onClick={() => setQrModalLink(null)}>
            <div className={Style.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={Style.modalHeader}>
                <h3 className={Style.modalTitle}>QR Code for /{qrModalLink.shortCode}</h3>
                <button
                  type="button"
                  className={Style.closeModalBtn}
                  onClick={() => setQrModalLink(null)}
                >
                  ✕
                </button>
              </div>

              <div className={Style.qrContainer}>
                <QRCode
                  value={`${window.location.origin}/s/${qrModalLink.shortCode}`}
                  size={200}
                />
              </div>

              <p className={Style.qrDescription}>
                Scan to instantly redirect to: <br />
                <span className={Style.qrDestination}>{qrModalLink.originalUrl}</span>
              </p>

              <button
                type="button"
                className={`${Style.actionBtn} ${Style.primaryActionBtn}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setQrModalLink(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
