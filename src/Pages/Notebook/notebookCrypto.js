// Client-Side Zero-Knowledge End-to-End Encryption (E2EE) using Web Crypto API
// Algorithm: AES-256-GCM with 96-bit (12-byte) cryptographically secure random nonces

const AES_ALGO = { name: 'AES-GCM', length: 256 };

/**
 * Converts an ArrayBuffer to a hex string
 */
export function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string to an ArrayBuffer
 */
export function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Converts an ArrayBuffer to standard base64 string
 */
export function bufToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts a base64 string to an ArrayBuffer
 */
export function base64ToBuf(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generates a SHA-256 hex digest of a string
 */
export async function sha256Hex(str) {
  const enc = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', enc.encode(str));
  return bufToHex(digest);
}

/**
 * Generates a brand new 256-bit AES-GCM Master Sync Key
 */
export async function generateSyncKey() {
  const cryptoKey = await window.crypto.subtle.generateKey(AES_ALGO, true, ['encrypt', 'decrypt']);
  const rawKey = await window.crypto.subtle.exportKey('raw', cryptoKey);
  const rawKeyHex = bufToHex(rawKey);

  // Derive syncGroupId from rawKeyHex (one-way SHA-256 hash)
  // Server stores syncGroupId, but can never derive rawKeyHex from it!
  const syncGroupId = await sha256Hex(`stiknex:sync-group-v1:${rawKeyHex}`);

  return { cryptoKey, rawKeyHex, syncGroupId };
}

/**
 * Imports a raw hex string (Recovery Key) into an AES-GCM CryptoKey
 */
export async function importSyncKey(rawKeyHex) {
  const cleanHex = rawKeyHex.replace(/[\s-]/g, '').toLowerCase();
  if (cleanHex.length !== 64) {
    throw new Error('Recovery Key must be exactly 64 hexadecimal characters.');
  }

  const keyBuf = hexToBuf(cleanHex);
  const cryptoKey = await window.crypto.subtle.importKey('raw', keyBuf, AES_ALGO, true, ['encrypt', 'decrypt']);
  const syncGroupId = await sha256Hex(`stiknex:sync-group-v1:${cleanHex}`);

  return { cryptoKey, rawKeyHex: cleanHex, syncGroupId };
}

/**
 * Derives a device authorization token from the sync key and device ID
 */
export async function deriveDeviceToken(rawKeyHex, deviceId) {
  return sha256Hex(`stiknex:device-token-v1:${rawKeyHex}:${deviceId}`);
}

/**
 * Encrypts arbitrary JS object or string using AES-256-GCM
 * Returns { ciphertext: base64, iv: base64 }
 */
export async function encryptData(data, cryptoKey) {
  const enc = new TextEncoder();
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
  const plainBytes = enc.encode(jsonStr);

  // 12-byte (96-bit) cryptographically random IV for GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    plainBytes
  );

  return {
    ciphertext: bufToBase64(cipherBuffer),
    iv: bufToBase64(iv.buffer),
  };
}

/**
 * Decrypts { ciphertext: base64, iv: base64 } using AES-256-GCM
 * Returns the parsed JSON or string
 */
export async function decryptData(ciphertextBase64, ivBase64, cryptoKey) {
  const cipherBuf = base64ToBuf(ciphertextBase64);
  const ivBuf = base64ToBuf(ivBase64);

  const dec = new TextDecoder();
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(ivBuf) },
    cryptoKey,
    cipherBuf
  );

  const plainStr = dec.decode(plainBuffer);
  try {
    return JSON.parse(plainStr);
  } catch {
    return plainStr;
  }
}

/**
 * Generates an ephemeral pairing key for single-use QR transfer
 */
export async function generatePairingKey() {
  const key = await window.crypto.subtle.generateKey(AES_ALGO, true, ['encrypt', 'decrypt']);
  const raw = await window.crypto.subtle.exportKey('raw', key);
  return {
    cryptoKey: key,
    pairingKeyHex: bufToHex(raw),
  };
}

/**
 * Imports an ephemeral pairing key from hex
 */
export async function importPairingKey(pairingKeyHex) {
  const keyBuf = hexToBuf(pairingKeyHex.replace(/[\s-]/g, '').toLowerCase());
  return window.crypto.subtle.importKey('raw', keyBuf, AES_ALGO, true, ['encrypt', 'decrypt']);
}

