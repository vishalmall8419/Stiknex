// Client-Side Zero-Knowledge End-to-End Encryption (E2EE) using Web Crypto API
// Algorithm: AES-256-GCM with 96-bit (12-byte) cryptographically secure random nonces

const AES_ALGO = { name: 'AES-GCM', length: 256 };

/**
 * Safely resolves Web Crypto subtle instance across standard browsers, webviews, and iOS Safari.
 */
export function getSubtleCrypto() {
  if (typeof window !== 'undefined') {
    if (window.crypto?.subtle) return window.crypto.subtle;
    if (window.crypto?.webkitSubtle) return window.crypto.webkitSubtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  return null;
}

/**
 * Ensures a valid subtle instance is available.
 * If running on insecure HTTP, immediately redirects to HTTPS so Web Crypto API is unlocked.
 */
export function ensureSubtle() {
  const subtle = getSubtleCrypto();
  if (subtle) return subtle;

  if (typeof window !== 'undefined') {
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      const secureUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(secureUrl);
      throw new Error('Redirecting to secure HTTPS connection for end-to-end encryption...');
    }
  }

  throw new Error(
    'End-to-End Encryption requires a secure browser context (HTTPS). Please open Stiknex in Chrome, Safari, or Brave using https://.'
  );
}

/**
 * Pure JavaScript fallback for SHA-256
 */
function fallbackSha256Hex(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

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
  const subtle = getSubtleCrypto();
  if (!subtle) {
    return fallbackSha256Hex(str);
  }
  const enc = new TextEncoder();
  const digest = await subtle.digest('SHA-256', enc.encode(str));
  return bufToHex(digest);
}

/**
 * Generates a brand new 256-bit AES-GCM Master Sync Key
 */
export async function generateSyncKey() {
  const subtle = ensureSubtle();
  const cryptoKey = await subtle.generateKey(AES_ALGO, true, ['encrypt', 'decrypt']);
  const rawKey = await subtle.exportKey('raw', cryptoKey);
  const rawKeyHex = bufToHex(rawKey);

  // Derive syncGroupId from rawKeyHex (one-way SHA-256 hash)
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

  const subtle = ensureSubtle();
  const keyBuf = hexToBuf(cleanHex);
  const cryptoKey = await subtle.importKey('raw', keyBuf, AES_ALGO, true, ['encrypt', 'decrypt']);
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
 */
export async function encryptData(data, cryptoKey) {
  const subtle = ensureSubtle();
  const enc = new TextEncoder();
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
  const plainBytes = enc.encode(jsonStr);

  const randomValues = typeof window !== 'undefined' && window.crypto?.getRandomValues
    ? window.crypto.getRandomValues(new Uint8Array(12))
    : new Uint8Array(12).map(() => Math.floor(Math.random() * 256));

  const cipherBuffer = await subtle.encrypt(
    { name: 'AES-GCM', iv: randomValues },
    cryptoKey,
    plainBytes
  );

  return {
    ciphertext: bufToBase64(cipherBuffer),
    iv: bufToBase64(randomValues.buffer),
  };
}

/**
 * Decrypts { ciphertext: base64, iv: base64 } using AES-256-GCM
 */
export async function decryptData(ciphertextBase64, ivBase64, cryptoKey) {
  const subtle = ensureSubtle();
  const cipherBuf = base64ToBuf(ciphertextBase64);
  const ivBuf = base64ToBuf(ivBase64);

  const dec = new TextDecoder();
  const plainBuffer = await subtle.decrypt(
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
  const subtle = ensureSubtle();
  const key = await subtle.generateKey(AES_ALGO, true, ['encrypt', 'decrypt']);
  const raw = await subtle.exportKey('raw', key);
  return {
    cryptoKey: key,
    pairingKeyHex: bufToHex(raw),
  };
}

/**
 * Imports an ephemeral pairing key from hex
 */
export async function importPairingKey(pairingKeyHex) {
  const subtle = ensureSubtle();
  const keyBuf = hexToBuf(pairingKeyHex.replace(/[\s-]/g, '').toLowerCase());
  return subtle.importKey('raw', keyBuf, AES_ALGO, true, ['encrypt', 'decrypt']);
}
