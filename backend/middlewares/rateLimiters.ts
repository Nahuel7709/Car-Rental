import { rateLimit, MemoryStore } from "express-rate-limit";
import type { Request, Response } from "express";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// One store per limiter (they can not be shared).
// Exported so the tests can reset the counters before each test.
export const rateLimitStores = {
  global: new MemoryStore(),
  login: new MemoryStore(),
  register: new MemoryStore(),
  bookings: new MemoryStore(),
};

// Generous limit for the whole API, per IP.
export const globalLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: rateLimitStores.global,
  message: { message: "Too many requests, please try again later" },
});

// Failed login attempts per IP. Successful logins do not count.
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: rateLimitStores.login,
  message: { message: "Too many login attempts, please try again later" },
});

// New accounts per IP.
export const registerLimiter = rateLimit({
  windowMs: ONE_HOUR,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: rateLimitStores.register,
  message: { message: "Too many accounts created, please try again later" },
});

// Booking attempts per user. Must run after authMiddleware,
// which sets res.locals.user.
export const bookingsLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: rateLimitStores.bookings,
  keyGenerator: (_req: Request, res: Response) => res.locals.user!.id,
  message: { message: "Too many booking attempts, please try again later" },
});
