const rateLimitMap = new Map();

// Clean up expired rate limit entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Lightweight rate limiter for Next.js API routes
 * @param {object} req - Next.js Request object
 * @param {string} action - Identifier for action (e.g., 'create_post', 'create_comment')
 * @param {object} options - { limit: max attempts, windowMs: duration in ms }
 * @returns {object} { success: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(req, action = 'create_post', options = {}) {
  const limit = options.limit || 5;
  const windowMs = options.windowMs || 60 * 60 * 1000; // default 1 hour

  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');
  const userCookie = req.cookies?.user_email || req.cookies?.token || req.cookies?.poesias_client_id || '';
  
  const key = `${action}:${ip}:${userCookie}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    const secondsLeft = Math.ceil((record.resetTime - now) / 1000);
    return { success: false, remaining: 0, resetInSeconds: secondsLeft };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetInSeconds: Math.ceil((record.resetTime - now) / 1000) };
}
