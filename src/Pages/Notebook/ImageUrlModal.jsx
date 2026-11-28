import React, { useState } from 'react';
import Style from './ImageUrlModal.module.css';

const ImageUrlModal = ({ isOpen, onClose, onInsert, darkMode }) => {
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [alignment, setAlignment] = useState('center'); // 'left' | 'center' | 'right' | 'full'
  const [width, setWidth] = useState('100%');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setError('Please provide a valid image URL.');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
      setError('URL must start with http://, https://, or data:image/');
      return;
    }

    onInsert({
      url: cleanUrl,
      alt: altText.trim() || 'Notebook Image',
      alignment,
      width: width.trim() || '100%',
    });

    setUrl('');
    setAltText('');
    setAlignment('center');
    setWidth('100%');
    setError('');
    onClose();
  };

  return (
    <div className={Style.backdrop} onClick={onClose}>
      <div
        className={`${Style.modal} ${darkMode ? Style.darkModal : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="imageUrlModalTitle"
      >
        <div className={Style.header}>
          <div className={Style.headerLeft}>
            <div className={Style.iconBadge}>
              <i className="fa-solid fa-link"></i>
            </div>
            <div>
              <h2 id="imageUrlModalTitle" className={Style.title}>Insert Image from URL</h2>
              <p className={Style.subtitle}>Add web images directly into your notebook</p>
            </div>
          </div>
          <button type="button" className={Style.closeBtn} onClick={onClose} aria-label="Close dialog">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={Style.form}>
          <div className={Style.inputGroup}>
            <label className={Style.label}>Image Web Address (URL) *</label>
            <input
              type="url"
              className={Style.input}
              placeholder="https://example.com/photo.jpg"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              required
            />
            {error && <p className={Style.errorText}>{error}</p>}
          </div>

          <div className={Style.inputGroup}>
            <label className={Style.label}>Alt Text / Description (Optional)</label>
            <input
              type="text"
              className={Style.input}
              placeholder="e.g. Project Architecture Diagram"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          <div className={Style.row}>
            <div className={Style.halfGroup}>
              <label className={Style.label}>Alignment</label>
              <div className={Style.alignOptions}>
                {[
                  { id: 'left', icon: 'fa-align-left', label: 'Left' },
                  { id: 'center', icon: 'fa-align-center', label: 'Center' },
                  { id: 'right', icon: 'fa-align-right', label: 'Right' },
                  { id: 'full', icon: 'fa-expand', label: 'Full' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${Style.alignBtn} ${alignment === opt.id ? Style.activeAlignBtn : ''}`}
                    onClick={() => setAlignment(opt.id)}
                    title={opt.label}
                  >
                    <i className={`fa-solid ${opt.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className={Style.halfGroup}>
              <label className={Style.label}>Width</label>
              <select
                className={Style.select}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              >
                <option value="100%">Full Width (100%)</option>
                <option value="75%">Medium-Large (75%)</option>
                <option value="50%">Half Width (50%)</option>
                <option value="35%">Compact (35%)</option>
              </select>
            </div>
          </div>

          {url.trim().length > 10 && (
            <div className={Style.previewBox}>
              <span className={Style.previewLabel}>Preview</span>
              <img
                src={url.trim()}
                alt={altText || 'Preview'}
                className={Style.previewImg}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                onLoad={(e) => {
                  e.target.style.display = 'block';
                }}
              />
            </div>
          )}

          <div className={Style.actions}>
            <button type="button" className={Style.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={Style.btnPrimary}>
              <i className="fa-solid fa-cloud-arrow-down"></i>
              <span>Insert Image</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUrlModal;

