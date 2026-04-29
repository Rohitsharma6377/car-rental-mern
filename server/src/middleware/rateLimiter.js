import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"    
})

export const authRateLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 5,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes"
})