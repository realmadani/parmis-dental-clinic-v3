import fs from 'fs';
import path from 'path';
import {
  CLINIC_INFO,
  VALUE_PROPOSITIONS,
  SERVICES,
  TRANSFORMATIONS,
  BLOG_CATEGORIES,
  TRENDING_TAGS,
  QUICK_HEALTH_TIPS,
  ARTICLES,
  FAQS,
  MOBILE_FAQS,
} from '../src/data/clinicData';
import { DENTAL_TREATMENTS } from '../src/utils/costCalculator';
import { fileURLToPath } from 'url';
import { MediaRecord } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'db.json');

// Enhance articles with SEO fields
const enhancedArticles = ARTICLES.map((art) => ({
  ...art,
  slug: art.id,
  metaTitle: `${art.title} | وبلاگ کلینیک دندانپزشکی پارمیس پاکدشت`,
  metaDescription: art.summary || art.mobileSummary || '',
}));

// Enhance transformations with beforeImage and afterImage
const enhancedTransformations = TRANSFORMATIONS.map((t) => ({
  ...t,
  beforeImage: t.image,
  afterImage: t.mobileImage || t.image,
}));

const initialSiteImages = {
  headerLogo: {
    url: '/images/dr-shamspoor.jpg',
    alt: 'لوگوی کلینیک دندان‌پزشکی پارمیس - دکتر انوشیروان شمس پور',
    title: 'تصویر لوگو و آواتار پزشک در هدر',
  },
  heroMainImage: {
    url: CLINIC_INFO.heroImage,
    alt: 'محیط مدرن و یونیت کلینیک دندان‌پزشکی پارمیس در پاکدشت',
    title: 'تصویر اصلی بنر صفحه نخست (Hero)',
  },
  clinicEquipmentImage: {
    url: CLINIC_INFO.operatoryImage,
    alt: 'تجهیزات دندان‌پزشکی و یونیت جراحی کلینیک پارمیس',
    title: 'تصویر اتاق درمان و تجهیزات تخصصی',
  },
  doctorProfileImage: {
    url: CLINIC_INFO.doctorImage,
    alt: 'دکتر انوشیروان شمس پور جراح و دندانپزشک در پاکدشت',
    title: 'پرتره رسمی دکتر انوشیروان شمس پور',
  },
  mapPreviewImage: {
    url: CLINIC_INFO.mapImage,
    alt: 'موقعیت مکانی کلینیک پارمیس پاکدشت روی نقشه',
    title: 'پیش‌نمایش نقشه کلینیک',
  },
  waitingRoomImage: {
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    alt: 'سالن انتظار آرام و مدرن کلینیک پارمیس پاکدشت',
    title: 'سالن انتظار مراجعین',
  },
  sterilizationImage: {
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    alt: 'دستگاه اتوکلاو کلاس B و تجهیزات استریلیزاسیون کلینیک پارمیس',
    title: 'اتاق استریلیزاسیون بیمارستانی (CSR)',
  },
  servicesBannerImage: {
    url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    alt: 'خدمات تخصصی دندانپزشکی کلینیک پارمیس پاکدشت',
    title: 'بنر صفحه خدمات تخصصی',
  },
};

// Build comprehensive media records
const mediaList: MediaRecord[] = [];

// 1. Site Layout Images (8 items)
Object.entries(initialSiteImages).forEach(([key, val]) => {
  mediaList.push({
    id: `site-${key}`,
    filename: path.basename(val.url.split('?')[0]) || `${key}.jpg`,
    originalName: val.title,
    url: val.url,
    alt: val.alt,
    title: val.title,
    mimeType: 'image/jpeg',
    size: 100000,
    createdAt: new Date().toISOString(),
    category: 'site',
    targetKey: key,
  });
});

// 2. Before & After Gallery Images (6 items)
enhancedTransformations.forEach((item) => {
  if (item.image) {
    mediaList.push({
      id: `gal-${item.id}-image`,
      filename: `before-${item.id}.jpg`,
      originalName: `تصویر درمان: ${item.title}`,
      url: item.image,
      alt: `نمونه درمان - ${item.title} (${item.beforeLabel || 'قبل'})`,
      title: `تصویر اصلی: ${item.title}`,
      mimeType: 'image/jpeg',
      size: 95000,
      createdAt: new Date().toISOString(),
      category: 'gallery',
      targetId: String(item.id),
      targetField: 'image',
    });
  }
  if (item.mobileImage && item.mobileImage !== item.image) {
    mediaList.push({
      id: `gal-${item.id}-mobileImage`,
      filename: `after-${item.id}.jpg`,
      originalName: `تصویر نتیجه: ${item.title}`,
      url: item.mobileImage,
      alt: `نتیجه درمان - ${item.title} (${item.afterLabel || 'بعد'})`,
      title: `تصویر نتیجه: ${item.title}`,
      mimeType: 'image/jpeg',
      size: 98000,
      createdAt: new Date().toISOString(),
      category: 'gallery',
      targetId: String(item.id),
      targetField: 'mobileImage',
    });
  }
});

// 3. Article Images (9 items)
enhancedArticles.forEach((art) => {
  if (art.image) {
    mediaList.push({
      id: `art-${art.id}`,
      filename: `${art.id}.jpg`,
      originalName: `تصویر شاخص مقاله: ${art.title}`,
      url: art.image,
      alt: art.title,
      title: `تصویر مقاله: ${art.title}`,
      mimeType: 'image/jpeg',
      size: 110000,
      createdAt: new Date().toISOString(),
      category: 'article',
      targetId: art.id,
      targetField: 'image',
    });
  }
});

const initialDb = {
  admin: {
    username: 'admin',
    password: 'admin123',
  },
  siteSettings: {
    title: 'کلینیک دندان‌پزشکی پارمیس | دکتر انوشیروان شمس پور',
    tagline: 'خدمات تخصصی دندان‌پزشکی و ایمپلنت در پاکدشت',
    metaDescription: 'کلینیک دندان‌پزشکی پارمیس در پاکدشت با مدیریت دکتر انوشیروان شمس پور؛ ارائه دهنده خدمات تخصصی ایمپلنت، کامپوزیت، لمینت، عصب‌کشی و دندان‌پزشکی اطفال.',
    phone: CLINIC_INFO.phone,
    address: CLINIC_INFO.address,
  },
  siteImages: initialSiteImages,
  clinicInfo: { ...CLINIC_INFO },
  valuePropositions: [...VALUE_PROPOSITIONS],
  services: [...SERVICES],
  transformations: enhancedTransformations,
  articles: enhancedArticles,
  faqs: [...FAQS],
  mobileFaqs: [...MOBILE_FAQS],
  blogCategories: [...BLOG_CATEGORIES],
  trendingTags: [...TRENDING_TAGS],
  quickHealthTips: [...QUICK_HEALTH_TIPS],
  treatments: [...DENTAL_TREATMENTS],
  doctor: {
    name: CLINIC_INFO.doctorName,
    title: CLINIC_INFO.doctorTitleBrand,
    role: CLINIC_INFO.doctorRole,
    specialty: 'جراح - دندان‌پزشک | شماره نظام پزشکی معتبر',
    city: 'پاکدشت',
    experienceYears: '+۱۰ سال',
    successfulTreatments: '+۵,۰۰۰',
    image: CLINIC_INFO.doctorImage,
    bio: 'دکتر انوشیروان شمس پور با سال‌ها تجربه بالینی درخشان و بهره‌گیری از پروتکل‌های درمانی مدرن، اصل کاری خود را بر پایه «صداقت در تشخیص و اولویت حفظ حداکثری دندان طبیعی بیمار» بنا نهاده است. کلیه مراحل درمانی در محیطی کاملاً استریل، آرام و مجهز به جدیدترین فناوری‌های تشخیصی روز انجام می‌شود.',
    highlights: [
      { title: 'سابقه بالینی مستمر', desc: 'بیش از ۱۰ سال تجربه درمان‌های تخصصی جراحی و زیبایی' },
      { title: 'درمان‌های موفق', desc: 'ثبت بیش از ۵ هزار پرونده درمانی رضایت‌بخش در پاکدشت' },
      { title: 'استریلیزاسیون پیشرفته', desc: 'بهره‌گیری از اتوکلاو کلاس B بیمارستانی و پک‌های استریل یک‌بارمصرف' },
      { title: 'رادیوگرافی دیجیتال کم‌پرتو', desc: 'سنسور RVG با بالاترین وضوح و حداقل میزان تابش اشعه' },
    ],
  },
  about: {
    heading: 'تعهد به سلامت دهان و آفرینش لبخند طبیعی در پاکدشت',
    description: 'با بیش از یک دهه سابقه بالینی درخشان در ارائه خدمات تخصصی دهان و دندان، رویکرد ما در کلینیک پارمیس متکی بر دندان‌پزشکی کم‌تهاجمی (بیومیمتیک)، حفظ حداکثری بافت طبیعی دندان، بهره‌گیری از معتبرترین متریال‌های استاندارد اروپا و به صفر رساندن استرس و درد در طول درمان است.',
    metrics: [
      { label: 'تجربه بالینی مستمر', value: '+۱۰ سال' },
      { label: 'مراجع راضی در پاکدشت', value: '+۵۰۰۰' },
      { label: 'استریلیزاسیون بیمارستانی', value: 'کلاس B' },
      { label: 'حداقل تابش اشعه X', value: 'RVG دیجیتال' },
    ],
    principles: [
      { title: 'حفظ دندان طبیعی', desc: 'اولویت اول در کلینیک پارمیس همواره نجات و حفظ دندان طبیعی بیمار است و کشیدن دندان آخرین گزینه خواهد بود.' },
      { title: 'درمان بدون استرس و درد', desc: 'با استفاده از بی‌حسی‌های موضعی مدرن و تکنیک‌های آرام‌بخش، ترس از دندانپزشکی را برطرف می‌کنیم.' },
      { title: 'متریال استاندارد اروپایی', desc: 'استفاده انحصاری از برندهای دارای تاییدیه CE اروپا و FDA آمریکا در ایمپلنت و مواد زیبایی.' },
      { title: 'شفافیت مالی و طرح درمان', desc: 'ارائه طرح درمان مکتوب همراه با پیش‌فاکتور دقیق و صدور فاکتور رسمی بیمه تکمیلی قبل از شروع هر درمان.' },
    ],
  },
  hero: {
    badge: 'کلینیک دندان‌پزشکی پارمیس • پاکدشت',
    title: 'لبخندی زیبا، سالم و ماندگار با مدرن‌ترین استانداردهای دندان‌پزشکی',
    description: 'درمان‌های تخصصی و زیبایی دندان با پیشرفته‌ترین تکنولوژی‌های روز، بدون درد و با اولویت حفظ حداکثری دندان طبیعی تحت نظر دکتر انوشیروان شمس پور.',
    ctaPrimary: 'درخواست و رزرو نوبت ویزیت',
    ctaSecondary: 'مشاهده خدمات تخصصی',
    metrics: [
      { label: 'رضایت بیماران', value: '۹۹.۴٪' },
      { label: 'درمان موفق در پاکدشت', value: '+۵,۰۰۰' },
      { label: 'سابقه درخشان بالینی', value: '+۱۰ سال' },
    ],
  },
  contact: {
    address: CLINIC_INFO.address,
    shortAddress: CLINIC_INFO.shortAddress,
    phone1: CLINIC_INFO.phone,
    phone2: CLINIC_INFO.phone2,
    workingHours: CLINIC_INFO.workingHours,
    workingHoursDetail: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۰:۰۰',
    googleMapsUrl: CLINIC_INFO.googleMapsUrl,
    neshanUrl: CLINIC_INFO.neshanUrl,
    baladUrl: CLINIC_INFO.baladUrl,
    transitGuide: {
      metro: 'نزدیک‌ترین ایستگاه مترو: ایستگاه مترو فرهنگسرا یا پیروزی (سپس تاکسی‌های خطی پاکدشت / میدان قدس)',
      bus: 'پایانه مسافربری پاکدشت و ایستگاه اتوبوس‌های بین‌شهری خاوران - پاکدشت، پیاده‌روی ۵ دقیقه‌ای تا میدان علی ابن ابیطالب',
      car: 'دسترسی سریع از بزرگراه امام رضا (ع) به بلوار شهدای قمی و میدان علی ابن ابیطالب با پارکینگ اختصاصی در مجتمع پزشکی راستین',
    },
  },
  appointments: [
    {
      id: 'apt-1740000001',
      fullName: 'امیرحسین رضایی',
      phone: '09121234567',
      serviceId: 'dental-implant',
      serviceTitle: 'ایمپلنت و کاشت دندان',
      preferredDate: '1403/08/01',
      preferredTime: 'عصر (۱۶ تا ۲۰)',
      description: 'مشاوره برای کاشت ۲ واحد ایمپلنت فک بالا سمت راست',
      status: 'pending',
      createdAt: '2026-10-18T12:00:00.000Z',
    },
    {
      id: 'apt-1740000002',
      fullName: 'مریم سلیمانی',
      phone: '09359876543',
      serviceId: 'cosmetic-composite',
      serviceTitle: 'کامپوزیت ونیر و اصلاح لبخند',
      preferredDate: '1403/08/03',
      preferredTime: 'صبح (۱۰ تا ۱۳)',
      description: 'اصلاح فرم و رنگ دندان‌های پیشین فک بالا',
      status: 'confirmed',
      createdAt: '2026-10-18T10:30:00.000Z',
    },
  ],
  media: mediaList,
};

fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
console.log('Database seeded successfully at:', dbPath);
console.log(`- Articles: ${initialDb.articles.length}`);
console.log(`- Services: ${initialDb.services.length}`);
console.log(`- Transformations: ${initialDb.transformations.length}`);
console.log(`- Treatments: ${initialDb.treatments.length}`);
console.log(`- Appointments: ${initialDb.appointments.length}`);
console.log(`- Media: ${initialDb.media.length}`);
