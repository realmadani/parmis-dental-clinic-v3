import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
import net from 'net';

dns.setDefaultResultOrder('ipv4first');
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}

const origLookup = dns.lookup.bind(dns);
dns.lookup = function (hostname: string, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options;
    options = { family: 4 };
  } else if (typeof options === 'number') {
    options = { family: 4 };
  } else if (typeof options === 'object' && options !== null) {
    options = { ...options, family: 4 };
  } else {
    options = { family: 4 };
  }
  return origLookup(hostname, options, callback);
} as any;

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { readDb, writeDb, AppointmentRecord, MediaRecord } from './db';
import { aiChatRouter } from './ai/aiChatRouter';
import { setClinicDataProvider } from './ai/aiAssistant';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_SECRET = process.env.AUTH_SECRET || 'parmis-dental-secret-key-2026';

// Paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const uploadsDir = path.resolve(rootDir, 'public', 'uploads');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Security Headers Middleware (Helmet-style protection)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// 2. High-Performance Gzip/Brotli Compression
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// 3. Core Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 4. Rate Limiting System (Brute-Force & Flood Protection)
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

function createRateLimiter(options: { windowMs: number; maxRequests: number; message: string }) {
  const buckets = new Map<string, RateLimitBucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const clientIp = rawIp.replace(/^::ffff:/, ''); // normalize IPv4-mapped IPv6
    const now = Date.now();
    const bucket = buckets.get(clientIp);

    if (bucket) {
      if (now < bucket.resetTime) {
        if (bucket.count >= options.maxRequests) {
          const remainingMinutes = Math.ceil((bucket.resetTime - now) / 60000);
          return res.status(429).json({
            success: false,
            error: `${options.message} (لطفاً ${remainingMinutes} دقیقه دیگر مجدداً تلاش نمایید)`,
          });
        }
        bucket.count++;
      } else {
        buckets.set(clientIp, { count: 1, resetTime: now + options.windowMs });
      }
    } else {
      buckets.set(clientIp, { count: 1, resetTime: now + options.windowMs });
    }
    next();
  };
}

const appointmentsRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 12,
  message: 'تعداد درخواست‌های ثبت نوبت از این آی‌پی به سقف مجاز رسیده است.',
});

const commentsRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 15,
  message: 'تعداد دیدگاه‌های ارسالی از این آی‌پی به سقف مجاز رسیده است.',
});

const aiChatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'تعداد پیام‌های ارسالی به هوش مصنوعی در یک دقیقه بیش از حد مجاز است.',
});

// 5. Input Sanitization Helper
function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .trim();
}

// 6. Cryptographic Password Hashing (PBKDF2 with Salt)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 10000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];
    const derivedHash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(derivedHash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch {
      return false;
    }
  }
  // Backward compatibility with legacy plain text passwords
  return password === storedHash;
}

// 7. Static Serving with High-Performance HTTP Caching Headers
// Hashed assets (Vite generated .js, .css) - 1 year immutable cache
if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(distDir, 'assets'))) {
  app.use(
    '/assets',
    express.static(path.resolve(distDir, 'assets'), {
      maxAge: '1y',
      immutable: true,
    })
  );
}

// Uploads (images and videos) - Revalidate with max-age 1 hour
app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '1h',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    },
  })
);

// Public assets (images, favicon, sitemap, robots)
app.use(
  express.static(publicDir, {
    maxAge: '1d',
  })
);

// No-cache headers for all API requests to ensure instant real-time data sync
app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// AI Assistant & Chatbot Routes with Rate Limiting
app.use('/api/ai', aiChatRateLimiter, aiChatRouter);

// Wire dynamic CMS clinic data provider to AI assistant
setClinicDataProvider({
  getClinicInfo: () => {
    try {
      const db = readDb();
      if (db.clinicInfo) {
        return {
          name: db.clinicInfo.name || 'دندان‌پزشکی پارمیس',
          fullName: db.clinicInfo.fullName || 'کلینیک دندان‌پزشکی پارمیس',
          doctorName: db.clinicInfo.doctorName || 'دکتر انوشیروان شمس‌پور',
          doctorRole: db.clinicInfo.doctorRole || 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
          medicalCouncilCode: db.clinicInfo.medicalCouncilCode || '۱۱۱۹۳۵',
          medicalLicenseLink: 'https://membersearch.irimc.org/',
          phone: db.clinicInfo.phone || '02136048581',
          phoneDisplay: db.clinicInfo.phoneDisplay || '۰۲۱۳۶۰۴۸۵۸۱',
          address: db.clinicInfo.address || 'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
          workingHours: db.clinicInfo.workingHours || 'شنبه تا پنج‌شنبه، ۱۰:۰۰ الی ۲۰:۰۰',
          googleMapsUrl: db.clinicInfo.googleMapsUrl || 'https://maps.app.goo.gl/mW3LBkEkswiF6HBZ8?g_st=ac',
          neshanUrl: db.clinicInfo.neshanUrl || 'https://nshn.ir/fcsbQMQhQxn5EY',
          baladUrl: db.clinicInfo.baladUrl || 'https://balad.ir/location?latitude=35.483203&longitude=51.680118&zoom=16.500000',
          doctorImage: db.clinicInfo.doctorImage || '/images/dr-shamspoor.jpg',
        };
      }
    } catch {}
    return undefined as any;
  },
  getServices: () => {
    try {
      const db = readDb();
      if (Array.isArray(db.services) && db.services.length > 0) {
        return db.services.map((s: any) => ({
          id: s.id,
          title: s.title,
          shortDesc: s.shortDesc || s.description || '',
          details: s.details || {
            duration: '',
            painControl: '',
            aftercare: [],
          },
        }));
      }
    } catch {}
    return undefined as any;
  },
  getTreatments: () => {
    try {
      const db = readDb();
      if (Array.isArray(db.treatments) && db.treatments.length > 0) {
        return db.treatments;
      }
    } catch {}
    return undefined as any;
  },
  getCases: () => {
    try {
      const db = readDb();
      if (Array.isArray(db.transformations) && db.transformations.length > 0) {
        return db.transformations.map((t: any, idx: number) => ({
          id: t.id || `case-${idx + 1}`,
          caseNumber: t.caseNumber || `کیس #${idx + 101}`,
          title: t.title || 'نمونه درمان زیبایی',
          category: t.category || 'composite',
          categoryLabel: t.categoryLabel || t.badge || 'اصلاح طرح لبخند',
          description: t.description || t.subtitle || '',
          patientInfo: t.patientInfo || '',
          duration: t.duration || '',
          guaranteeText: t.guaranteeText || '',
          beforeImage: t.beforeImage || t.image || '',
          afterImage: t.afterImage || t.mobileImage || t.image || '',
          beforeLabel: t.beforeLabel || 'قبل از درمان',
          afterLabel: t.afterLabel || 'بعد از درمان',
          badge: t.badge || 'اصلاح طرح لبخند',
        }));
      }
    } catch {}
    return undefined as any;
  },
  getFaqs: () => {
    try {
      const db = readDb();
      if (Array.isArray(db.faqs) && db.faqs.length > 0) {
        return db.faqs.map((f: any) => ({
          question: f.question || f.q || '',
          answer: f.answer || f.a || '',
        }));
      }
    } catch {}
    return [];
  },
  getArticles: () => {
    try {
      const db = readDb();
      if (Array.isArray(db.articles) && db.articles.length > 0) {
        return db.articles.map((a: any) => ({
          title: a.title || '',
          summary: a.summary || a.mobileSummary || '',
          category: a.category || '',
        }));
      }
    } catch {}
    return [];
  },
});

// --- Auth Token Helpers (HMAC SHA256) ---
function createToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

// Optional Auth Middleware for protected mutating routes
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'احراز هویت الزامی است. لطفاً وارد شوید.' });
  }
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'توکن نامعتبر یا منقضی شده است.' });
  }
  (req as any).user = payload;
  next();
}

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max file size for videos and images
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('تنها بارگذاری فایل‌های تصویری و ویدیویی مجاز است.'));
    }
  },
});

// Rate Limiter for Login Attempts (Brute Force Protection)
interface LoginAttempt {
  count: number;
  resetTime: number;
}
const loginAttempts = new Map<string, LoginAttempt>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts.get(clientIp);

  if (attempt) {
    if (now < attempt.resetTime) {
      if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
        const remainingMinutes = Math.ceil((attempt.resetTime - now) / 60000);
        return res.status(429).json({
          success: false,
          error: `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${remainingMinutes} دقیقه دیگر تلاش نمایید.`,
        });
      }
    } else {
      // Window expired, reset
      loginAttempts.delete(clientIp);
    }
  }
  next();
};

const recordFailedLogin = (ip: string) => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, resetTime: now + LOCKOUT_WINDOW_MS };
  attempt.count += 1;
  loginAttempts.set(ip, attempt);
};

const resetLoginAttempts = (ip: string) => {
  loginAttempts.delete(ip);
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', loginRateLimiter, (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { username, password } = req.body;
  const db = readDb();

  const validUsername = db.admin?.username || 'admindent';
  const validPassword = db.admin?.password || 'admindent';

  if (
    username === validUsername &&
    verifyPassword(password, validPassword)
  ) {
    // Transparently upgrade legacy plaintext password to secure PBKDF2 hash on first login
    if (!validPassword.startsWith('pbkdf2$')) {
      try {
        db.admin = {
          ...db.admin,
          username: validUsername,
          password: hashPassword(password),
        };
        writeDb(db);
      } catch (err) {
        console.error('Failed to upgrade password hash:', err);
      }
    }

    resetLoginAttempts(clientIp);
    const token = createToken({ username: validUsername, role: 'admin' });
    return res.json({
      success: true,
      token,
      user: {
        username: validUsername,
        role: 'admin',
      },
    });
  }

  recordFailedLogin(clientIp);
  return res.status(401).json({
    success: false,
    error: 'نام کاربری یا کلمه عبور نادرست است.',
  });
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const payload = verifyToken(authHeader.substring(7));
  if (!payload) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, user: payload });
});

// PUT /api/auth/profile: Update admin username and/or password
app.put('/api/auth/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'احراز هویت نامعتبر است.' });
  }
  const payload = verifyToken(authHeader.substring(7));
  if (!payload) {
    return res.status(401).json({ success: false, error: 'احراز هویت نامعتبر یا منقضی شده است.' });
  }

  const { currentPassword, newUsername, newPassword } = req.body;
  const db = readDb();
  const currentSavedPassword = db.admin?.password || 'admindent';
  const currentSavedUsername = db.admin?.username || 'admindent';

  // Check current password with timing-safe hash verification
  if (!verifyPassword(currentPassword, currentSavedPassword)) {
    return res.status(400).json({
      success: false,
      error: 'کلمه عبور فعلی نادرست است.',
    });
  }

  const updatedUsername = (newUsername && newUsername.trim()) ? newUsername.trim() : currentSavedUsername;
  const updatedPassword = (newPassword && newPassword.trim()) ? hashPassword(newPassword.trim()) : currentSavedPassword;

  db.admin = {
    username: updatedUsername,
    password: updatedPassword,
  };
  writeDb(db);

  const newToken = createToken({ username: updatedUsername, role: 'admin' });
  return res.json({
    success: true,
    message: 'مشخصات مدیر با موفقیت به‌روزرسانی شد.',
    token: newToken,
    user: {
      username: updatedUsername,
      role: 'admin',
    },
  });
});

// ==========================================
// 2. CMS SITE DATA ROUTES
// ==========================================

// GET /api/cms-data: Get all site data for frontend
app.get('/api/cms-data', (_req: Request, res: Response) => {
  const db = readDb();
  // Sanitize: do not send admin password to public
  const { admin, ...safeData } = db;

  const resolvedLogo =
    safeData.headerSettings?.brand?.logoUrl ||
    safeData.siteImages?.headerLogo?.url ||
    safeData.clinicInfo?.doctorImage ||
    safeData.doctor?.image ||
    '/images/dr-shamspoor.jpg';

  const headerSettings = {
    ...(safeData.headerSettings || {}),
    brand: {
      ...(safeData.headerSettings?.brand || {}),
      logoUrl: resolvedLogo,
    },
  };

  const siteImages = {
    ...(safeData.siteImages || {}),
    headerLogo: {
      ...(safeData.siteImages?.headerLogo || {}),
      url: resolvedLogo,
    },
  };

  res.json({
    ...safeData,
    headerSettings,
    siteImages,
    adminUsername: admin?.username || 'admin',
  });
});

// PUT /api/cms-data/:section: Update a specific section (Protected with requireAuth)
app.put('/api/cms-data/:section', requireAuth, (req: Request, res: Response) => {
  const { section } = req.params;
  const payload = req.body;

  if (section === 'admin') {
    return res.status(400).json({ error: 'برای تغییر مشخصات ادمین از مسیر اختصاصی استفاده کنید.' });
  }

  const db = readDb();
  db[section] = payload;

  // Cross-sync logoUrl across headerSettings, siteImages, and clinicInfo to prevent discrepancies
  if (section === 'headerSettings' && payload?.brand?.logoUrl) {
    const logoUrl = payload.brand.logoUrl;
    if (!db.siteImages) db.siteImages = {};
    db.siteImages.headerLogo = {
      ...(db.siteImages.headerLogo || {}),
      url: logoUrl,
      alt: payload.brand.logoAlt || payload.brand.title || 'لوگوی کلینیک پارمیس',
      title: 'تصویر لوگو و آواتار هدر',
    };
  } else if (section === 'siteImages' && payload?.headerLogo?.url) {
    const logoUrl = payload.headerLogo.url;
    if (!db.headerSettings) db.headerSettings = {};
    if (!db.headerSettings.brand) db.headerSettings.brand = {};
    db.headerSettings.brand.logoUrl = logoUrl;
  }

  writeDb(db);

  res.json({ success: true, section, data: db[section] });
});

// ==========================================
// 3. ARTICLES MANAGEMENT ROUTES
// ==========================================

// GET /api/articles
app.get('/api/articles', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.articles || []);
});

// POST /api/articles (Protected with requireAuth)
app.post('/api/articles', requireAuth, (req: Request, res: Response) => {
  const db = readDb();
  const newArticle = {
    id: req.body.id || `article-${Date.now()}`,
    slug: req.body.slug || req.body.id || `article-${Date.now()}`,
    title: req.body.title || 'مقاله جدید',
    mobileTitle: req.body.mobileTitle || req.body.title || 'مقاله جدید',
    category: req.body.category || 'آموزش و مراقبت دهان',
    categorySlug: req.body.categorySlug || 'general',
    mobileCategory: req.body.mobileCategory || req.body.category || 'عمومی',
    summary: req.body.summary || '',
    mobileSummary: req.body.mobileSummary || req.body.summary || '',
    metaTitle: req.body.metaTitle || `${req.body.title} | دندانپزشکی پارمیس`,
    metaDescription: req.body.metaDescription || req.body.summary || '',
    image: req.body.image || '/images/dr-shamspoor.jpg',
    mobileImage: req.body.mobileImage || req.body.image || '/images/dr-shamspoor.jpg',
    readTime: req.body.readTime || '۵ دقیقه',
    date: req.body.date || new Date().toLocaleDateString('fa-IR'),
    views: typeof req.body.views === 'number' ? req.body.views : 0,
    author: req.body.author || 'دکتر انوشیروان شمس پور',
    authorRole: req.body.authorRole || 'مسئول فنی کلینیک دندان‌پزشکی پارمیس',
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['دندانپزشکی', 'پاکدشت'],
    isFeatured: Boolean(req.body.isFeatured),
    content: Array.isArray(req.body.content) ? req.body.content : [req.body.content || ''],
    introduction: req.body.introduction || '',
    executiveSummary: Array.isArray(req.body.executiveSummary) ? req.body.executiveSummary : [],
    comparisonTable: req.body.comparisonTable || null,
    doctorQuote: req.body.doctorQuote || null,
    candidacy: req.body.candidacy || null,
    tips: Array.isArray(req.body.tips) ? req.body.tips : [],
    faqs: Array.isArray(req.body.faqs) ? req.body.faqs : [],
  };

  db.articles = [newArticle, ...(db.articles || [])];
  writeDb(db);
  res.status(201).json(newArticle);
});

// PUT /api/articles/:id (Protected with requireAuth)
app.put('/api/articles/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.articles || []).findIndex((a: any) => a.id === id || a.slug === id);

  if (index === -1) {
    return res.status(404).json({ error: 'مقاله مورد نظر یافت نشد.' });
  }

  const existing = db.articles[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent changing primary ID accidentally
    slug: req.body.slug || existing.slug || existing.id,
    date: req.body.date !== undefined ? req.body.date : (existing.date || new Date().toLocaleDateString('fa-IR')),
    views: req.body.views !== undefined ? Number(req.body.views) : (existing.views || 0),
    metaTitle: req.body.metaTitle || `${req.body.title || existing.title} | دندانپزشکی پارمیس`,
    metaDescription: req.body.metaDescription || req.body.summary || existing.summary,
  };

  db.articles[index] = updated;
  writeDb(db);
  res.json(updated);
});

// POST /api/articles/:id/view - Real View Counter Increment (Public)
app.post('/api/articles/:id/view', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.articles || []).findIndex((a: any) => a.id === id || a.slug === id);

  if (index === -1) {
    return res.status(404).json({ error: 'مقاله مورد نظر یافت نشد.' });
  }

  const currentViews = Number(db.articles[index].views) || 0;
  const newViews = currentViews + 1;
  db.articles[index].views = newViews;
  writeDb(db);

  res.json({ success: true, views: newViews });
});

// DELETE /api/articles/:id (Protected with requireAuth)
app.delete('/api/articles/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = (db.articles || []).length;
  db.articles = (db.articles || []).filter((a: any) => a.id !== id && a.slug !== id);

  if (db.articles.length === initialLength) {
    return res.status(404).json({ error: 'مقاله مورد نظر یافت نشد.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'مقاله با موفقیت حذف شد.' });
});

// ==========================================
// 3.5. BLOG CATEGORIES MANAGEMENT ROUTES
// ==========================================

// GET /api/categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.blogCategories || []);
});

// POST /api/categories
app.post('/api/categories', (req: Request, res: Response) => {
  const { id, label, icon } = req.body;
  if (!label || !label.trim()) {
    return res.status(400).json({ error: 'عنوان دسته‌بندی الزامی است.' });
  }

  const db = readDb();
  const categoryId = (id || `cat-${Date.now()}`).trim().toLowerCase().replace(/\s+/g, '-');

  const categories = db.blogCategories || [];
  if (categories.some((c: any) => c.id === categoryId || c.label === label.trim())) {
    return res.status(400).json({ error: 'دسته‌بندی با این عنوان یا شناسه از قبل وجود دارد.' });
  }

  const newCat = {
    id: categoryId,
    label: label.trim(),
    icon: icon || 'article',
  };

  db.blogCategories = [...categories, newCat];
  writeDb(db);
  res.status(201).json(newCat);
});

// PUT /api/categories/:id
app.put('/api/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { label, icon } = req.body;
  if (!label || !label.trim()) {
    return res.status(400).json({ error: 'عنوان دسته‌بندی الزامی است.' });
  }

  const db = readDb();
  const categories = db.blogCategories || [];
  const index = categories.findIndex((c: any) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'دسته‌بندی مورد نظر یافت نشد.' });
  }

  const oldLabel = categories[index].label;
  const updatedCat = {
    ...categories[index],
    label: label.trim(),
    icon: icon || categories[index].icon || 'article',
  };
  categories[index] = updatedCat;
  db.blogCategories = categories;

  // Also update articles using this category name so they stay linked!
  if (oldLabel !== label.trim() && Array.isArray(db.articles)) {
    db.articles = db.articles.map((art: any) => {
      if (art.category === oldLabel || art.categorySlug === id) {
        return {
          ...art,
          category: label.trim(),
          categorySlug: id,
          mobileCategory: label.trim(),
        };
      }
      return art;
    });
  }

  writeDb(db);
  res.json({ success: true, category: updatedCat, articles: db.articles });
});

// DELETE /api/categories/:id
app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === 'all') {
    return res.status(400).json({ error: 'دسته‌بندی پیش‌فرض «همه» قابل حذف نیست.' });
  }

  const db = readDb();
  const categories = db.blogCategories || [];
  const targetCat = categories.find((c: any) => c.id === id);

  if (!targetCat) {
    return res.status(404).json({ error: 'دسته‌بندی مورد نظر یافت نشد.' });
  }

  db.blogCategories = categories.filter((c: any) => c.id !== id);

  // If any article had this category, reassign it to 'عمومی'
  if (Array.isArray(db.articles)) {
    db.articles = db.articles.map((art: any) => {
      if (art.category === targetCat.label || art.categorySlug === id) {
        return {
          ...art,
          category: 'عمومی',
          categorySlug: 'general',
          mobileCategory: 'عمومی',
        };
      }
      return art;
    });
  }

  writeDb(db);
  res.json({ success: true, message: 'دسته‌بندی با موفقیت حذف شد.' });
});

// ==========================================
// 4. SMILE GALLERY ROUTES
// ==========================================

// GET /api/gallery
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.transformations || []);
});

// POST /api/gallery
app.post('/api/gallery', (req: Request, res: Response) => {
  const db = readDb();
  const newItem = {
    ...req.body,
    id: req.body.id || `gallery-${Date.now()}`,
    title: req.body.title || 'نمونه درمان جدید',
    mobileTitle: req.body.mobileTitle || req.body.title || 'نمونه درمان جدید',
    subtitle: req.body.subtitle || '',
    mobileSubtitle: req.body.mobileSubtitle || req.body.subtitle || '',
    image: req.body.image || req.body.beforeImage || '',
    mobileImage: req.body.mobileImage || req.body.afterImage || req.body.image || '',
    beforeImage: req.body.beforeImage || req.body.image || '',
    afterImage: req.body.afterImage || req.body.mobileImage || req.body.image || '',
    beforeLabel: req.body.beforeLabel || 'قبل از درمان',
    afterLabel: req.body.afterLabel || 'بعد از درمان',
    description: req.body.description || '',
    badge: req.body.badge || 'اصلاح طرح لبخند',
    iconName: req.body.iconName || 'auto_awesome',
    galleryImages: Array.isArray(req.body.galleryImages) ? req.body.galleryImages : [],
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
  };

  db.transformations = [...(db.transformations || []), newItem];
  writeDb(db);
  res.status(201).json(newItem);
});

// PUT /api/gallery/:id
app.put('/api/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.transformations || []).findIndex((t: any) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'آیتم مورد نظر یافت نشد.' });
  }

  db.transformations[index] = {
    ...db.transformations[index],
    ...req.body,
    id,
  };

  writeDb(db);
  res.json(db.transformations[index]);
});

// DELETE /api/gallery/:id
app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = (db.transformations || []).length;
  db.transformations = (db.transformations || []).filter((t: any) => t.id !== id);

  if (db.transformations.length === initialLength) {
    return res.status(404).json({ error: 'آیتم مورد نظر یافت نشد.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'آیتم گالری با موفقیت حذف شد.' });
});

// ==========================================
// 5. APPOINTMENTS ROUTES
// ==========================================

// GET /api/appointments
app.get('/api/appointments', (req: Request, res: Response) => {
  const { status } = req.query;
  const db = readDb();
  let list = db.appointments || [];

  if (status && typeof status === 'string') {
    list = list.filter((a) => a.status === status);
  }

  // Newest appointments first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// POST /api/appointments: Patient booking from site
app.post('/api/appointments', appointmentsRateLimiter, (req: Request, res: Response) => {
  const { fullName, phone, serviceId, serviceTitle, preferredDate, preferredTime, description } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'نام و نام خانوادگی و شماره تماس الزامی هستند.' });
  }

  const cleanFullName = sanitizeInput(fullName);
  const cleanPhone = sanitizeInput(phone);
  const cleanDescription = sanitizeInput(description);
  const cleanDate = sanitizeInput(preferredDate);
  const cleanTime = sanitizeInput(preferredTime);

  const db = readDb();
  const newAppointment: AppointmentRecord = {
    id: `apt-${Date.now()}`,
    fullName: cleanFullName,
    phone: cleanPhone,
    serviceId: serviceId || 'general-visit',
    serviceTitle: serviceTitle || 'ویزیت و مشاوره عمومی',
    preferredDate: cleanDate,
    preferredTime: cleanTime,
    description: cleanDescription,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.appointments = [newAppointment, ...(db.appointments || [])];
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'درخواست نوبت شما با موفقیت ثبت شد. کارشناسان کلینیک به زودی با شما تماس خواهند گرفت.',
    appointment: newAppointment,
  });
});

// PATCH /api/appointments/:id: Update status or notes by admin (Protected with requireAuth)
app.patch('/api/appointments/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = readDb();

  const index = (db.appointments || []).findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'نوبت مورد نظر یافت نشد.' });
  }

  if (status) {
    db.appointments[index].status = status;
  }
  if (notes !== undefined) {
    db.appointments[index].notes = notes;
  }

  writeDb(db);
  res.json({ success: true, appointment: db.appointments[index] });
});

// DELETE /api/appointments/:id: Remove appointment (Protected with requireAuth)
app.delete('/api/appointments/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();

  const initialLength = (db.appointments || []).length;
  db.appointments = (db.appointments || []).filter((a) => a.id !== id);

  if (db.appointments.length === initialLength) {
    return res.status(404).json({ error: 'نوبت مورد نظر یافت نشد.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'نوبت با موفقیت حذف شد.' });
});

// ==========================================
// 5.5. PATIENT COMMENTS & QUESTIONS ROUTES
// ==========================================

// GET /api/comments: List comments (optional filter by articleId or status)
app.get('/api/comments', (req: Request, res: Response) => {
  const { articleId, status } = req.query;
  const db = readDb();
  let list = db.comments || [];

  if (articleId && typeof articleId === 'string') {
    list = list.filter((c: any) => c.articleId === articleId);
  }
  if (status && typeof status === 'string') {
    list = list.filter((c: any) => c.status === status);
  }

  // Sort newest first
  list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// POST /api/comments: Submit new question/comment from article page
app.post('/api/comments', commentsRateLimiter, (req: Request, res: Response) => {
  const { articleId, articleTitle, authorName, authorPhone, content } = req.body;

  if (!authorName || !content) {
    return res.status(400).json({ error: 'نام و متن دیدگاه الزامی است.' });
  }

  const cleanAuthorName = sanitizeInput(authorName);
  const cleanPhone = sanitizeInput(authorPhone);
  const cleanContent = sanitizeInput(content);

  const db = readDb();
  const newComment = {
    id: `comm-${Date.now()}`,
    articleId: articleId || '',
    articleTitle: articleTitle || '',
    authorName: cleanAuthorName,
    authorPhone: cleanPhone,
    content: cleanContent,
    status: 'pending' as const, // pending admin review or approval
    createdAt: new Date().toISOString(),
    doctorReply: '',
    repliedAt: '',
    repliedBy: '',
  };

  db.comments = [newComment, ...(db.comments || [])];
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'دیدگاه و پرسش شما با موفقیت ثبت شد و پس از بررسی و پاسخ توسط پزشک در سایت نمایش داده خواهد شد.',
    comment: newComment,
  });
});

// PATCH /api/comments/:id/reply: Doctor/Admin replies to a comment (Protected with requireAuth)
app.patch('/api/comments/:id/reply', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { doctorReply, status, repliedBy } = req.body;
  const db = readDb();

  const comments = db.comments || [];
  const index = comments.findIndex((c: any) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'دیدگاه مورد نظر یافت نشد.' });
  }

  const existing = comments[index];
  comments[index] = {
    ...existing,
    doctorReply: doctorReply !== undefined ? doctorReply.trim() : existing.doctorReply,
    status: status || (doctorReply ? 'approved' : existing.status),
    repliedAt: doctorReply ? new Date().toISOString() : existing.repliedAt,
    repliedBy: repliedBy || 'دکتر انوشیروان شمس پور',
  };

  db.comments = comments;
  writeDb(db);

  res.json({ success: true, message: 'پاسخ با موفقیت ثبت و وضعیت دیدگاه به‌روزرسانی شد.', comment: comments[index] });
});

// PATCH /api/comments/:id/status: Change status (Protected with requireAuth)
app.patch('/api/comments/:id/status', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();

  const comments = db.comments || [];
  const index = comments.findIndex((c: any) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'دیدگاه مورد نظر یافت نشد.' });
  }

  comments[index].status = status;
  db.comments = comments;
  writeDb(db);

  res.json({ success: true, message: 'وضعیت دیدگاه تغییر یافت.', comment: comments[index] });
});

// DELETE /api/comments/:id: Delete a comment (Protected with requireAuth)
app.delete('/api/comments/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();

  const initialLength = (db.comments || []).length;
  db.comments = (db.comments || []).filter((c: any) => c.id !== id);

  if (db.comments.length === initialLength) {
    return res.status(404).json({ error: 'دیدگاه مورد نظر یافت نشد.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'دیدگاه با موفقیت حذف شد.' });
});

// ==========================================
// 6. MEDIA LIBRARY ROUTES
// ==========================================

// GET /api/media: Get all uploaded images
app.get('/api/media', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.media || []);
});

// POST /api/media: Upload image/video with multer (Protected with requireAuth)
app.post('/api/media', requireAuth, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'هیچ فایلی برای بارگذاری ارسال نشده است.' });
  }

  const { alt, title, category, targetId, targetField } = req.body;
  const db = readDb();

  const newMedia: MediaRecord = {
    id: `med-${Date.now()}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    alt: alt || req.file.originalname,
    title: title || req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    createdAt: new Date().toISOString(),
    category: (category as any) || 'upload',
    targetId,
    targetField,
  };

  db.media = [newMedia, ...(db.media || [])];
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'فایل با موفقیت بارگذاری شد.',
    media: newMedia,
  });
});

// PUT /api/media/:id: Update alt and title for any media record
app.put('/api/media/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { alt, title } = req.body;
  const db = readDb();

  const item = (db.media || []).find((m) => m.id === id);
  if (!item) {
    return res.status(404).json({ error: 'رسانه مورد نظر یافت نشد.' });
  }

  if (alt !== undefined) item.alt = alt;
  if (title !== undefined) item.title = title;

  // If linked to siteImages, synchronize
  if (item.category === 'site' && item.targetKey && db.siteImages?.[item.targetKey]) {
    if (alt !== undefined) db.siteImages[item.targetKey].alt = alt;
    if (title !== undefined) db.siteImages[item.targetKey].title = title;
  }

  writeDb(db);
  res.json({ success: true, media: item, siteImages: db.siteImages });
});

// POST /api/media/replace: Replace any image in-place across the website (Protected with requireAuth)
app.post('/api/media/replace', requireAuth, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'هیچ فایلی برای جایگزینی ارسال نشده است.' });
  }

  const { targetType, targetKey, targetId, targetField, alt, title } = req.body;
  const db = readDb();
  const newUrl = `/uploads/${req.file.filename}`;

  let updatedMediaRecord: MediaRecord | null = null;

  // 1. Target: siteImage
  if (targetType === 'siteImage' && targetKey) {
    if (!db.siteImages) db.siteImages = {};
    const existing = db.siteImages[targetKey] || { url: '', alt: '', title: '' };
    db.siteImages[targetKey] = {
      url: newUrl,
      alt: alt || existing.alt || req.file.originalname,
      title: title || existing.title || req.file.originalname,
    };

    // Synchronize clinicInfo and specific sections
    if (targetKey === 'heroMainImage') {
      if (db.clinicInfo) db.clinicInfo.heroImage = newUrl;
      if (db.hero) db.hero.image = newUrl;
    } else if (targetKey === 'doctorProfileImage') {
      if (db.clinicInfo) db.clinicInfo.doctorImage = newUrl;
      if (db.doctor) db.doctor.image = newUrl;
    } else if (targetKey === 'clinicEquipmentImage') {
      if (db.clinicInfo) db.clinicInfo.operatoryImage = newUrl;
    } else if (targetKey === 'mapPreviewImage') {
      if (db.clinicInfo) db.clinicInfo.mapImage = newUrl;
    } else if (targetKey === 'editorPickDoctorAvatar') {
      if (!db.editorPick) db.editorPick = {};
      db.editorPick.avatarUrl = newUrl;
    }

    // Update or insert in db.media
    let mediaItem = (db.media || []).find(
      (m) => m.id === `site-${targetKey}` || (m.category === 'site' && m.targetKey === targetKey)
    );
    if (mediaItem) {
      mediaItem.filename = req.file.filename;
      mediaItem.url = newUrl;
      mediaItem.size = req.file.size;
      mediaItem.mimeType = req.file.mimetype;
      if (alt) mediaItem.alt = alt;
      if (title) mediaItem.title = title;
      updatedMediaRecord = mediaItem;
    } else {
      const newRec: MediaRecord = {
        id: `site-${targetKey}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: newUrl,
        alt: alt || db.siteImages[targetKey].alt,
        title: title || db.siteImages[targetKey].title,
        mimeType: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date().toISOString(),
        category: 'site',
        targetKey,
      };
      db.media = [newRec, ...(db.media || [])];
      updatedMediaRecord = newRec;
    }
  }

  // 2. Target: gallery transformation
  else if (targetType === 'gallery' && targetId) {
    const tItem = (db.transformations || []).find((t: any) => String(t.id) === String(targetId));
    const field = targetField === 'mobileImage' ? 'mobileImage' : 'image';
    if (tItem) {
      tItem[field] = newUrl;
      if (field === 'image') tItem.beforeImage = newUrl;
      if (field === 'mobileImage') tItem.afterImage = newUrl;
    }

    const mediaId = `gal-${targetId}-${field}`;
    let mediaItem = (db.media || []).find(
      (m) =>
        m.id === mediaId ||
        (m.category === 'gallery' && String(m.targetId) === String(targetId) && m.targetField === field)
    );
    if (mediaItem) {
      mediaItem.filename = req.file.filename;
      mediaItem.url = newUrl;
      mediaItem.size = req.file.size;
      mediaItem.mimeType = req.file.mimetype;
      if (alt) mediaItem.alt = alt;
      if (title) mediaItem.title = title;
      updatedMediaRecord = mediaItem;
    } else {
      const newRec: MediaRecord = {
        id: mediaId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: newUrl,
        alt: alt || tItem?.title || req.file.originalname,
        title: title || tItem?.title || req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date().toISOString(),
        category: 'gallery',
        targetId: String(targetId),
        targetField: field,
      };
      db.media = [newRec, ...(db.media || [])];
      updatedMediaRecord = newRec;
    }
  }

  // 3. Target: article
  else if (targetType === 'article' && targetId) {
    const art = (db.articles || []).find((a: any) => a.id === targetId || a.slug === targetId);
    if (art) {
      art.image = newUrl;
      art.mobileImage = newUrl;
    }

    const mediaId = `art-${targetId}`;
    let mediaItem = (db.media || []).find(
      (m) => m.id === mediaId || (m.category === 'article' && m.targetId === targetId)
    );
    if (mediaItem) {
      mediaItem.filename = req.file.filename;
      mediaItem.url = newUrl;
      mediaItem.size = req.file.size;
      mediaItem.mimeType = req.file.mimetype;
      if (alt) mediaItem.alt = alt;
      if (title) mediaItem.title = title;
      updatedMediaRecord = mediaItem;
    } else {
      const newRec: MediaRecord = {
        id: mediaId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: newUrl,
        alt: alt || art?.title || req.file.originalname,
        title: title || art?.title || req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date().toISOString(),
        category: 'article',
        targetId: String(targetId),
        targetField: 'image',
      };
      db.media = [newRec, ...(db.media || [])];
      updatedMediaRecord = newRec;
    }
  }

  // 4. Target: generic media item
  else {
    const mId = targetId || targetKey;
    let mediaItem = (db.media || []).find((m) => m.id === mId);
    if (mediaItem) {
      mediaItem.filename = req.file.filename;
      mediaItem.url = newUrl;
      mediaItem.size = req.file.size;
      mediaItem.mimeType = req.file.mimetype;
      if (alt) mediaItem.alt = alt;
      if (title) mediaItem.title = title;
      updatedMediaRecord = mediaItem;
    } else {
      const newRec: MediaRecord = {
        id: `med-${Date.now()}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: newUrl,
        alt: alt || req.file.originalname,
        title: title || req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date().toISOString(),
        category: 'upload',
      };
      db.media = [newRec, ...(db.media || [])];
      updatedMediaRecord = newRec;
    }
  }

  writeDb(db);

  res.json({
    success: true,
    message: 'تصویر با موفقیت در محل مورد نظر تعویض شد.',
    url: newUrl,
    media: updatedMediaRecord,
    siteImages: db.siteImages,
  });
});

// DELETE /api/media/:id: Delete image from media library & disk (Protected with requireAuth)
app.delete('/api/media/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();

  const mediaIndex = (db.media || []).findIndex((m) => m.id === id);
  if (mediaIndex === -1) {
    return res.status(404).json({ error: 'رسانه مورد نظر یافت نشد.' });
  }

  const item = db.media[mediaIndex];

  // If the file is inside uploadsDir, delete it from disk
  if (item.url && item.url.startsWith('/uploads/')) {
    const filePath = path.resolve(uploadsDir, item.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete physical file:', filePath, err);
      }
    }
  }

  db.media.splice(mediaIndex, 1);
  writeDb(db);

  res.json({ success: true, message: 'رسانه با موفقیت حذف شد.' });
});

// ==========================================
// 7. TECHNICAL SEO & SITEMAP ROUTES
// ==========================================

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// GET /sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const db = readDb();
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const staticRoutes = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/?page=services`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/?page=about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/?page=gallery`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/?page=blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/?page=contact`, priority: '0.8', changefreq: 'monthly' },
  ];

  const articleRoutes = (db.articles || []).map((art: any) => ({
    loc: `${baseUrl}/?page=article&id=${encodeURIComponent(art.slug || art.id)}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticRoutes, ...articleRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// GET /robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const sitemapUrl = `${protocol}://${host}/sitemap.xml`;

  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /?page=admin

Sitemap: ${sitemapUrl}
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Parmis Dental Clinic CMS API',
  });
});

function injectDynamicSeo(rawHtml: string, req: Request): string {
  let html = rawHtml;
  const db = readDb();
  const page = req.query.page as string;
  const articleId = req.query.id as string;

  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

  let title = db.siteSettings?.title || 'کلینیک دندان‌پزشکی پارمیس | دکتر انوشیروان شمس پور';
  let description =
    db.siteSettings?.metaDescription ||
    'کلینیک دندان‌پزشکی پارمیس در پاکدشت با مدیریت دکتر انوشیروان شمس پور؛ ارائه دهنده خدمات تخصصی ایمپلنت، کامپوزیت و لمینت.';

  let ogTitle = db.siteSettings?.ogTitle || title;
  let ogDescription = db.siteSettings?.ogDescription || description;

  let rawOgImage =
    db.siteSettings?.ogImage ||
    db.siteSettings?.shareOgImage ||
    db.siteImages?.shareOgImage?.url ||
    db.clinicInfo?.heroImage ||
    '/images/dr-shamspoor.jpg';

  if (page === 'services') {
    title = `خدمات تخصصی دندان‌پزشکی | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
    description = 'ارائه کلیه خدمات تخصصی ایمپلنت دیجیتال، کامپوزیت ونیر، لمینت سرامیکی و عصب‌کشی در پاکدشت.';
    ogTitle = title;
    ogDescription = description;
  } else if (page === 'about') {
    title = `درباره کلینیک و ${db.clinicInfo?.doctorName || 'دکتر شمس پور'} | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
    description = 'آشنایی با دکتر انوشیروان شمس پور، سوابق بالینی درخشان و تجهیزات استریلیزاسیون پیشرفته کلینیک پارمیس.';
    ogTitle = title;
    ogDescription = description;
  } else if (page === 'gallery') {
    title = `گالری لبخند و نمونه درمان‌های قبل و بعد | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
    description = 'مشاهده تصاویر قبل و بعد درمان‌های زیبایی، اصلاح طرح لبخند و کامپوزیت در کلینیک پارمیس.';
    ogTitle = title;
    ogDescription = description;
  } else if (page === 'blog') {
    title = `مجله سلامت و مقالات دندان‌پزشکی | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
    description = 'آرشیو مقالات علمی، آموزش بهداشت دهان و دندان و راهنمای جامع مراقبت‌های دندانپزشکی.';
    ogTitle = title;
    ogDescription = description;
  } else if (page === 'article') {
    const art = (db.articles || []).find((a: any) => a.id === articleId || a.slug === articleId);
    if (art) {
      title = art.metaTitle || `${art.title} | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
      description = art.metaDescription || art.summary || description;
      ogTitle = title;
      ogDescription = description;
      if (art.image || art.mobileImage) {
        rawOgImage = art.image || art.mobileImage;
      }
    }
  } else if (page === 'contact') {
    title = `تماس با ما، نشانی و ساعات کاری | ${db.clinicInfo?.name || 'کلینیک پارمیس'}`;
    description = 'آدرس کلینیک در مجتمع راستین پاکدشت، ساعات کاری روزانه و شماره تماس جهت مشاوره و نوبت‌دهی.';
    ogTitle = title;
    ogDescription = description;
  }

  const fullOgImageUrl = rawOgImage.startsWith('http://') || rawOgImage.startsWith('https://')
    ? rawOgImage
    : `${baseUrl}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);

  // Replace Meta Description
  if (html.includes('name="description"')) {
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${description}" />\n</head>`);
  }

  // Replace OpenGraph Title
  if (html.includes('property="og:title"')) {
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${ogTitle}" />`);
  } else {
    html = html.replace('</head>', `  <meta property="og:title" content="${ogTitle}" />\n</head>`);
  }

  // Replace OpenGraph Description
  if (html.includes('property="og:description"')) {
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${ogDescription}" />`);
  } else {
    html = html.replace('</head>', `  <meta property="og:description" content="${ogDescription}" />\n</head>`);
  }

  // Replace OpenGraph Image
  if (html.includes('property="og:image"')) {
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${fullOgImageUrl}" />`);
  } else {
    html = html.replace('</head>', `  <meta property="og:image" content="${fullOgImageUrl}" />\n</head>`);
  }

  // Replace Twitter Image
  if (html.includes('name="twitter:image"')) {
    html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${fullOgImageUrl}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="twitter:image" content="${fullOgImageUrl}" />\n</head>`);
  }

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: db.clinicInfo?.fullName || 'کلینیک دندان‌پزشکی پارمیس',
    founder: {
      '@type': 'Person',
      name: db.clinicInfo?.doctorName || 'دکتر انوشیروان شمس پور',
      jobTitle: 'جراح - دندان‌پزشک',
    },
    image: fullOgImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: db.clinicInfo?.address || 'بلوار شهدای قمی، میدان علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم',
      addressLocality: 'پاکدشت',
      addressRegion: 'تهران',
      addressCountry: 'IR',
    },
    telephone: db.clinicInfo?.phone || '02136048581',
    priceRange: '$$',
    openingHours: 'Sa-Th 10:00-20:00',
  };

  const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(schemaOrg, null, 2)}\n    </script>\n  `;
  html = html.replace('</head>', `${schemaScript}</head>`);
  return html;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'یافت نشد' });
      }
      try {
        const indexPath = path.resolve(rootDir, 'index.html');
        const rawHtml = fs.readFileSync(indexPath, 'utf-8');
        const transformedHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        const finalHtml = injectDynamicSeo(transformedHtml, req);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(finalHtml);
      } catch (err) {
        next(err);
      }
    });
  } else if (fs.existsSync(distDir)) {
    app.use(express.static(distDir, { index: false }));

    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'یافت نشد' });
      }

      const indexPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Not Found');
      }

      const rawHtml = fs.readFileSync(indexPath, 'utf-8');
      const finalHtml = injectDynamicSeo(rawHtml, req);
      res.send(finalHtml);
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✅ CMS Backend Server running at http://localhost:${PORT}`);
    console.log(`📁 Uploads served from ${uploadsDir} at http://localhost:${PORT}/uploads`);
  });
}

startServer();

export default app;
