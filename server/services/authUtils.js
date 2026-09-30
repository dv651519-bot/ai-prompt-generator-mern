const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'promptforge-ultra-secure-jwt-secret-2026';

/**
 * Hash password with a unique cryptographic salt using Scrypt
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify plaintext password against stored salt:hash string
 */
function verifyPassword(password, storedHash) {
  try {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, originalHex] = storedHash.split(':');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHex, 'hex');
    if (derivedKey.length !== originalBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, originalBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * Generate standard HMAC-SHA256 JWT Token without external dependencies
 */
function generateToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days expiration
  };
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};
