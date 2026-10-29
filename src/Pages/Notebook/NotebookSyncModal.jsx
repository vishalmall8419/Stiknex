import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'react-qr-code';
import swal from 'sweetalert';
import Style from './NotebookSyncModal.module.css';
import {
  getSyncIdentity,
  enableCloudSync,
  connectWithRecoveryKey,
  createQRPairingSession,
  checkPairingStatus,
  transferPairingCredentials,
  revokeDevice,
  clearSyncIdentity,
  pullFromCloud,
} from './notebookSyncManager';

const NotebookSyncModal = ({ isOpen, onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'devices' | 'recovery'
  const [identity, setIdentity] = useState(getSyncIdentity);
  const [loading, setLoading] = useState(false);

  // QR Pairing Session State
  const [pairingSession, setPairingSession] = useState(null);
  const [pairingStatus, setPairingStatus] = useState('idle'); // 'generating' | 'waiting' | 'claimed' | 'completed' | 'expired' | 'error'
  const [pairingError, setPairingError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [copiedLink, setCopiedLink] = useState(false);
  const pollTimerRef = useRef(null);

  // Manual Recovery Input
  const [manualKey, setManualKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleEnableSync = useCallback(async () => {
    setLoading(true);
    try {
      const newIdentity = await enableCloudSync();
      setIdentity(newIdentity);
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to enable cloud sync: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const initQRSession = useCallback(async () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setPairingStatus('generating');
    setPairingError(null);
    try {
      const session = await createQRPairingSession();
      setPairingSession(session);
      setPairingStatus('waiting');
      setTimeLeft(300);

      // Start polling for claim with transient retry resilience
      let consecutive404s = 0;
      pollTimerRef.current = setInterval(async () => {
        try {
          const res = await checkPairingStatus(session.pairingId);
          if (res.status === 'claimed' && res.claimedDevice) {
            setPairingStatus('claimed');
            clearInterval(pollTimerRef.current);

            // Transfer encrypted credentials to claimed device
            await transferPairingCredentials(session.pairingId, session.pairingCryptoKey, res.claimedDevice);
            setPairingStatus('completed');

            // Refresh device list
            const pullRes = await pullFromCloud();
            if (pullRes?.devices) {
              setIdentity((prev) => (prev ? { ...prev, devices: pullRes.devices } : prev));
            }

            swal({
              title: 'Device Connected!',
              text: `"${res.claimedDevice.deviceName}" is now synced with your notebook.`,
              icon: 'success',
              timer: 3000,
            });
          } else if (res.status === 'expired') {
            // Only expire if server confirms session was explicitly marked expired
            setPairingStatus('expired');
            clearInterval(pollTimerRef.current);
          }
        } catch (e) {
          console.warn('Pairing check transient poll notice:', e);
        }
      }, 1500);
    } catch (err) {
      console.error('initQRSession error:', err);
      setPairingStatus('error');
      setPairingError(err.message || 'Could not connect to sync service.');
    }
  }, []);

  // Reload sync identity when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const cur = getSyncIdentity();
    if (!cur) {
      handleEnableSync();
    } else {
      pullFromCloud(cur).then((res) => {
        if (res?.devices) {
          setIdentity((prev) => (prev ? { ...prev, devices: res.devices } : prev));
        }
      });
    }
  }, [isOpen, handleEnableSync]);

  // Start QR Pairing session when QR tab is opened
  useEffect(() => {
    if (isOpen && activeTab === 'qr' && identity) {
      initQRSession();
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isOpen, activeTab, identity?.syncGroupId, initQRSession]);

  // Timer countdown
  useEffect(() => {
    if (!pairingSession || pairingStatus === 'completed' || pairingStatus === 'expired') return;
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.floor((pairingSession.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setPairingStatus('expired');
        clearInterval(pollTimerRef.current);
        clearInterval(t);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [pairingSession, pairingStatus]);

  const handleCopyLink = () => {
    if (!pairingSession?.pairingUrl) return;
    navigator.clipboard.writeText(pairingSession.pairingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyKey = () => {
    if (!identity?.rawKeyHex) return;
    navigator.clipboard.writeText(identity.rawKeyHex);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleManualConnect = async (e) => {
    e.preventDefault();
    if (!manualKey || manualKey.trim().length !== 64) {
      swal('Invalid Key', 'A valid recovery key must be exactly 64 hexadecimal characters.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const newIdentity = await connectWithRecoveryKey(manualKey.trim());
      setIdentity(newIdentity);
      setManualKey('');
      swal('Connected!', 'Successfully linked to your existing notebook sync group.', 'success');
      onClose();
    } catch (err) {
      swal('Connection Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (targetDeviceId, targetName) => {
    const confirm = await swal({
      title: 'Revoke Device?',
      text: `Are you sure you want to unlink "${targetName}"? It will no longer receive or push sync updates.`,
      icon: 'warning',
      buttons: ['Cancel', 'Revoke'],
      dangerMode: true,
    });

    if (confirm) {
      setLoading(true);
      try {
        await revokeDevice(targetDeviceId);
        setIdentity((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            devices: (prev.devices || []).filter((d) => d.deviceId !== targetDeviceId),
          };
        });
        swal('Revoked', 'The device has been successfully unlinked.', 'success');
      } catch (err) {
        swal('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportBackup = async () => {
    try {
      const localNotes = localStorage.getItem('stiknex_notebooks') || '[]';
      const backupData = {
        app: 'Stiknex Notebook Backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        identity: identity ? { syncGroupId: identity.syncGroupId, rawKeyHex: identity.rawKeyHex } : null,
        notebooks: JSON.parse(localNotes),
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stiknex_notebook_backup_${new Date().toISOString().slice(0, 10)}.stikbackup`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      swal('Export Failed', err.message, 'error');
    }
  };

  const handleDisconnect = async () => {
    const confirm = await swal({
      title: 'Disconnect Cloud Sync?',
      text: 'Your notes will stay saved locally on this computer, but new changes will no longer sync with other devices.',
      icon: 'warning',
      buttons: ['Cancel', 'Disconnect'],
      dangerMode: true,
    });

    if (confirm) {
      clearSyncIdentity();
      setIdentity(null);
      swal('Disconnected', 'Cloud sync has been turned off for this device.', 'info');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={Style.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${Style.modal} ${darkMode ? Style.darkModal : ''}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={Style.header}>
          <div className={Style.headerTitle}>
            <i className={`fa-solid fa-cloud-arrow-up ${Style.headerIcon}`}></i>
            <span>Multi-Device Cloud Sync</span>
          </div>
          <button type="button" className={Style.closeBtn} onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={Style.tabs}>
          <button
            type="button"
            className={`${Style.tabBtn} ${activeTab === 'qr' ? Style.activeTab : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <i className="fa-solid fa-qrcode"></i>
            <span>Connect Device</span>
          </button>
          <button
            type="button"
            className={`${Style.tabBtn} ${activeTab === 'devices' ? Style.activeTab : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <i className="fa-solid fa-laptop-mobile"></i>
            <span>Paired Devices ({identity?.devices?.length || 1})</span>
          </button>
          <button
            type="button"
            className={`${Style.tabBtn} ${activeTab === 'recovery' ? Style.activeTab : ''}`}
            onClick={() => setActiveTab('recovery')}
          >
            <i className="fa-solid fa-key"></i>
            <span>Recovery & Backup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className={Style.body}>
          {/* Security Banner */}
          <div className={Style.securityBadge}>
            <i className="fa-solid fa-shield-halved"></i>
            <span>End-to-End Encrypted (AES-256-GCM). Zero-knowledge cloud storage.</span>
          </div>

          {/* TAB 1: QR CODE PAIRING */}
          {activeTab === 'qr' && (
            <div className={Style.qrCard}>
              <p style={{ fontSize: '13px', margin: 0, color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Scan this single-use pairing code with your phone or second device camera to instantly sync all notes.
              </p>

              {pairingStatus === 'generating' ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', color: '#6366f1', marginBottom: '14px' }}></i>
                  <p style={{ fontSize: '14px', color: darkMode ? '#a1a1aa' : '#64748b', fontWeight: 500, margin: 0 }}>
                    Generating secure QR pairing code...
                  </p>
                </div>
              ) : pairingStatus === 'expired' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                    Pairing code expired (5-minute safety limit)
                  </p>
                  <button type="button" className={Style.btnPrimary} onClick={initQRSession}>
                    <i className="fa-solid fa-rotate-right"></i>
                    <span>Generate New Code</span>
                  </button>
                </div>
              ) : pairingSession?.pairingUrl ? (
                <>
                  <div className={Style.qrContainer}>
                    <QRCode
                      value={pairingSession.pairingUrl}
                      size={180}
                      level="M"
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    />
                  </div>

                  <div className={Style.statusIndicator}>
                    {pairingStatus === 'waiting' && (
                      <>
                        <span className={Style.pulseDot}></span>
                        <span>Waiting for device scan...</span>
                      </>
                    )}
                    {pairingStatus === 'claimed' && (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" style={{ color: '#6366f1' }}></i>
                        <span>Device detected! Transferring encrypted key...</span>
                      </>
                    )}
                    {pairingStatus === 'completed' && (
                      <>
                        <i className="fa-solid fa-circle-check" style={{ color: '#22c55e' }}></i>
                        <span>Pairing successful!</span>
                      </>
                    )}
                  </div>

                  <div className={Style.qrTimer}>
                    <i className="fa-regular fa-clock"></i>
                    <span>
                      Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className={Style.copyLinkRow}>
                    <input
                      type="text"
                      readOnly
                      value={pairingSession.pairingUrl}
                      className={Style.inputField}
                    />
                    <button type="button" className={Style.btnPrimary} onClick={handleCopyLink}>
                      <i className={`fa-solid ${copiedLink ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>
                    {pairingError || "Failed to generate pairing code. Please try again."}
                  </p>
                  <button type="button" className={Style.btnPrimary} onClick={initQRSession}>
                    <i className="fa-solid fa-rotate-right"></i>
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAIRED DEVICES */}
          {activeTab === 'devices' && (
            <div className={Style.deviceList}>
              <p style={{ fontSize: '13px', margin: 0, color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Devices authorized to decrypt and sync your notebook:
              </p>

              {(identity?.devices && identity.devices.length > 0 ? identity.devices : [{
                deviceId: identity?.deviceId,
                deviceName: identity?.deviceName || 'This Device',
                lastActiveAt: identity?.lastSyncTime || null,
              }]).map((dev) => {
                const isCurrent = dev.deviceId === identity?.deviceId;
                return (
                  <div key={dev.deviceId} className={Style.deviceItem}>
                    <div className={Style.deviceInfo}>
                      <i className={`fa-solid ${dev.deviceName?.includes('iOS') || dev.deviceName?.includes('Android') ? 'fa-mobile-screen' : 'fa-laptop'} ${Style.deviceIcon}`}></i>
                      <div>
                        <div className={Style.deviceName}>
                          <span>{dev.deviceName}</span>
                          {isCurrent && <span className={Style.thisDeviceBadge}>This Device</span>}
                        </div>
                        <div className={Style.deviceMeta}>
                          {dev.lastActiveAt ? `Active ${new Date(dev.lastActiveAt).toLocaleDateString()} at ${new Date(dev.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Active recently'}
                        </div>
                      </div>
                    </div>
                    {!isCurrent && (
                      <button
                        type="button"
                        className={Style.revokeBtn}
                        onClick={() => handleRevoke(dev.deviceId, dev.deviceName)}
                        title="Unlink device"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  className={Style.btnSecondary}
                  style={{ flex: 1 }}
                  onClick={() => pullFromCloud().then(() => swal('Synced', 'Notes updated from cloud.', 'success'))}
                >
                  <i className="fa-solid fa-rotate"></i>
                  <span>Sync Now</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RECOVERY & BACKUP */}
          {activeTab === 'recovery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={Style.recoveryCard}>
                <div className={Style.recoveryWarning}>
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Your Master Recovery Key</span>
                </div>
                <p style={{ fontSize: '12px', margin: 0, color: darkMode ? '#e4e4e7' : '#4b5563' }}>
                  Keep this key secret. Anyone with this key can decrypt your notes on any device.
                </p>
                <div className={Style.recoveryKeyText}>
                  {showKey
                    ? identity?.rawKeyHex
                    : (identity?.rawKeyHex ? identity.rawKeyHex.substring(0, 12) + '••••••••••••••••••••••••••••••••••••••••••••' + identity.rawKeyHex.substring(56) : 'Not generated')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={Style.btnSecondary}
                    onClick={() => setShowKey((v) => !v)}
                  >
                    <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    <span>{showKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                  <button type="button" className={Style.btnSecondary} onClick={handleCopyKey}>
                    <i className={`fa-solid ${copiedKey ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>

              {/* Manual Connect Form */}
              <form onSubmit={handleManualConnect} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600 }}>Connect with Recovery Key</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Paste 64-character hex key..."
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                    className={Style.inputField}
                  />
                  <button type="submit" className={Style.btnPrimary} disabled={loading}>
                    <span>Connect</span>
                  </button>
                </div>
              </form>

              {/* Export / Import Backup */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={Style.btnSecondary}
                  style={{ flex: 1 }}
                  onClick={handleExportBackup}
                >
                  <i className="fa-solid fa-download"></i>
                  <span>Export Backup (.stikbackup)</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className={Style.dangerSection}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Disconnect Sync</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Stop syncing this device with the cloud</div>
                </div>
                <button type="button" className={Style.dangerBtn} onClick={handleDisconnect}>
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookSyncModal;

