"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRateLimit = exports.searchRateLimit = exports.adminRateLimit = exports.strictRateLimit = exports.apiRateLimit = exports.generalRateLimit = exports.authRateLimit = void 0;
exports.createRateLimit = createRateLimit;
exports.ipBlockingMiddleware = ipBlockingMiddleware;
exports.enhancedRateLimit = enhancedRateLimit;
class RateLimiter {
    store = new Map();
    cleanupInterval;
    constructor() {
        // Clean up expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetTime < now) {
                this.store.delete(key);
            }
        }
    }
    getKey(req) {
        // Use IP address as the key (in production, consider user ID for authenticated requests)
        return req.ip || req.connection.remoteAddress || "unknown";
    }
    checkLimit(key, windowMs, maxRequests) {
        const now = Date.now();
        const entry = this.store.get(key);
        if (!entry || entry.resetTime < now) {
            // Create new entry or reset expired entry
            this.store.set(key, {
                count: 1,
                resetTime: now + windowMs,
            });
            return {
                allowed: true,
                remaining: maxRequests - 1,
                resetTime: now + windowMs,
            };
        }
        if (entry.count >= maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime,
            };
        }
        // Increment count
        entry.count++;
        this.store.set(key, entry);
        return {
            allowed: true,
            remaining: maxRequests - entry.count,
            resetTime: entry.resetTime,
        };
    }
    destroy() {
        clearInterval(this.cleanupInterval);
        this.store.clear();
    }
}
// Create singleton instance
const rateLimiter = new RateLimiter();
// Rate limiting middleware factory
function createRateLimit(options) {
    return (req, res, next) => {
        const key = rateLimiter.getKey(req);
        const result = rateLimiter.checkLimit(key, options.windowMs, options.maxRequests);
        // Set rate limit headers
        res.set({
            "X-RateLimit-Limit": options.maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
        });
        if (!result.allowed) {
            const message = options.message || "Too many requests, please try again later";
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
            });
        }
        next();
    };
}
// Predefined rate limiters for different endpoints
exports.authRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: "Too many authentication attempts, please try again later",
});
exports.generalRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: "Too many requests, please slow down",
});
exports.apiRateLimit = createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: "API rate limit exceeded, please try again later",
});
exports.strictRateLimit = createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: "Rate limit exceeded for this endpoint",
});
// Admin-specific rate limiter (more lenient)
exports.adminRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200, // 200 requests per 15 minutes
    message: "Admin rate limit exceeded",
});
// Search-specific rate limiter
exports.searchRateLimit = createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
    message: "Search rate limit exceeded, please try again later",
});
// Upload-specific rate limiter
exports.uploadRateLimit = createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 uploads per hour
    message: "Upload rate limit exceeded, please try again later",
});
// IP-based blocking for suspicious activity
class IPBlocker {
    blockedIPs = new Map();
    suspiciousIPs = new Map();
    isBlocked(ip) {
        const blockUntil = this.blockedIPs.get(ip);
        if (blockUntil && blockUntil > Date.now()) {
            return true;
        }
        // Remove expired blocks
        if (blockUntil && blockUntil <= Date.now()) {
            this.blockedIPs.delete(ip);
        }
        return false;
    }
    recordSuspiciousActivity(ip) {
        const now = Date.now();
        const entry = this.suspiciousIPs.get(ip);
        if (!entry) {
            this.suspiciousIPs.set(ip, { count: 1, firstSeen: now });
        }
        else {
            entry.count++;
            // Block IP if too many suspicious activities
            if (entry.count >= 10) {
                this.blockIP(ip, 24 * 60 * 60 * 1000); // Block for 24 hours
                this.suspiciousIPs.delete(ip);
            }
        }
    }
    blockIP(ip, durationMs) {
        this.blockedIPs.set(ip, Date.now() + durationMs);
    }
    cleanup() {
        const now = Date.now();
        // Clean up expired blocks
        for (const [ip, blockUntil] of this.blockedIPs.entries()) {
            if (blockUntil <= now) {
                this.blockedIPs.delete(ip);
            }
        }
        // Clean up old suspicious activity records
        for (const [ip, entry] of this.suspiciousIPs.entries()) {
            if (now - entry.firstSeen > 60 * 60 * 1000) {
                // 1 hour
                this.suspiciousIPs.delete(ip);
            }
        }
    }
}
const ipBlocker = new IPBlocker();
// Clean up every hour
setInterval(() => {
    ipBlocker.cleanup();
}, 60 * 60 * 1000);
// IP blocking middleware
function ipBlockingMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    if (ipBlocker.isBlocked(ip)) {
        return res.status(403).json({
            success: false,
            message: "Access denied due to suspicious activity",
        });
    }
    next();
}
// Enhanced rate limiting with IP blocking
function enhancedRateLimit(options) {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || "unknown";
        // Check if IP is blocked
        if (ipBlocker.isBlocked(ip)) {
            return res.status(403).json({
                success: false,
                message: "Access denied due to suspicious activity",
            });
        }
        // Apply rate limiting
        const key = rateLimiter.getKey(req);
        const result = rateLimiter.checkLimit(key, options.windowMs, options.maxRequests);
        res.set({
            "X-RateLimit-Limit": options.maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
        });
        if (!result.allowed) {
            // Record suspicious activity
            ipBlocker.recordSuspiciousActivity(ip);
            const message = options.message || "Too many requests, please try again later";
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
            });
        }
        next();
    };
}
// Cleanup on process exit
process.on("SIGINT", () => {
    rateLimiter.destroy();
});
process.on("SIGTERM", () => {
    rateLimiter.destroy();
});
