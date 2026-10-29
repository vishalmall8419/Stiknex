import React, { useState, useEffect } from 'react';
import Style from './TranslationModal.module.css';

const LANGUAGES = [
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'en', name: 'English' },
];

export async function translateText(text, targetLang = 'es') {
  if (!text || !text.trim()) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    targetLang
  )}&dt=t&q=${encodeURIComponent(text.trim())}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Translation service unavailable. Please check your internet connection.');
  }

  const data = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const translated = data[0].map((item) => item[0]).join('');
    return translated;
  }
  throw new Error('Unable to parse translation result.');
}

const TranslationModal = ({
  isOpen,
  onClose,
  initialText = '',
  darkMode = false,
  onReplaceText,
  onInsertBelow,
}) => {
  const [sourceText, setSourceText] = useState(initialText);
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSourceText(initialText || '');
      setTranslatedText('');
      setError(null);
      if (initialText && initialText.trim().length > 0) {
        handleTranslate(initialText, targetLang);
      }
    }
  }, [isOpen, initialText]);

  const handleTranslate = async (textToTranslate = sourceText, lang = targetLang) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await translateText(textToTranslate, lang);
      setTranslatedText(result);
    } catch (err) {
      setError(err.message || 'Failed to translate.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={Style.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${Style.modal} ${darkMode ? Style.darkModal : ''}`} role="dialog" aria-modal="true">
        <div className={Style.header}>
          <div className={Style.headerTitle}>
            <i className={`fa-solid fa-language ${Style.headerIcon}`}></i>
            <span>Translate Text</span>
          </div>
          <button type="button" className={Style.closeBtn} onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={Style.controlsRow}>
          <label className={Style.langLabel}>
            <span>Translate to:</span>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                handleTranslate(sourceText, e.target.value);
              }}
              className={Style.select}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={Style.refreshBtn}
            onClick={() => handleTranslate()}
            disabled={loading}
            title="Re-translate"
          >
            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
            <span>Translate</span>
          </button>
        </div>

        <div className={Style.panesGrid}>
          {/* Original Text */}
          <div className={Style.pane}>
            <div className={Style.paneHeader}>Original Text</div>
            <textarea
              className={Style.textarea}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter or select text to translate..."
              rows={5}
            />
          </div>

          {/* Translated Text Preview */}
          <div className={Style.pane}>
            <div className={Style.paneHeader}>
              <span>Translated Result</span>
              {translatedText && (
                <button type="button" className={Style.copySmallBtn} onClick={handleCopy}>
                  <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className={`${Style.resultArea} ${loading ? Style.loadingArea : ''}`}>
              {loading ? (
                <div className={Style.spinnerWrapper}>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Translating with AI...</span>
                </div>
              ) : error ? (
                <div className={Style.errorMsg}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              ) : (
                <div className={Style.resultText}>
                  {translatedText || <span className={Style.placeholder}>Translation preview will appear here...</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={Style.footer}>
          <button type="button" className={Style.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <div className={Style.actionsGroup}>
            {onInsertBelow && (
              <button
                type="button"
                className={Style.secondaryBtn}
                disabled={!translatedText || loading}
                onClick={() => {
                  onInsertBelow(translatedText);
                  onClose();
                }}
              >
                <i className="fa-solid fa-arrow-down"></i>
                <span>Insert Below</span>
              </button>
            )}

            {onReplaceText && (
              <button
                type="button"
                className={Style.primaryBtn}
                disabled={!translatedText || loading}
                onClick={() => {
                  onReplaceText(translatedText);
                  onClose();
                }}
              >
                <i className="fa-solid fa-check"></i>
                <span>Replace Original Text</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;

