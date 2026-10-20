# 🦷 کلینیک دندان‌پزشکی پارمیس (Parmis Dental Clinic v3)

وب‌سایت رسمی، فوق‌مدرن و یکپارچه کلینیک دندان‌پزشکی پارمیس همراه با **چت‌بات هوش مصنوعی مراجعین (Google Gemini AI)**، **سیستم مدیریت محتوای داینامیک (Full CMS)**، **رزرو آنلاین نوبت**، **محاسبه‌گر هوشمند هزینه‌های درمانی** و **پنل مدیریت پیشرفته**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ ویژگی‌های برجسته پروژه (Key Features)

- 🤖 **چت‌بات هوشمند مراجعین (AI Patient Assistant):**
  - متصل به API مدل‌های Gemini گوگل (`@google/genai`)
  - پاسخگویی هوشمند به سوالات مراجعین پیرامون خدمات، هزینه‌ها، ساعات کاری و آدرس کلینیک
  - دارای موتور پاسخگویی لوکال (Fallback) در شرایط قطعی اینترنت یا عدم تنظیم API Key
  - انیمیشن روان ربات سخنگو با آواتار اختصاصی و امکان بستن سریع پنجره
- 🏥 **اطلاعات رسمی پزشک و کلینیک:**
  - **پزشک:** دکتر انوشیروان شمس‌پور (جراح - دندانپزشک، دکترای حرفه‌ای دندانپزشکی)
  - **شماره نظام پزشکی:** ۱۱۱۹۳۵
  - **ساعات کاری:** شنبه تا پنج‌شنبه، ۱۰:۰۰ الی ۲۰:۰۰
  - **تلفن همراه و مشاوره واتساپ:** ۰۹۲۱۵۳۹۵۹۲۳
- 🎛 **سیستم یکپارچه سرور (Single-Port Architecture):**
  - اجرای فرانت‌اند و بک‌اند به صورت یکپارچه روی یک پورت واحد (`PORT=3000`)
  - لود آنی و بهینه با کامپایل لحظه‌ای Vite Watch
- 🛡️ **امنیت پیشرفته (Hardened Security):**
  - رمزنگاری پسورد ادمین با الگوریتم استاندارد `PBKDF2` و سالت تصادفی ۱۶ بایتی (۱۰,۰۰۰ دور)
  - احراز هویت توکن‌های JWT با امضای دیجیتال `HMAC-SHA256`
  - سیستم محدودکننده نرخ درخواست (Rate Limiting) برای جلوگیری از حملات Brute Force و اسپم فرم‌های نوبت‌دهی و هوش مصنوعی
  - هدرهای امنیتی ضد نفوذ (XSS Protection, NoSniff, SameOrigin) و پاکسازی ورودی‌های کاربر (Input Sanitization)
- ⚡ **سرعت و پرفورمنس حداکثری (High Performance):**
  - فشرده‌سازی هوشمند خروجی سرور با Gzip
  - کشینگ ۱ ساله برای دارایی‌های استاتیک (`Cache-Control: public, max-age=31536000, immutable`)
  - بارگذاری تنبل صفحات سنگین (`React.lazy`)
- 🔍 **سئو و بهینه‌سازی موتورهای جستجو (SEO Ready):**
  - ساختار داده‌ای استاندارد Schema.org (`Dentist`)
  - متاتگ‌های داینامیک OpenGraph و Twitter Cards
  - فایل‌های استاندارد `sitemap.xml` و `robots.txt` و فاوآیکون وکتور اختصاصی
- 📊 **پنل مدیریت جامع (Admin Panel):**
  - مدیریت کامل نوبت‌ها، محتوای صفحات، تصاویر، مقالات، خدمات، تعرفه‌ها و نظرات مراجعین

---

## 🛠️ تکنولوژی‌های مورد استفاده (Tech Stack)

- **Frontend:** React 19, Tailwind CSS v4, Motion (Framer Motion), Lucide React, Vazirmatn Font
- **Backend:** Node.js, Express, Multer, Compression, CORS, Crypto
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Language & Tooling:** TypeScript, Vite, Concurrently, TSX

---

## 🚀 راهنمای نصب و راه‌اندازی (Quick Start)

### ۱. کلون کردن مخزن:
```bash
git clone <YOUR_REPOSITORY_URL>
cd parmis-dental-clinic-v3
```

### ۲. نصب وابستگی‌ها:
```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی:
فایل `.env.example` را به `.env` کپی کنید:
```bash
cp .env.example .env
```
سپس کلید API اختصاصی خود را در صورت تمایل وارد نمایید:
```env
PORT=3000
GEMINI_API_KEY="کلید_گوگل_جمنای"
AUTH_SECRET="کلید_امنیتی_دلخواه"
```

### ۴. ساخت و اجرای پروژه:
برای اجرای پروژه روی پورت واحد ۳۰۰۰:
```bash
npm run dev
```

سپس در مرورگر خود آدرس زیر را باز کنید:
```
http://localhost:3000/
```

- **آدرس پنل مدیریت:** `http://localhost:3000/admin`
- **نام کاربری پیش‌فرض:** `admindent`
- **کلمه عبور پیش‌فرض:** `admindent`

---

## 📂 ساختار پروژه (Directory Structure)

```text
├── public/                # فایل‌های استاتیک، تصاویر، sitemap و robots
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── images/
│   └── uploads/
├── server/                # بک‌اند اکسپرس و مسیرهای API
│   ├── ai/                # ماژول هوش مصنوعی Gemini و چت‌بات
│   ├── db.json            # دیتابیس JSON داده‌های کلینیک
│   ├── db.ts              # لایه خواندن و نوشتن اتمیک دیتابیس
│   └── index.ts           # سرور اکسپرس و روت‌های اصلی
├── src/                   # فرانت‌اند ری‌اکت
│   ├── components/        # کامپوننت‌های رابط کاربری و صفحات
│   ├── context/           # کانتکست مدیریت داده (CMSContext)
│   ├── data/              # داده‌های پیش‌فرض کلینیک
│   ├── utils/             # توابع کمکی، فرمول‌های محاسبه و تست‌ها
│   ├── App.tsx            # کامپوننت اصلی سایت
│   └── main.tsx           # نقطه ورود کلاینت
├── package.json
└── vite.config.ts
```

---

## 📄 مجوز (License)
این پروژه تحت مجوز MIT منتشر شده است.
