import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CLINIC_INFO,
  VALUE_PROPOSITIONS,
  SERVICES,
  TRANSFORMATIONS,
  ARTICLES,
  FAQS,
  MOBILE_FAQS,
  ServiceItem,
  TransformationItem,
  ArticleItem,
  FaqItem,
  BLOG_CATEGORIES,
} from '../data/clinicData';
import { DENTAL_TREATMENTS, DentalTreatmentOption } from '../utils/costCalculator';

export interface SiteImageItem {
  url: string;
  alt: string;
  title: string;
}

export interface CMSContextType {
  data: any;
  loading: boolean;
  error: string | null;
  refreshCMS: () => Promise<void>;
  siteImages: Record<string, SiteImageItem>;
  clinicInfo: typeof CLINIC_INFO;
  valuePropositions: typeof VALUE_PROPOSITIONS;
  services: ServiceItem[];
  transformations: TransformationItem[];
  articles: ArticleItem[];
  comments: any[];
  blogCategories: Array<{ id: string; label: string; icon?: string }>;
  faqs: FaqItem[];
  mobileFaqs: FaqItem[];
  treatments: DentalTreatmentOption[];
  hero: Record<string, any>;
  doctor: Record<string, any>;
  about: Record<string, any>;
  contact: Record<string, any>;
  siteSettings: Record<string, any>;
  editorPick: {
    badgeText?: string;
    doctorName?: string;
    doctorRole?: string;
    avatarUrl?: string;
  };
  articleDoctorCard: {
    doctorName?: string;
    doctorRole?: string;
    bio?: string;
    avatarUrl?: string;
    experienceText?: string;
    experienceLabel?: string;
    successCountText?: string;
    successCountLabel?: string;
    buttonText?: string;
  };
  articleLatestSection: {
    title?: string;
    count?: number;
    showViews?: boolean;
    showReadTime?: boolean;
  };
  articleRelatedSection: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    count?: number;
    buttonText?: string;
    showCategoryBadge?: boolean;
    showDate?: boolean;
    showReadTime?: boolean;
    showSummary?: boolean;
    showCardButton?: boolean;
    cardButtonText?: string;
    emptyStateMessage?: string;
    fallbackToCategory?: boolean;
  };
  articleAuthor: {
    enabled?: boolean;
    name?: string;
    role?: string;
    avatarUrl?: string;
  };
  articleCtaSection: {
    enabled?: boolean;
    badgeText?: string;
    title?: string;
    description?: string;
    phoneText?: string;
    phone?: string;
    navButtonText?: string;
    features?: string[];
  };
  homeSettings: HomeSettingsType;
  servicesPageSettings: ServicesPageSettingsType;
  galleryPageSettings: GalleryPageSettingsType;
  aboutPageSettings: AboutPageSettingsType;
  contactPageSettings: ContactPageSettingsType;
}

export const defaultSiteImages: Record<string, SiteImageItem> = {
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
  editorPickDoctorAvatar: {
    url: '/uploads/photo_2026-10-18_21-28-58-1792346391612-941489.jpg',
    alt: 'دکتر انوشیروان شمس پور - مقاله منتخب سردبیر',
    title: 'تصویر آواتار پزشک در سکشن مقاله منتخب سردبیر',
  },
};

export interface HomeSettingsType {
  hero: {
    enabled: boolean;
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    description: string;
    primaryButtonText: string;
    primaryButtonPhone: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    statsDoctors: string;
    statsSatisfaction: string;
    imageUrl?: string;
    trustFeatures?: Array<{ icon: string; title: string; subtitle: string }>;
  };
  valueProps: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: Array<{ icon: string; title: string; desc: string }>;
  };
  advancedCare: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageBadge: string;
    checklist: string[];
    buttonText: string;
    buttonPhone: string;
    icon?: string;
    imageBadgeIcon?: string;
    checkIcon?: string;
    buttonIcon?: string;
  };
  transformations: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    showCount: number;
    moreButtonText: string;
    moreButtonLink: string;
    selectedCaseIds?: string[];
  };
  services: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    showCount: number;
    ctaButtonText: string;
    badgeIcon?: string;
    selectedServiceIds?: string[];
  };
  doctor: {
    enabled: boolean;
    badge: string;
    doctorName: string;
    specialty: string;
    bio: string;
    experienceText: string;
    experienceLabel: string;
    successCountText: string;
    successCountLabel: string;
    locationBadge: string;
    imageUrl?: string;
    consultationPhone: string;
    locationIcon?: string;
    phoneIcon?: string;
  };
  articles: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    count: number;
    showViews: boolean;
    showCommentsCount: boolean;
    badgeIcon?: string;
  };
  faqAndContact: {
    faqEnabled: boolean;
    faqBadge: string;
    faqTitle: string;
    contactEnabled: boolean;
    contactBadge: string;
    contactTitle: string;
    contactAddress: string;
    phone1: string;
    phone2: string;
    workingHours: string;
    mapImageUrl?: string;
    neshanUrl?: string;
    baladUrl?: string;
    googleMapsUrl?: string;
    faqBadgeIcon?: string;
    locationMainIcon?: string;
    addressIcon?: string;
    phoneIcon?: string;
    hoursIcon?: string;
  };
  cta: {
    enabled: boolean;
    title: string;
    description: string;
    phoneText: string;
    phone: string;
    icon?: string;
    buttonIcon?: string;
  };
  motionGuides: {
    enabled: boolean;
    dividers?: Record<string, { icon?: string; label?: string }>;
  };
}

export const defaultHomeSettings: HomeSettingsType = {
  hero: {
    enabled: true,
    badge: 'کلینیک تخصصی دندان‌پزشکی پارمیس • پاکدشت',
    titlePart1: 'لبخندی زیبا، سالم و ',
    titleHighlight: 'ماندگار برای شما',
    description: 'ارائه پیشرفته‌ترین خدمات ایمپلنت، کامپوزیت زیبایی و درمان‌های تخصصی با بهره‌گیری از تکنولوژی روز دیجیتال تحت نظر مستقیم دکتر انوشیروان شمس پور در پاکدشت.',
    primaryButtonText: 'نوبت‌دهی سریع تلفنی',
    primaryButtonPhone: CLINIC_INFO.phone,
    secondaryButtonText: 'مشاهده نتایج قبل و بعد درمان',
    secondaryButtonLink: '#transformations',
    statsDoctors: '+۵ متخصص',
    statsSatisfaction: '۹۹.۴٪ رضایت',
    imageUrl: CLINIC_INFO.heroImage,
  },
  valueProps: {
    enabled: true,
    title: 'چرا کلینیک دندان‌پزشکی پارمیس؟',
    subtitle: 'استاندارد درمانی برتر',
    items: [
      {
        icon: 'favorite',
        title: 'اولویت راحتی بیمار',
        desc: 'محیطی آرام‌بخش و درمان بدون استرس و اضطراب پزشکی.',
      },
      {
        icon: 'psychology',
        title: 'مهارت و تخصص بالا',
        desc: 'تجربه گسترده دکتر شمس پور در جراحی‌های پیچیده و ایمپلنت.',
      },
      {
        icon: 'payments',
        title: 'شفافیت کامل هزینه‌ها',
        desc: 'تعرفه منصفانه و ارائه فاکتور رسمی معتبر بیمه‌های تکمیلی.',
      },
      {
        icon: 'pin_drop',
        title: 'موقعیت عالی در پاکدشت',
        desc: 'دسترسی آسان در مجتمع پزشکی راستین با جای پارک مناسب.',
      },
      {
        icon: 'verified',
        title: 'ضمانت اصالت متریال',
        desc: 'استفاده انحصاری از برندهای سوئیسی، آلمانی و کره‌ای استاندارد.',
      },
    ],
  },
  advancedCare: {
    enabled: true,
    badge: 'تجهیزات و فناوری نوین',
    title: 'دندان‌پزشکی دیجیتال و مدرن در کلینیک پارمیس',
    description: 'ما در پاکدشت بالاترین سطوح بهداشتی و نوآوری تجهیزاتی را برای بیماران عزیز به کار گرفته‌ایم تا دوره نقاهت به حداقل رسیده و دوام درمان به حداکثر برسد.',
    imageUrl: CLINIC_INFO.operatoryImage,
    imageBadge: 'تصویر واقعی مطب',
    checklist: [
      'رادیوگرافی دیجیتال با کمترین میزان تابش اشعه',
      'استفاده اختصاصی از مواد ترمیمی و کامپوزیت‌های برند سوئیسی و آلمانی',
      'چرخه ضدعفونی مکانیزه و اتوکلاو بیمارستانی کلاس B',
    ],
    buttonText: 'مشاوره و ارزیابی تشخیصی دندان‌ها',
    buttonPhone: CLINIC_INFO.phone,
  },
  transformations: {
    enabled: true,
    badge: 'نتایج درمانی و تحول لبخند',
    title: 'نمونه درمان‌های انجام شده',
    subtitle: 'تغییرات واقعی لبخند مراجعین کلینیک دکتر شمس پور',
    showCount: 3,
    moreButtonText: 'مشاهده گالری کامل نمونه درمان‌ها و لبخند',
    moreButtonLink: 'gallery',
    selectedCaseIds: ['case-composite-diastema', 'case-laminate-emax', 'case-digital-implant'],
  },
  services: {
    enabled: true,
    badge: 'طیف کامل خدمات دندان‌پزشکی پارمیس',
    title: 'خدمات درمانی و زیبایی در پاکدشت',
    description: 'کلیه درمان‌های ترمیمی، زیبایی و جراحی دهان و دندان با بهترین تجهیزات و با رعایت کامل استانداردهای پزشکی در فضایی آرام انجام می‌پذیرد.',
    showCount: 6,
    ctaButtonText: 'مشاوره و دریافت نوبت',
    badgeIcon: 'dentistry',
    selectedServiceIds: ['root-canal', 'cosmetic-composite', 'implant', 'orthodontics', 'pediatric', 'scaling-perio'],
  },
  doctor: {
    enabled: true,
    badge: 'مسئول فنی و سرپرست درمان',
    doctorName: CLINIC_INFO.doctorName,
    specialty: 'جراح - دندان‌پزشک | پاکدشت',
    bio: 'دکتر انوشیروان شمس پور با سال‌ها تجربه بالینی درخشان و بهره‌گیری از پروتکل‌های درمانی مدرن، اصل کاری خود را بر پایه «صداقت در تشخیص و اولویت حفظ حداکثری دندان طبیعی بیمار» بنا نهاده است. کلیه مراحل درمانی در محیطی استریل، آرام و مجهز به جدیدترین فناوری‌های تشخیصی روز انجام می‌شود.',
    experienceText: 'بیش از ۱۰ سال تجربه',
    experienceLabel: 'سابقه درخشان بالینی',
    successCountText: '+۵,۰۰۰ درمان موفق',
    successCountLabel: 'رضایت کامل مراجعین',
    locationBadge: 'مطب فعال: پاکدشت، مجتمع پزشکی راستین، طبقه دوم',
    imageUrl: CLINIC_INFO.doctorImage,
    consultationPhone: CLINIC_INFO.phone,
  },
  articles: {
    enabled: true,
    badge: 'آموزش و آگاهی • پایگاه مقالات تخصصی',
    title: 'مجله سلامت دهان و زیبایی لبخند پارمیس',
    description: 'جدیدترین مقالات علمی و نکات مراقبتی تالیف و بازبینی‌شده توسط دکتر انوشیروان شمس پور',
    buttonText: 'مشاهده همه مقالات وبلاگ',
    count: 6,
    showViews: true,
    showCommentsCount: true,
  },
  faqAndContact: {
    faqEnabled: true,
    faqBadge: 'پاسخ به سوالات پرتکرار',
    faqTitle: 'پرسش‌های مراجعین محترم',
    contactEnabled: true,
    contactBadge: 'آدرس و مسیر دسترسی',
    contactTitle: 'کلینیک دندان‌پزشکی در پاکدشت',
    contactAddress: 'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
    phone1: CLINIC_INFO.phone,
    phone2: CLINIC_INFO.phone2,
    workingHours: CLINIC_INFO.workingHours,
    mapImageUrl: CLINIC_INFO.mapImage,
    neshanUrl: CLINIC_INFO.neshanUrl,
    baladUrl: CLINIC_INFO.baladUrl,
    googleMapsUrl: CLINIC_INFO.googleMapsUrl,
  },
  cta: {
    enabled: true,
    title: 'آماده‌اید لبخند رویایی خود را تجربه کنید؟',
    description: 'جهت مشاوره و هماهنگی نوبت ویزیت، همین امروز با کلینیک پارمیس تماس بگیرید.',
    phoneText: `تماس مستقیم فوری: ${CLINIC_INFO.phoneCompact2}`,
    phone: CLINIC_INFO.phone2,
  },
  motionGuides: {
    enabled: true,
  },
};

export interface ServicesPageHighlightItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface ServicesPageServiceCard {
  id: string;
  title: string;
  badge: string;
  badgeType?: 'primary' | 'secondary' | 'neutral';
  description: string;
  duration: string;
  lifespan: string;
  technique: string;
  icon: string;
  imageUrl?: string;
  ctaText: string;
  checklist?: string[];
}

export interface ServicesPageStepItem {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface ServicesPageFaqItem {
  id: string;
  q: string;
  a: string;
  icon?: string;
}

export interface ServicesPageSettingsType {
  hero: {
    enabled: boolean;
    badge: string;
    badgeIcon?: string;
    title: string;
    titleHighlight: string;
    description: string;
    bannerImage: string;
    bannerAlt: string;
    bannerCaptionTitle: string;
    bannerCaptionDesc: string;
    bannerTechnologyTag: string;
    floatingBadgeIcon: string;
    floatingBadgeTitle: string;
    floatingBadgeDesc: string;
    highlights: ServicesPageHighlightItem[];
  };
  implant: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    guaranteeBadge: string;
    title: string;
    description: string;
    features: Array<{ id: string; title: string; subtitle?: string; icon?: string }>;
    buttonText: string;
    buttonPhone: string;
    paymentNote: string;
    surgeryImage: string;
    surgeryImageAlt: string;
    surgeryImageTitle: string;
    surgeryImageSubtitle: string;
  };
  cosmeticCategory: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    consultationText: string;
    cards: ServicesPageServiceCard[];
  };
  restorativeCategory: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    cards: ServicesPageServiceCard[];
    promoCard: {
      enabled: boolean;
      badge: string;
      badgeIcon: string;
      title: string;
      description: string;
      buttonText: string;
      phone: string;
      locationText: string;
    };
  };
  journey: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    steps: ServicesPageStepItem[];
  };
  faqs: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    items: ServicesPageFaqItem[];
  };
  cta: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    buttonText: string;
    phone: string;
    phoneDisplay: string;
  };
}

export interface GalleryHeroMetric {
  id: string;
  value: string;
  label: string;
}

export interface GalleryCategoryFilterItem {
  id: string;
  label: string;
  icon?: string;
  enabled: boolean;
  order?: number;
}

export interface GalleryTestimonialItem {
  id: string;
  name: string;
  location: string;
  duration: string;
  quote: string;
  image: string;
  videoUrl?: string;
}

export interface GalleryStandardPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryJourneyStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon?: string;
}

export interface GalleryFaqItem {
  id: string;
  q: string;
  a: string;
}

export interface GalleryPageSettingsType {
  hero: {
    enabled: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryButtonText: string;
    phoneButtonText: string;
    featuredCardImage: string;
    featuredCardTitle: string;
    featuredCardSubtitle: string;
    featuredCardBadge: string;
    doctorName: string;
    doctorSubtitle: string;
    metrics: GalleryHeroMetric[];
  };
  filterChips: {
    enabled: boolean;
    categories: GalleryCategoryFilterItem[];
  };
  featuredCase: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    beforeLabel: string;
    afterLabel: string;
    caseNumber: string;
    unitBadge: string;
    challengeTitle: string;
    challengeDesc: string;
    planTitle: string;
    planDesc: string;
    duration: string;
    prepAmount: string;
    buttonText: string;
    satisfactionText: string;
    sliderInitialPosition?: number;
    sliderDividerColor?: string;
    beforeFloatingBadge?: string;
    afterFloatingBadge?: string;
  };
  caseGrid: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    loadMoreText: string;
    collapseText: string;
  };
  testimonials: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    items: GalleryTestimonialItem[];
  };
  photographyManifesto: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    columns?: '2' | '3' | '4';
    principles: GalleryStandardPrinciple[];
  };
  journey: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    steps: GalleryJourneyStep[];
  };
  faqs: {
    enabled: boolean;
    badge: string;
    title: string;
    items: GalleryFaqItem[];
  };
  cta: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    phoneButtonText: string;
    whatsappButtonText: string;
    whatsappLink: string;
  };
}

export interface AboutHeroMetric {
  id: string;
  value: string;
  label: string;
}

export interface AboutPillarItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface AboutChecklistItem {
  id: string;
  text: string;
}

export interface AboutPhilosophyCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutSterilizationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutGallerySlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

export interface AboutServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  linkText: string;
}

export interface AboutTestimonialItem {
  id: string;
  name: string;
  avatarInitials: string;
  tag: string;
  quote: string;
  stars: number;
}

export interface AboutPageSettingsType {
  hero: {
    enabled: boolean;
    eyebrowChip: string;
    doctorName: string;
    titleHighlight: string;
    description: string;
    doctorImage?: string;
    verifiedBadgeText: string;
    licenseText: string;
    floatingPill1Title: string;
    floatingPill1Subtitle: string;
    floatingPill1Icon: string;
    floatingPill2Title: string;
    floatingPill2Subtitle: string;
    floatingPill2Icon: string;
    metrics: AboutHeroMetric[];
    primaryButtonText: string;
    primaryButtonPhone: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  pillars: {
    enabled: boolean;
    badge: string;
    badgeSubtitle: string;
    items: AboutPillarItem[];
  };
  philosophy: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    bioTitle: string;
    bioText1: string;
    bioText2: string;
    clinicLocationTag: string;
    licenseLinkText: string;
    checklist: AboutChecklistItem[];
    cards: AboutPhilosophyCard[];
  };
  sterilization: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    mainImage: string;
    overlayBadgeTitle: string;
    overlayBadgeSubtitle: string;
    overlayBadgeIcon: string;
    items: AboutSterilizationItem[];
  };
  gallery: {
    enabled: boolean;
    badge: string;
    badgeSubtitle: string;
    title: string;
    description: string;
    slides: AboutGallerySlide[];
  };
  services: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    items: AboutServiceItem[];
  };
  testimonials: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    ratingValue: string;
    items: AboutTestimonialItem[];
  };
  contact: {
    enabled: boolean;
    badge: string;
    title: string;
    addressTitle: string;
    addressText: string;
    phoneTitle: string;
    phone1: string;
    phone2: string;
    phone1Display: string;
    phone2Display: string;
    hoursTitle: string;
    hoursText: string;
    hoursEmergencyText: string;
    mapImage: string;
    mapPinLabel: string;
    amenitiesTitle: string;
    amenitiesDesc: string;
    neshanUrl: string;
    baladUrl: string;
    googleMapsUrl: string;
  };
  cta: {
    enabled: boolean;
    badge: string;
    badgeIcon: string;
    title: string;
    description: string;
    buttonText: string;
    phone: string;
    phoneDisplay: string;
  };
}

export interface ContactPageFaqItem {
  id: string;
  q: string;
  a: string;
}

export interface ContactPageCommuterCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactPageSettingsType {
  hero: {
    enabled: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    amenities: { id: string; icon: string; text: string }[];
  };
  quickCards: {
    enabled: boolean;
    addressCard: {
      enabled: boolean;
      title: string;
      text: string;
      footerText: string;
      footerIcon: string;
    };
    phoneCard: {
      enabled: boolean;
      title: string;
      description: string;
      phone1: string;
      phone2: string;
      phone1Display: string;
      phone2Display: string;
      whatsappPhone: string;
      whatsappDisplay: string;
      footerButtonText: string;
    };
    hoursCard: {
      enabled: boolean;
      title: string;
      weekdayHours: string;
      thursdayHours: string;
      emergencyHours: string;
      footerText: string;
    };
    amenitiesCard: {
      enabled: boolean;
      title: string;
      text: string;
      footerText: string;
    };
  };
  mapAndRouting: {
    enabled: boolean;
    badge: string;
    title: string;
    cityTag: string;
    mapImage: string;
    mapPinTitle: string;
    mapBottomBadge: string;
    mapBottomLocation: string;
    neshanUrl: string;
    baladUrl: string;
    googleMapsUrl: string;
    snappUrl: string;
    drivingGuideTitle: string;
    carGuideTitle: string;
    carGuideText: string;
    transitGuideTitle: string;
    transitGuideText: string;
    doctorBadgeEnabled: boolean;
    doctorBadgeTitle: string;
    doctorBadgeSubtitle: string;
    doctorBadgeButtonText: string;
  };
  triageAndBooking: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    phoneBoxTitle: string;
    statusBadgeText: string;
    phone1: string;
    phone2: string;
    phone1Display: string;
    phone2Display: string;
    hoursNotice: string;
    whatsappEnabled: boolean;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappPhone: string;
    whatsappButtonText: string;
    emergencyEnabled: boolean;
    emergencyTitle: string;
    emergencyDescription: string;
    trustBadgeText: string;
  };
  commuters: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    cards: ContactPageCommuterCard[];
  };
  faqs: {
    enabled: boolean;
    badge: string;
    title: string;
    items: ContactPageFaqItem[];
  };
  cta: {
    enabled: boolean;
    title: string;
    description: string;
    phone: string;
    phoneDisplay: string;
    buttonText: string;
  };
}

export const defaultContactPageSettings: ContactPageSettingsType = {
  hero: {
    enabled: true,
    badge: 'مجتمع پزشکی راستین • مرکز تخصصی پاکدشت',
    title: 'تماس با ما و دسترسی حضوری به',
    titleHighlight: 'کلینیک دندان‌پزشکی پارمیس',
    description: 'پذیرای مراجعین گرامی از پاکدشت، فرون‌آباد، قیام‌دشت، شریف‌آباد، مامازند، ورامین و ساکنین شرق استان تهران. تجربه درمانی آرام، مجهز به مدرن‌ترین دستگاه‌های تصویربرداری و ایمپلنت زیر نظر دکتر انوشیروان شمس پور.',
    amenities: [
      { id: 'am1', icon: 'chair', text: 'امکانات رفاهی کلینیک' },
      { id: 'am2', icon: 'elevator', text: 'آسانسور فعال' },
      { id: 'am3', icon: 'local_parking', text: 'فضای مناسب پارک خودرو' },
    ],
  },
  quickCards: {
    enabled: true,
    addressCard: {
      enabled: true,
      title: 'نشانی دقیق مطب',
      text: 'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
      footerText: 'طبقه دوم با آسانسور فعال',
      footerIcon: 'elevator',
    },
    phoneCard: {
      enabled: true,
      title: 'تلفن و پیام‌رسان',
      description: 'خط ویژه پذیرش، هماهنگی نوبت و مشاوره رایگان درمان:',
      phone1: '02136048581',
      phone2: '02136048582',
      phone1Display: '۰۲۱۳۶۰۴۸۵۸۱',
      phone2Display: '۰۲۱۳۶۰۴۸۵۸۲',
      whatsappPhone: '989215395923',
      whatsappDisplay: '۰۹۲۱۵۳۹۵۹۲۳ (پشتیبانی واتساپ)',
      footerButtonText: 'برقراری تماس فوری تلفنی',
    },
    hoursCard: {
      enabled: true,
      title: 'ساعات کاری و پذیرش',
      weekdayHours: '۱۰:۰۰ الی ۲۰:۰۰',
      thursdayHours: '۱۰:۰۰ الی ۲۰:۰۰',
      emergencyHours: 'فقط اورژانس با هماهنگی',
      footerText: 'شنبه تا پنجشنبه، ۱۰:۰۰ الی ۲۰:۰۰',
    },
    amenitiesCard: {
      enabled: true,
      title: 'امکانات رفاهی و دسترسی',
      text: 'دارای فضای مناسب جهت پارک خودرو، مجهز به آسانسور فعال، داروخانه مستقر در مجتمع پزشکی راستین و امکانات رفاهی کامل در داخل کلینیک پارمیس جهت آسایش مراجعین.',
      footerText: 'داروخانه در مجتمع و فضای مناسب پارک',
    },
  },
  mapAndRouting: {
    enabled: true,
    badge: 'موقعیت مکانی و ناوبری',
    title: 'نقشه و دسترسی به کلینیک پارمیس',
    cityTag: 'پاکدشت • مجتمع راستین',
    mapImage: CLINIC_INFO.mapImage,
    mapPinTitle: 'دندان‌پزشکی پارمیس (دکتر شمس پور)',
    mapBottomBadge: 'مجتمع پزشکی راستین: دارای داروخانه و آسانسور فعال',
    mapBottomLocation: 'طبقه دوم • کلینیک پارمیس',
    neshanUrl: CLINIC_INFO.neshanUrl,
    baladUrl: CLINIC_INFO.baladUrl,
    googleMapsUrl: CLINIC_INFO.googleMapsUrl,
    snappUrl: 'https://snapp.ir',
    drivingGuideTitle: 'راهنمای دسترسی از تهران و مناطق اطراف:',
    carGuideTitle: 'مسیر خودرو شخصی از تهران (افسریه):',
    carGuideText: 'بزرگراه امام رضا (ع)، عبور از سه‌راه خاورشهر و قیام‌دشت، ورود به پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین.',
    transitGuideTitle: 'مسیر با وسایل حمل‌ونقل عمومی:',
    transitGuideText: 'پایانه تاکسی و اتوبوس مترو خاوران یا سه‌راه افسریه به مقصد پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب.',
    doctorBadgeEnabled: true,
    doctorBadgeTitle: 'دکتر انوشیروان شمس پور',
    doctorBadgeSubtitle: 'عضو نظام پزشکی • ارائه‌دهنده پیشرفته‌ترین درمان‌های ایمپلنت و زیبایی در پاکدشت',
    doctorBadgeButtonText: 'تماس جهت هماهنگی',
  },
  triageAndBooking: {
    enabled: true,
    badge: 'پذیرش و هماهنگی تلفنی مستقیم',
    title: 'راهنمای دریافت نوبت معاینه و ویزیت',
    description: 'در این مرکز برای حفظ احترام به زمان شما و پرهیز از تداخل ساعات و معطلی، نوبت‌دهی آنلاین وجود ندارد و تمامی نوبت‌ها صرفاً از طریق گفتگوی تلفنی مستقیم با کادر پذیرش هماهنگ می‌شود.',
    phoneBoxTitle: 'شماره‌های تماس مستقیم پذیرش مطب:',
    statusBadgeText: 'پاسخگویی فعال',
    phone1: '02136048581',
    phone2: '02136048582',
    phone1Display: '۰۲۱۳۶۰۴۸۵۸۱',
    phone2Display: '۰۲۱۳۶۰۴۸۵۸۲',
    hoursNotice: 'شنبه تا پنجشنبه، ۱۰:۰۰ الی ۲۰:۰۰',
    whatsappEnabled: true,
    whatsappTitle: 'ارسال عکس دندان و مشاوره در واتساپ',
    whatsappDescription: 'می‌توانید عکس لبخند یا رادیوگرافی (OPG) خود را به واتساپ کلینیک ارسال فرمایید تا برآورد اولیه هزینه و نیاز به تعداد جلسات به شما اعلام گردد.',
    whatsappPhone: '989215395923',
    whatsappButtonText: 'ارسال پیام به واتساپ کلینیک: ۰۹۲۱۵۳۹۵۹۲۳',
    emergencyEnabled: true,
    emergencyTitle: 'موارد اورژانسی و دندان‌درد حاد:',
    emergencyDescription: 'بیماران دارای درد شدید بدون نوبت قبلی در اولویت پذیرش قرار می‌گیرند. لطفاً قبل از مراجعه سریعاً با ۰۲۱۳۶۰۴۸۵۸۱ یا ۰۲۱۳۶۰۴۸۵۸۲ تماس بگیرید.',
    trustBadgeText: 'کلینیک تخصصی دندان‌پزشکی پارمیس • مجتمع پزشکی راستین پاکدشت',
  },
  commuters: {
    enabled: true,
    badge: 'تسهیلات بیماران محترم شهرستان‌های همجوار',
    title: 'خدمات ویژه مراجعین شریف‌آباد، قیام‌دشت، فرون‌آباد و ورامین',
    description: 'برای مراجعینی که از تهران و شهرهای اطراف تشریف می‌آورند تمهیدات ویژه‌ای در نظر گرفته شده است:',
    cards: [
      {
        id: 'c1',
        icon: 'event_available',
        title: 'ویزیت و درمان تک‌جلسه‌ای',
        description: 'انجام چند درمان همزمان (جرم‌گیری، ترمیم و عصب‌کشی) در یک نوبت تجمیعی جهت جلوگیری از رفت‌وآمد مکرر بین‌شهری.',
      },
      {
        id: 'c2',
        icon: 'chat_paste_go',
        title: 'مشاوره با عکس قبل از حرکت',
        description: 'امکان ارسال عکس رادیوگرافی (OPG) به واتساپ کلینیک و اعلام هزینه تقریبی و نیاز به تعداد جلسات پیش از مراجعه حضوری.',
      },
      {
        id: 'c3',
        icon: 'local_parking',
        title: 'فضای پارک مناسب و امکانات رفاهی',
        description: 'فضای مناسب جهت پارک خودرو در مجاورت ساختمان، داروخانه مستقر در مجتمع راستین، آسانسور فعال و امکانات رفاهی کامل در داخل کلینیک برای همراهان محترم.',
      },
    ],
  },
  faqs: {
    enabled: true,
    badge: 'پاسخ به ابهامات متداول',
    title: 'پرسش‌های پرتکرار مراجعین مطب پاکدشت',
    items: [
      {
        id: 'faq-1',
        q: 'نحوه هماهنگی نوبت ویزیت در کلینیک پارمیس به چه صورت است؟',
        a: 'در کلینیک دندان‌پزشکی دکتر انوشیروان شمس پور، به منظور احترام به وقت مراجعین عزیز و جلوگیری از هرگونه معطلی در سالن انتظار، نوبت‌دهی آنلاین حذف شده و صرفاً از طریق تماس تلفنی مستقیم با خطوط ویژه ۰۲۱۳۶۰۴۸۵۸۱ و ۰۲۱۳۶۰۴۸۵۸۲ انجام می‌پذیرد تا منشی کلینیک دقیق‌ترین زمان خالی را متناسب با برنامه زمانی شما ثبت و فیکس نماید.',
      },
      {
        id: 'faq-2',
        q: 'در صورت مواجهه با درد شدید و نیاز به خدمات اورژانسی چه باید کرد؟',
        a: 'بیماران دارای درد حاد دندانی یا تورم، در اولویت تریاژ کلینیک قرار داشته و در همان روز بدون معطلی پذیرش می‌شوند. لطفاً قبل از حرکت با شماره‌های ۰۲۱۳۶۰۴۸۵۸۱ یا ۰۲۱۳۶۰۴۸۵۸۲ تماس حاصل فرمایید تا تمهیدات لازم جهت استقرار فوری بر روی یونیت فراهم گردد.',
      },
      {
        id: 'faq-3',
        q: 'قرارداد بیمه‌های تکمیلی و ارائه فاکتور رسمی به چه شکل است؟',
        a: 'کلیه فاکتورها، شرح خدمات و گواهی‌های دندان‌پزشکی با مهر رسمی دکتر انوشیروان شمس پور به همراه عکس رادیوگرافی قبل و بعد صادر می‌شود تا مراجعین محترم بتوانند ۱۰۰٪ سهم بیمه‌های تکمیلی معتبر (ایران، دانا، آسیا، البرز، آتیه‌سازان و...) را دریافت نمایند.',
      },
      {
        id: 'faq-4',
        q: 'آیا جلسه اول معاینه و مشاوره زیبایی هزینه دارد؟',
        a: 'خیر؛ جلسه اول معاینه بالینی، بررسی وضعیت دندان‌ها، ارزیابی عکس رادیوگرافی و برآورد طرح درمان کامپوزیت، لمینت یا ایمپلنت در کلینیک پارمیس پاکدشت کاملاً رایگان است.',
      },
      {
        id: 'faq-5',
        q: 'آیا مجتمع پزشکی راستین دارای آسانسور برای تردد سالمندان و کالسکه است؟',
        a: 'بله، ورودی مجتمع پزشکی راستین کاملاً هم‌سطح خیابان بوده و مجهز به آسانسور استاندارد با ظرفیت مناسب جهت تردد سالمندان، مراجعین با ویلچر یا کالسکه تا درب کلینیک پارمیس در طبقه دوم می‌باشد.',
      },
    ],
  },
  cta: {
    enabled: true,
    title: 'نیاز به راهنمایی تلفنی فوری دارید؟',
    description: 'کارشناس پذیرش کلینیک پارمیس در ساعات کاری آماده پاسخگویی و ثبت زمان ویزیت شماست.',
    phone: CLINIC_INFO.phone2,
    phoneDisplay: CLINIC_INFO.phoneDisplay2,
    buttonText: 'تماس مستقیم',
  },
};

export const defaultServicesPageSettings: ServicesPageSettingsType = {
  hero: {
    enabled: true,
    badge: 'مجتمع پزشکی راستین • پاکدشت | تحت نظارت دکتر انوشیروان شمس پور',
    badgeIcon: 'verified',
    title: 'خدمات تخصصی درمان و ',
    titleHighlight: 'اصلاح طرح لبخند',
    description: 'ارائه پیشرفته‌ترین خدمات دندانپزشکی در پاکدشت توسط دکتر انوشیروان شمس پور با دستگاه‌های مدرن، بدون استرس و درد.',
    bannerImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    bannerAlt: 'زیبایی طبیعی و لبخندی بااعتمادبه‌نفس',
    bannerCaptionTitle: 'زیبایی طبیعی و لبخندی بااعتمادبه‌نفس',
    bannerCaptionDesc: 'تضمین ظرافت، شفافیت مینای طبیعی و سلامت کامل بافت لثه',
    bannerTechnologyTag: 'تکنولوژی ۲۰۲۴',
    floatingBadgeIcon: 'health_and_safety',
    floatingBadgeTitle: '۱۰۰٪ استریلیزاسیون دیجیتال',
    floatingBadgeDesc: 'اتوکلاو کلاس B و پکینگ استاندارد',
    highlights: [
      {
        id: 'hl-1',
        icon: 'auto_fix_high',
        title: 'طراحی لبخند DSD',
        desc: 'مشاهده فرم و نتیجه نهایی لبخند قبل از شروع هرگونه تراش یا کار درمانی، متناسب با هارمونی اجزای چهره شما.',
      },
      {
        id: 'hl-2',
        icon: 'biotech',
        title: 'متریال‌های درجه‌یک جهانی',
        desc: 'به‌کارگیری کامپوزیت‌های نانوهیبرید ژاپنی (توکویاما، گرادیو) و پرسلین‌های سرامیکی آلمانی (ایماکس و زیرکونیا).',
      },
      {
        id: 'hl-3',
        icon: 'sentiment_satisfied',
        title: 'درمان بدون درد و اضطراب',
        desc: 'تکنیک‌های نوین بی‌حسی کامپیوتری و محیط روان‌شناختی آرام برای تجربه درمانی کاملاً راحت و لذت‌بخش.',
      },
    ],
  },
  implant: {
    enabled: true,
    badge: 'کاشت تخصصی و بادوام',
    badgeIcon: 'stars',
    guaranteeBadge: 'ضمانت کتبی',
    title: 'ایمپلنت دندان با سیستم‌های سوئیسی و کره‌ای',
    description: 'جایگزینی دائمی دندان‌های از دست رفته با روش بارگذاری فوری و بدون درد همراه با بازسازی و پودر استخوان تحت نظر دکتر شمس پور در پاکدشت.',
    features: [
      { id: 'imp-f1', title: 'کاشت فوری یک‌روزه', subtitle: 'تحویل روکش موقت در کوتاه‌ترین زمان', icon: 'check_circle' },
      { id: 'imp-f2', title: 'سازگاری ۱۰۰٪ با بافت فک', subtitle: 'جراحی با گاید جراحی و زاویه‌گذاری میکرومتری', icon: 'check_circle' },
      { id: 'imp-f3', title: 'بدون احساس درد و خونریزی', subtitle: 'پیوند پودر استخوان و سینوس‌لیفت بازسازی حجم', icon: 'check_circle' },
      { id: 'imp-f4', title: 'امکان پرداخت اقساطی', subtitle: 'ضمانت اصالت فیکسچر با شناسنامه و سرتیفیکیت معتبر', icon: 'check_circle' },
    ],
    buttonText: 'رزرو ویزیت و اسکن رایگان',
    buttonPhone: '02136048581',
    paymentNote: 'امکان شرایط پرداخت مرحله‌ای برای بیماران گرامی',
    surgeryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKrSgjql8rQcv4RpNnfwiyScrKVDXboKzRM8s46NNk6CUSJyMzttK1piNpxJ7LvMiPma4D9S1oI_701T0QOHVjb_7eppM26KWUqIbnMRylAfXytkFHHuT8viiGJvpHpdNswei0yDvY_bjz5g93Z5pieOZfZoXvZrPZqDTPIxD_oA5UEgcGC6WZOA17Yy_Te2zR2aGIRQVLEXR2aTypHuT4jVasZGIrImiqO8pwmx-wFJWBjSiI5K3u',
    surgeryImageAlt: 'بخش جراحی مجهز کلینیک پارمیس',
    surgeryImageTitle: 'بخش جراحی مجهز کلینیک پارمیس',
    surgeryImageSubtitle: 'پاکدشت • مجتمع پزشکی راستین',
  },
  cosmeticCategory: {
    enabled: true,
    badge: 'دندانپزشکی زیبایی',
    badgeIcon: 'auto_fix_high',
    title: 'خدمات دندان‌پزشکی زیبایی و طرح لبخند',
    description: 'اصلاح فرم، رنگ، قرینگی و فواصل دندان‌ها با کمترین تهاجم به بافت طبیعی دندان زیر نظر مستقیم دکتر انوشیروان شمس پور',
    consultationText: 'دریافت مشاوره تخصصی زیبایی',
    cards: [
      {
        id: 'cosm-1',
        title: 'ونیر کامپوزیت لایه‌ای',
        badge: '۱ جلسه',
        badgeType: 'primary',
        description: 'فرم‌دهی و سفیدی طبیعی دندان با کامپوزیت‌های برند Tokuyama و IPS بدون تراش بافت سالم دندان.',
        duration: '۱ الی ۲ جلسه',
        lifespan: '۵ تا ۷ سال',
        technique: 'بدون تراش (Non-Prep)',
        icon: 'arrow_back_ios_new',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Cls8ndyoJQ958L6DWc2pyJUw4OQdGOv5_TtKlzg2ClInSC-1FtxuBoDx_Z_czPaOXJ2zY-yreTQzJy8GxkNmMXMDFNCse2iAgAoPScRAxQKKlSQBpB3mW2XsL7lKQxROhiNk3Cvac3NoU8U9ld891GuwnkU2dRQmrTwN77-PDoVmw3wRHIhBAS0RYEu7QEbx67c6lI1R9eT5-v_9-8LYOlXKk1zEZhTMtjnl4gjfKxDjR6BcYGlH',
        ctaText: 'درخواست مشاوره کامپوزیت',
      },
      {
        id: 'cosm-2',
        title: 'لمینت سرامیکی (پرسلین E-max)',
        badge: 'محبوب‌ترین درمان',
        badgeType: 'secondary',
        description: 'شفافیت خیره‌کننده، عدم رنگ‌پذیری و مقاومت بالا ساخته شده با فناوری کدکم (CAD/CAM).',
        duration: '۲ الی ۳ جلسه',
        lifespan: '۱۰ الی ۱۵ سال+',
        technique: '۱۰۰٪ دائمی و ضدلکه',
        icon: 'diamond',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJW3Osvn9zhZ0Xi60RRmGEN-hgHBedOHW5Jkh-hkpBdXjE9NPPgej15Aa_ObQoHpGi34mbkpelvsUaR27yM6SxWIQEpfT-irWc3JP6hWvOiRHkVuocJC9Dvxd2mkYHHQ8AvZfkQeWFNQz3Lsn5vLWw9199tkTvGAusmyI8cwoN0AHbWIRCp_ImnOWd6O_7Y7-W_BcxR__67AtLZ6OeM1ZofgaEIXiiNU59y5zFAGU_g_ASl6osXgYr',
        ctaText: 'درخواست مشاوره لمینت',
      },
      {
        id: 'cosm-3',
        title: 'بلیچینگ آفیس (سفید کردن مطب)',
        badge: 'روشن‌سازی ۳ الی ۵ درجه',
        badgeType: 'neutral',
        description: 'سفید کردن تخصصی دندان‌ها با اشعه و ژل‌های ضد حساسیت در کمتر از یک ساعت بدون آسیب مینا.',
        duration: 'تنها ۴۵ دقیقه',
        lifespan: '۱ الی ۲ سال',
        technique: '۳ تا ۸ درجه شفاف‌تر',
        icon: 'light_mode',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQdKsne2FmqtqnadFNoMC2Uawl4pEoCKhy4CGOWNTuZ3ZgokHw-5B36F8AdsvZAjq82U0ZSmt0GizDMaukErEvPHI_aOopV9ydc97KL-VMA7VQ3yOUwnm6-D1upRcVDKpp6wEYWIjVxatsNZIXFdO14xIrjaZPkV_64GnbfDhU1V4aq7Rwp8s5QhCcjOo28e4PCUYpeB_3iIYsO0IoRv34rabS796IF8xJjgjErA4x7ZP8GnPprZLp',
        ctaText: 'درخواست مشاوره بلیچینگ',
      },
      {
        id: 'cosm-4',
        title: 'بستن دیاستم و فرم لبه',
        badge: 'یک جلسه کوتاه',
        badgeType: 'neutral',
        description: 'ترمیم لب‌پریدگی‌ها، بستن فواصل بین دندان‌های قدامی و کانتورینگ لثه و دندان برای برقراری توازن متقارن لبخند.',
        duration: 'یک جلسه کوتاه',
        lifespan: 'طولانی‌مدت',
        technique: 'باندینگ زیبایی',
        icon: 'shape_line',
        ctaText: 'درخواست مشاوره دیاستم',
      },
    ],
  },
  restorativeCategory: {
    enabled: true,
    badge: 'سلامت، عملکرد و نگهداری دندان طبیعی',
    badgeIcon: 'medical_services',
    title: 'خدمات درمانی، ترمیمی و اندودانتیکس',
    description: 'اولویت نخست کلینیک پارمیس در پاکدشت، حفظ ساختار طبیعی دندان با بالاترین استاندارد ارزیابی رادیوگرافی و کنترل عفونت است.',
    cards: [
      {
        id: 'rest-1',
        title: 'عصب‌کشی تخصصی (اندو)',
        badge: 'درمان ریشه ۱ تا ۴ کانال',
        badgeType: 'primary',
        description: 'پاکسازی دقیق کانال‌های ریشه با دستگاه اندوروتاری و اپکس‌لوکیتور دیجیتال جهت تعیین اندازه میکرومتری کانال با کمترین احساس درد.',
        duration: '۱ تا ۲ جلسه درمانی',
        lifespan: 'طولانی‌مدت با مراقبت',
        technique: 'موتور روتاری دیجیتال',
        icon: 'precision_manufacturing',
        ctaText: 'اطلاعات بیشتر',
        checklist: [
          'کاهش زمان جلسه درمان و احساس راحتی کامل فک',
          'مهروموم سه بعدی کانال‌ها برای جلوگیری از عود مجدد',
        ],
      },
      {
        id: 'rest-2',
        title: 'ترمیم با مواد همرنگ دندان',
        badge: 'مواد نانوسرامیک آلمانی',
        badgeType: 'secondary',
        description: 'برداشت پوسیدگی‌ها و پر کردن با کامپوزیت‌های نانوهیبرید مستحکم که پیوند میکرومکانیکی با ساختار دندان تشکیل می‌دهند.',
        duration: '۱ جلسه',
        lifespan: 'بسیار مقاوم و همرنگ',
        technique: 'حذف کامل آمالگام تیره',
        icon: 'contrast',
        ctaText: 'اطلاعات بیشتر',
        checklist: [
          'تطابق رنگ کاملاً طبیعی با دندان‌های مجاور',
          'استحکام مکانیکی بسیار بالا در دندان‌های خلفی آسیا',
        ],
      },
      {
        id: 'rest-3',
        title: 'جرم‌گیری و بروساژ عمیق',
        badge: 'دستگاه التراسونیک بدون لرزش',
        badgeType: 'neutral',
        description: 'زدودن پلاک‌های باکتریایی میکروبی زیر و بالای لثه با دستگاه اولتراسونیک پیه‌زو بدون وارد شدن ذره‌ای آسیب به مینا.',
        duration: '۳۰ تا ۴۵ دقیقه',
        lifespan: 'سلامت ۱۰۰٪ لثه',
        technique: 'اولتراسونیک پیه‌زو',
        icon: 'clean_hands',
        ctaText: 'اطلاعات بیشتر',
        checklist: [
          'رفع قطعی بوی نامطبوع دهان و خونریزی لثه هنگام مسواک',
          'بروساژ با خمیرهای براق‌کننده تخصصی مینا',
        ],
      },
      {
        id: 'rest-4',
        title: 'روکش زیرکونیا و سرامیک',
        badge: 'زیرکونیای چندلایه‌ای High Translucent',
        badgeType: 'primary',
        description: 'ساخت پروتزهای دقیق با اسکنرهای سه‌بعدی بدون استفاده از فلز، با عدم ایجاد هاله تیرگی در لبه لثه و بالاترین تطابق با بافت بیولوژیک فک.',
        duration: '۲ جلسه',
        lifespan: 'فوق‌العاده با دوام',
        technique: 'طراحی با نرم‌افزارهای CAD/CAM',
        icon: 'shield',
        ctaText: 'اطلاعات بیشتر',
        checklist: [
          'تحمل فشارهای سنگین جویدن در دندان‌های عقبی',
          'عدم ایجاد خط سیاه لثه و تطابق کامل با رنگ دندان',
        ],
      },
      {
        id: 'rest-5',
        title: 'جراحی دندان عقل نهفته',
        badge: 'تکنیک محافظت از عصب فک',
        badgeType: 'secondary',
        description: 'جراحی کم‌تهاجمی دندان‌های عقل نهفته و نیمه‌نهفته با بررسی فاصله از عصب فک پایین، بدون تورم و درد شدید.',
        duration: '۱ جلسه',
        lifespan: 'ترمیم سریع بافت',
        technique: 'بررسی رادیوگرافی دقیق',
        icon: 'medical_information',
        ctaText: 'اطلاعات بیشتر',
        checklist: [
          'پیشگیری از به هم ریختگی ردیف دندان‌های ارتودنسی‌شده',
          'بخیه با نخ‌های بهداشتی جاذب یا غیرقابل‌جذب مرغوب',
        ],
      },
    ],
    promoCard: {
      enabled: true,
      badge: 'ویزیت و چکاپ دوره‌ای',
      badgeIcon: 'alarm',
      title: 'آیا نیاز به معاینه حضوری دارید؟',
      description: 'جهت ارزیابی اولیه، گرفتن عکس تشخیصی و دریافت برآورد کامل هزینه‌ها، هم‌اکنون با منشی کلینیک پارمیس در پاکدشت تماس بگیرید.',
      buttonText: 'تماس مستقیم',
      phone: '02136048581',
      locationText: 'پاکدشت، مجتمع پزشکی راستین',
    },
  },
  journey: {
    enabled: true,
    badge: 'مسیر شفاف درمان',
    badgeIcon: 'route',
    title: 'مراحل مراجعه و انجام خدمات در کلینیک پارمیس',
    description: 'ما فرآیند درمان را از نخستین تماس تا چکاپ‌های سالیانه به شکلی منسجم، شفاف و بدون معطلی طراحی کرده‌ایم.',
    steps: [
      {
        id: 'step-1',
        stepNumber: '۱',
        title: 'معاینه و ارزیابی دیجیتال',
        desc: 'بررسی دقیق بالینی توسط دکتر شمس پور همراه با عکس‌برداری دیجیتال داخل‌دهانی، ثبت تاریخچه دندانی و بررسی سلامت عمومی بافت‌ها.',
        icon: 'route',
      },
      {
        id: 'step-2',
        stepNumber: '۲',
        title: 'طرح درمان و شفافیت هزینه',
        desc: 'تنظیم نقشه درمانی گام‌به‌گام با اولویت‌بندی رفع درد و پوسیدگی‌ها، برآورد دقیق تعرفه‌ها و تعیین جلسات بر اساس زمان آزاد بیمار.',
        icon: 'description',
      },
      {
        id: 'step-3',
        stepNumber: '۳',
        title: 'اجرای درمان بدون درد',
        desc: 'انجام درمان با جدیدترین متدهای بی‌حسی موضعی در محیطی کاملاً آرام‌بخش و رعایت تمام ضوابط استریلیزاسیون استاندارد بیمارستانی.',
        icon: 'healing',
      },
      {
        id: 'step-4',
        stepNumber: '۴',
        title: 'پیگیری و چکاپ‌های دوره‌ای',
        desc: 'پشتیبانی مداوم پس از اتمام کار، ارائه آموزش‌های مراقبت بهداشتی خانگی و یادآوری دوره‌ای جلسات پولیش و چکاپ رایگان.',
        icon: 'verified',
      },
    ],
  },
  faqs: {
    enabled: true,
    badge: 'پاسخ به ابهامات پرتکرار',
    badgeIcon: 'help',
    title: 'پرسش‌های متداول درباره خدمات درمان و زیبایی',
    description: 'اگر پاسخ سوال خود را نیافتید، با شماره کلینیک تماس بگیرید تا کارشناسان ما شما را راهنمایی کنند.',
    items: [
      {
        id: 'faq-1',
        q: 'تفاوت اصلی لمینت سرامیکی با ونیر کامپوزیت چیست؟',
        a: 'لمینت سرامیکی در لابراتوار ساخته می‌شود، ماندگاری بالای ۱۵ سال دارد و به هیچ وجه دچار تغییر رنگ یا لکه نمی‌شود. در مقابل، ونیر کامپوزیت مستقیماً در مطب طی یک جلسه روی دندان کار می‌شود، نیاز به تراش ندارد و هزینه مناسب‌تری دارد اما نیازمند پولیش دوره‌ای سالیانه است.',
      },
      {
        id: 'faq-2',
        q: 'آیا درمان ونیر کامپوزیت باعث تراش دندان می‌شود؟',
        a: 'خیر، در روش ونیر کامپوزیت مدرن در کلینیک دکتر شمس پور، در ۹۰ درصد موارد هیچ‌گونه تراش یا آسیب به مینای طبیعی دندان وارد نمی‌شود و کار به‌صورت محافظه‌کارانه انجام می‌پذیرد.',
      },
      {
        id: 'faq-3',
        q: 'آیا درمان‌های دندان‌پزشکی در کلینیک پارمیس با درد همراه است؟',
        a: 'خیر؛ در کلینیک دکتر شمس پور از بی‌حسی‌های مدرن با pH خنثی و سوزن‌های فوق‌العاده نازک استفاده می‌شود تا ورود مایع بی‌حسی نیز احساس نشود. برای بیماران با استرس بالا، تکنیک‌های آرام‌بخشی روانشناختی و بی‌حسی مرحله‌ای انجام می‌گیرد.',
      },
      {
        id: 'faq-4',
        q: 'ماندگاری بلیچینگ (سفیدکردن دندان) چقدر است؟',
        a: 'ماندگاری بلیچینگ بین ۱ تا ۲ سال است که بسته به میزان مصرف چای، قهوه، دخانیات و رعایت بهداشت دهان و دندان می‌تواند طولانی‌تر باشد.',
      },
      {
        id: 'faq-5',
        q: 'شرایط پرداخت هزینه و تعرفه‌های خدمات در پاکدشت چگونه است؟',
        a: 'تمامی هزینه‌ها در جلسه اول معاینه به‌صورت مکتوب و شفاف اعلام می‌گردد. برای درمان‌های جامع نظیر ایمپلنت چندواحدی، ارتودنسی یا اصلاح کامل لبخند با کامپوزیت و لمینت، امکان پرداخت مرحله‌ای و اقساطی در طول دوره درمان برای مراجعین محترم پاکدشت فراهم است.',
      },
      {
        id: 'faq-6',
        q: 'چگونه می‌توانم برای مشاوره اولیه یا ویزیت نوبت رزرو کنم؟',
        a: 'کافی است با شماره‌های مستقیم مطب ۰۲۱۳۶۰۴۸۵۸۱ و ۰۲۱۳۶۰۴۸۵۸۲ تماس حاصل فرمایید. همکاران پذیرش نزدیک‌ترین زمان خالی متناسب با برنامه شما در مجتمع پزشکی راستین پاکدشت را هماهنگ خواهند کرد.',
      },
    ],
  },
  cta: {
    enabled: true,
    badge: 'پاکدشت، مجتمع پزشکی راستین • طبقه اختصاصی پارمیس',
    badgeIcon: 'location_on',
    title: 'لبخندی بی‌نقص، سالم و درخشان را با اطمینان تجربه کنید',
    description: 'جهت مشاوره تلفنی رایگان با تیم تخصصی دکتر انوشیروان شمس پور و رزرو وقت ویزیت، هم‌اکنون با ما در تماس باشید.',
    buttonText: 'تماس و رزرو وقت ویزیت',
    phone: '02136048582',
    phoneDisplay: '۰۲۱۳۶۰۴۸۵۸۲',
  },
};

export const defaultGalleryPageSettings: GalleryPageSettingsType = {
  hero: {
    enabled: true,
    badge: 'مستندات واقعی کلینیک پارمیس • مجتمع پزشکی راستین پاکدشت',
    title: 'گالری مستند و واقعی ',
    titleHighlight: 'لبخندهای دگرگون‌شده',
    description: 'هر لبخند یک شاهکار پزشکی منحصربه‌فرد است. تمامی نمونه‌های زیر بدون فیلتر و روتوش فتوشاپ، توسط دکتر انوشیروان شمس پور با پیشرفته‌ترین تکنولوژی‌های اسکن سه‌بعدی و متریال درجه‌یک سوییسی و آلمانی درمان شده‌اند. می‌توانید لغزنده را به چپ و راست بکشید تا نتیجه تغییر را با جزئیات مقایسه کنید.',
    primaryButtonText: 'مشاهده پرونده‌ها و مقایسه‌ها',
    phoneButtonText: 'مشاوره ویزیت رایگان',
    featuredCardImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9IOcy7S7dxAxm2-5P261mSvnBAVLG3Om-maCCHtYzBuz6leLuV1PwxstWlzPV6LGJ0a9rflTBfsIMTSkAmvumYhJMOY5sivlEikShJmpXCxb_8H0lvjjGGaOGb7pBOsqSDHFlyaw663RSwJGTbMlkrP8JimiQsUEKKScYZXRJq4D9sA464cBAnmjMYoem9blqoEJY4xPEHvxTOCdMcTEoZB1-axAi-d6NCPp_d3HrbbOhEadoMD_M',
    featuredCardTitle: 'اصلاح جامع ۸ واحد لمینت سرامیکی',
    featuredCardSubtitle: 'کیس خانم م. رضایی • مراجع از پاکدشت',
    featuredCardBadge: 'قبل / بعد',
    doctorName: 'دکتر انوشیروان شمس پور',
    doctorSubtitle: 'عضو انجمن دندانپزشکان ترمیمی ایران',
    metrics: [
      { id: 'm-1', value: '+۴,۰۰۰', label: 'طراحی لبخند موفق' },
      { id: 'm-2', value: '۹۹.۴٪', label: 'رضایت مراجعین پاکدشت' },
      { id: 'm-3', value: 'CAD/CAM', label: 'اسکن و تراش دیجیتال' },
      { id: 'm-4', value: '۱۰ ساله', label: 'ضمانت اصالت متریال' },
    ],
  },
  filterChips: {
    enabled: true,
    categories: [
      { id: 'all', label: 'همه درمان‌ها', icon: 'auto_awesome', enabled: true, order: 0 },
      { id: 'composite', label: 'کامپوزیت ونیر نانوسرامیک', icon: 'auto_fix_high', enabled: true, order: 1 },
      { id: 'laminate', label: 'لمینت پرسلن E-Max', icon: 'diamond', enabled: true, order: 2 },
      { id: 'implant', label: 'ایمپلنت دیجیتال', icon: 'dentistry', enabled: true, order: 3 },
      { id: 'orthodontics', label: 'ارتودنسی و مرتب‌سازی', icon: 'shape_line', enabled: true, order: 4 },
      { id: 'gummy', label: 'اصلاح لبخند لثه‌ای', icon: 'sentiment_satisfied', enabled: true, order: 5 },
      { id: 'bleaching', label: 'بلیچینگ تخصصی', icon: 'light_mode', enabled: true, order: 6 },
      { id: 'rehabilitation', label: 'روکش زیرکونیا و بازسازی', icon: 'shield', enabled: true, order: 7 },
    ],
  },
  featuredCase: {
    enabled: true,
    badge: 'بررسی موردی تحلیلی (Featured Case)',
    title: 'مقایسه میکروسکوپی و خطی قبل و بعد درمان',
    description: 'اسلایدر زیر را به چپ و راست بکشید تا نتیجه مهندسی بیومیمتیک لبخند و تطابق رنگ را به صورت دقیق مشاهده نمایید.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzscmxMVvRDumERwuQX9KQ0_FszxLb082SDq_Tu6AlXaMPfjHAh73Uya8SwZFgprEWcYrxbUi8VzG00mgd-MfjwysASpb9of6RKpcr1ktG020DfdylwyGRJYctKzXMt4_CjF9fvTYFvslguYFmCbMF25J9rkty0mFLcnOpl3_5Z8ZSjJ3OObXugVUdZrE7pvbM0-BXx-_ydgDQg37caBnpA-Z0I3B8jdewHLmLQbXUtlTEdMgfCrFR',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Jd9Qc0GvRp1Jid5KGDm5Qh5Zs4u0Ki8ElujSFK2Q1LHfEXRZBaKN6HEufX2bGIjyemMeqTlr1TwJ2MHA9jm1IY1sF73IC5h0f15yHTE-gdRilaOAPWr073HFfmjGxAPGggqpCTBYPslIJ3psCBEeN6INpQDFYY65yKbldQCmH4BXN9HbB_iyhy13Vo1OpJrOxukMQH9yfC1LjsWyPHKOQqqLicv7Bv_xn1rOvaBLo_M3FetKp6kT',
    beforeLabel: 'وضعیت اولیه (قبل)',
    afterLabel: 'بعد از درمان (E-Max)',
    caseNumber: 'پرونده بالینی شماره #۸۹۲۴',
    unitBadge: '۸ واحد فک بالا',
    challengeTitle: 'چالش اولیه مراجع:',
    challengeDesc: 'سایش شدید دندانی ناشی از دندان‌قروچه، بدرنگی ژنتیکی مقاوم به بلیچینگ و نامنظمی لبه‌های اینسیزال.',
    planTitle: 'پلن درمانی دکتر شمس پور:',
    planDesc: 'طراحی لبخند دیجیتال (DSD)، جراحی افزایش طول تاج ملایم با لیزر دیود و لمینت سرامیکی پرسلن E-Max آلمانی.',
    duration: '۲ جلسه در طی ۹ روز در مطب پاکدشت',
    prepAmount: 'حداقلی (Micro-Prep 0.3mm)',
    buttonText: 'تماس جهت طرح درمان مشابه',
    satisfactionText: 'رضایت کامل ثبت‌شده',
    sliderInitialPosition: 50,
    sliderDividerColor: '#004ac6',
    beforeFloatingBadge: 'وضعیت اولیه دندان‌ها (قبل)',
    afterFloatingBadge: 'نتیجه نهایی درمان',
  },
  caseGrid: {
    enabled: true,
    badge: 'بانک پرونده‌های تصویری کلینیک پارمیس',
    badgeIcon: 'collections_bookmark',
    title: 'منتخب درمان‌های زیبایی و بازسازی دهان',
    description: 'هر کارت شامل اسلایدر تعاملی قبل و بعد، متریال مصرفی و تکنیک تخصصی اجرا شده در مطب پاکدشت است (لغزنده را جابجا کنید).',
    loadMoreText: 'مشاهده موارد بیشتر از گالری پاکدشت (موارد بالینی بیشتر)',
    collapseText: 'بستن موارد تکمیلی',
  },
  testimonials: {
    enabled: true,
    badge: 'تجربه صمیمانه بیماران',
    title: 'روایت مراجعین از پاکدشت و شرق تهران',
    description: 'مستندات ویدیویی از لحظه دیدن لبخند در آینه بعد از اتمام درمان در کلینیک پارمیس',
    items: [
      {
        id: 'review-1',
        name: 'خانم سمیرا امینی',
        location: 'از پاکدشت • درمان ونیر کامپوزیت ۶ واحد',
        duration: '۰۲:۱۵ دقیقه',
        quote: '«اصلاً باورم نمی‌شد توی خود پاکدشت چنین درمان ظریف و بدون نقصی انجام بشه؛ کامپوزیت‌ها اصلاً برآمده نیستند و لبخندم کاملاً طبیعی شده.»',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHXVlrWjerzdg9GR5Kxk6SaS90QnME770P9okJcfUGbZUyMJEtzshnF7-qkOBqOuDEharY0TULdtUb-PU_542x-kyN39qNewyLLRJ2tgBqbmS_cj9O6mWXgiNS6bKiqpUwAhs1bCRccwjdjX0lYgr_xc91QfX8rkxObfASrpfM45aHTTP2fyKY3K6Yf5xTJo9040r-fDiyx89dMv_78HI1cxjpFcGBZmHHFCVsM-N7-mV9MxmN9mBS',
      },
      {
        id: 'review-2',
        name: 'آقای بهرام شریفی',
        location: 'از قیام‌دشت • کاشت ۳ واحد ایمپلنت اشترومن',
        duration: '۰۱:۴۵ دقیقه',
        quote: '«بدون درد و خونریزی جراحی شد. حتی یک قرص مسکن هم بعد جراحی نیاز نداشتم. پیگیری‌های بعد از جراحی پرسنل دکتر شمس پور واقعاً ستودنی بود.»',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-vtFpkkgpG_BNePdiQjnPGCI66VeehG493AfLCpA_kYC5YYuK9dwnMTExDqa1JdoXUY2_lRPfZNmAJrsNkoOAwpl2AFWOdCYjmMjHZsAr4Aex79ANEsOW-QacVZXu6P8PPqQjbD2_ucAXuM84yP8w0jYxEsypWrF71_ddrchsTGQsC9UwK-SiIz6cS9JlTkKVZ9CG3RVcNkXBR2nVJtMezT74CktyZslsjhmG703SP0UfM7Ki2VDe',
      },
      {
        id: 'review-3',
        name: 'خانم دکتر نادری',
        location: 'از ورامین • ۸ واحد لمینت سرامیکی فک بالا',
        duration: '۰۱:۲۰ دقیقه',
        quote: '«دقت میکرومتری در تراش و رنگ کاملاً طبیعی لبه‌ها باعث شد همکارانم متوجه لمینت بودن دندان‌ها نشوند؛ دندان‌ها برجسته نشدند و آناتومی لبه‌ها بی‌نظیره.»',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlozcxYiqvvl6FW7fb5u5XwwPwEU2_aSiPhGIGvKdmrFgIM8XKe8qWoLevZi9ZbN-Yj_90iR9A0ymHaG2T_L7jjLaKtk7JdoLgFV0TbEOV1a794eJDrkpKu2Npj9fiwSoI_tLAB_a0iHLvlERO_1TvqQhlnh2MwG1yIRoKVmO-9cfs6HLiPalu56PV9p7xXdNBkJPCCa-hlkoxKkuSPmevbbZ6m6JtkRnGbsgedW_gR6SduGdMBQ_y',
      },
    ],
  },
  photographyManifesto: {
    enabled: true,
    badge: 'استاندارد عکاسی کلینیکال و ثبت سند',
    badgeIcon: 'photo_camera',
    title: 'تعهد شفافیت: بدون روتوش، بدون خطای دید',
    description: 'ما باور داریم که اعتماد بیماران ارزشمندترین دارایی ماست. به همین دلیل در ثبت تصاویر نمونه کارهای مطب دکتر شمس پور به ۴ اصل سخت‌گیرانه پایبندیم.',
    columns: '2',
    principles: [
      {
        id: 'p-1',
        title: 'بدون ادیت نرم‌افزاری',
        description: 'هیچ‌گونه سفیدکردن غیرواقعی، حذف لکه یا دستکاری خط لثه در فتوشاپ انجام نمی‌شود.',
        icon: 'hide_image',
      },
      {
        id: 'p-2',
        title: 'نور استاندارد ۵۵۰۰K پزشکی',
        description: 'عکاسی ماکرو با فلاش رینگی پزشکی کالیبره‌شده برای بازتاب دقیق‌ترین رنگ طبیعی مینا.',
        icon: 'wb_sunny',
      },
      {
        id: 'p-3',
        title: 'نمایش بافت طبیعی لبه دندان',
        description: 'ثبت شفافیت شیشه‌ای لبه دندان‌ها به منظور اثبات ظرافت کار لابراتواری و پالیش نهایی.',
        icon: 'lens_blur',
      },
      {
        id: 'p-4',
        title: 'حفظ حریم خصوصی چهره',
        description: 'تمامی تصاویر و ویدیوها با رضایت‌نامه کتبی مراجعین گرامی منتشر گردیده است.',
        icon: 'lock',
      },
    ],
  },
  journey: {
    enabled: true,
    badge: 'مسیر خلق لبخند اختصاصی',
    title: '۴ گام تا داشتن لبخندی درخشان در کلینیک پارمیس',
    description: 'روند دقیق، علمی و بدون ابهام از اولین جلسه ویزیت تا تحویل نهایی در مطب پاکدشت',
    steps: [
      {
        id: 'st-1',
        stepNumber: '۱',
        title: 'اسکن ۳بعدی و آنالیز صورت',
        description: 'بررسی دقیق تناسب دندان‌ها با انحنای لب و زوایای صورت با اینتراورال اسکنر دیجیتال بدون خفگی قالب‌گیری سنتی.',
        icon: 'route',
      },
      {
        id: 'st-2',
        stepNumber: '۲',
        title: 'ماک‌آپ موقت و پیش‌نمایش در دهان',
        description: 'امکان مشاهده و تایید فرم و رنگ نهایی دندان‌ها در دهان پیش از هرگونه اقدام درمانی یا تراش میکرومتری.',
        icon: 'description',
      },
      {
        id: 'st-3',
        stepNumber: '۳',
        title: 'اجرای ظریف با متریال اورجینال',
        description: 'تراش میکروسکوپی مینیمال یا کامپوزیت لایه‌ای با پایش مداوم اکلوژن فکی، ایزولاسیون کامل رابردم و متریال ژاپنی و سوئیسی.',
        icon: 'healing',
      },
      {
        id: 'st-4',
        stepNumber: '۴',
        title: 'صدور گارانتی کتبی و چکاپ‌ها',
        description: 'جلسات کنترل دوره‌ای، پولیش سالانه و ارائه کارت ضمانت مکتوب ماندگاری متریال در مجتمع پزشکی راستین پاکدشت.',
        icon: 'verified',
      },
    ],
  },
  faqs: {
    enabled: true,
    badge: 'پاسخ‌های دکتر انوشیروان شمس پور به سوالات شما',
    title: 'پرسش‌های پرتکرار مراجعین',
    items: [
      {
        id: 'gfaq-1',
        q: 'آیا این نمونه‌ها تماماً متعلق به مراجعین مطب پاکدشت است؟',
        a: 'بله، صد درصد تصاویر و ویدیوهای بارگذاری شده در این وب‌سایت، پرونده‌های بالینی واقعی بیماران تحت درمان دکتر انوشیروان شمس پور در مطب پاکدشت (مجتمع راستین) است و مراجعین محترم در جلسه مشاوره حضوری می‌توانند آلبوم جامع این درمان‌ها را مشاهده فرمایند.',
      },
      {
        id: 'gfaq-2',
        q: 'طول عمر لمینت سرامیکی و کامپوزیت چقدر است؟',
        a: 'لمینت‌های سرامیکی E-Max آلمانی در صورت رعایت بهداشت فردی و مراجعات دوره‌ای، طول عمری بین ۱۵ الی ۲۰ سال همراه با ضمانت کتبی ۱۰ ساله دارند. ونیرهای کامپوزیت ژاپنی و سویسی نیز بین ۵ الی ۸ سال دوام دارند و سالی یک‌بار نیاز به پالیش سبک خواهند داشت.',
      },
      {
        id: 'gfaq-3',
        q: 'آیا برای نصب لمینت، دندان‌ها تراش زیادی می‌خورند؟',
        a: 'خیر؛ در متد پیشرفته Micro-Prep که در این مرکز به کار گرفته می‌شود، تراش سطحی در حد ۰.۳ تا ۰.۵ میلی‌متر و صرفاً در لایه مینا انجام می‌پذیرد. همچنین در درمان ونیر کامپوزیت در ۹۰٪ موارد هیچ‌گونه تراشی انجام نمی‌شود.',
      },
      {
        id: 'gfaq-4',
        q: 'چگونه می‌توانم از طرح درمان و هزینه تخمینی کیس خودم مطلع شوم؟',
        a: 'شما می‌توانید با تماس با شماره‌های ۰۲۱۳۶۰۴۸۵۸۱ یا ۰۲۱۳۶۰۴۸۵۸۲، یک نوبت مشاوره و آنالیز اولیه هماهنگ فرمایید تا پس از معاینه دقیق دندان‌ها، پلان درمان و برآورد شفاف هزینه‌ها در اختیارتان قرار گیرد.',
      },
    ],
  },
  cta: {
    enabled: true,
    badge: 'مشاوره حضوری و اسکن دیجیتال در پاکدشت',
    title: 'آماده‌اید لبخند رویایی خود را تجربه کنید؟',
    description: 'یک جلسه مشاوره و تصویربرداری تشخیصی در کلینیک پارمیس با دکتر انوشیروان شمس پور رزرو کنید و طرح لبخند ایده‌آل خود را قبل از درمان بر روی مانیتور ببینید.',
    phoneButtonText: 'تماس مستقیم',
    whatsappButtonText: 'مشاوره و هماهنگی در واتساپ',
    whatsappLink: 'https://wa.me/989215395923',
  },
};

export const defaultAboutPageSettings: AboutPageSettingsType = {
  hero: {
    enabled: true,
    eyebrowChip: 'کلینیک تخصصی پارمیس • مجتمع پزشکی راستین پاکدشت',
    doctorName: 'دکتر انوشیروان شمس پور',
    titleHighlight: 'تعهد به سلامت دهان و آفرینش لبخند طبیعی در پاکدشت',
    description: 'سال‌ها تجربه درخشان در ارائه خدمات دندان‌پزشکی با رویکرد بیمارمحور، بهره‌گیری از تجهیزات مدرن دیجیتال و متریال‌های استاندارد جهانی در محیطی صمیمی، آرام و مجهز به سیستم‌های پیشرفته استریلیزاسیون.',
    doctorImage: CLINIC_INFO.doctorImage,
    verifiedBadgeText: 'عضو سازمان نظام پزشکی',
    licenseText: 'شماره نظام پزشکی معتبر | عضو پیوسته انجمن دندان‌پزشکان ایران',
    floatingPill1Title: 'مشاوره تخصصی و صادقانه',
    floatingPill1Subtitle: 'حفظ حداکثری بافت طبیعی دندان',
    floatingPill1Icon: 'shield_person',
    floatingPill2Title: 'استریلیزاسیون سه‌مرحله‌ای',
    floatingPill2Subtitle: 'پک‌های کاملاً استریل یکبارمصرف',
    floatingPill2Icon: 'health_and_safety',
    metrics: [
      { id: 'm1', value: '+۱۰ سال', label: 'سابقه طبابت بالینی' },
      { id: 'm2', value: '+۵۰۰۰', label: 'مراجع راضی و درمان موفق' },
      { id: 'm3', value: 'کلاس B', label: 'استریل اتوکلاو اروپایی' },
      { id: 'm4', value: 'دیجیتال RVG', label: 'کمترین دوز تابش اشعه' },
    ],
    primaryButtonText: 'رزرو تلفنی نوبت:',
    primaryButtonPhone: CLINIC_INFO.phone,
    secondaryButtonText: 'مشاوره واتساپ',
    secondaryButtonLink: 'https://wa.me/989215395923',
  },
  pillars: {
    enabled: true,
    badge: 'اصول بنیادین کلینیک پارمیس',
    badgeSubtitle: '۵ ستون استاندارد',
    items: [
      { id: 'p1', icon: 'volunteer_activism', title: 'اولویت آرامش بیمار', subtitle: 'تزریق آرام و بدون درد با روان‌بخشی محیط' },
      { id: 'p2', icon: 'biotech', title: 'فناوری دیجیتال مدرن', subtitle: 'رادیوگرافی RVG و دوربین دقیق داخل‌دهانی' },
      { id: 'p3', icon: 'verified_user', title: 'متریال اورجینال اروپایی', subtitle: 'کامپوزیت‌ها و ایمپلنت‌های معتبر و استاندارد' },
      { id: 'p4', icon: 'payments', title: 'شفافیت کامل در هزینه‌ها', subtitle: 'توضیح کامل پلن درمان قبل از هرگونه اقدام' },
      { id: 'p5', icon: 'pin_drop', title: 'دسترسی آسان در پاکدشت', subtitle: 'مجتمع پزشکی راستین، قلب درمانی شهر' },
    ],
  },
  philosophy: {
    enabled: true,
    badge: 'فلسفه پزشکی و طبابت اخلاق‌مدار',
    title: 'نگاه دکتر شمس پور به درمان دندان‌پزشکی: بازسازی طبیعی، نه فقط درمان مقطعی',
    subtitle: 'در مطب دندان‌پزشکی پارمیس، درمان دندان یک فرآیند استرس‌زا نیست؛ بلکه بازگرداندن آسودگی، سلامت پایدار و حس اعتماد‌به‌نفس در لبخند شماست.',
    bioTitle: 'زندگینامه و مسیر حرفه‌ای',
    bioText1: 'دکتر انوشیروان شمس پور پس از فارغ‌التحصیلی و اتمام دوره‌های تکمیلی، با هدفی روشن فعالیت تخصصی خود را در پاکدشت پایه‌گذاری نمود: ارتقای سطح سلامت دهان و دندان در منطقه و دسترسی آسان همشهریان عزیز به خدمات دندان‌پزشکی مدرن، دقیق و با بالاترین استانداردهای مراقبتی روز کشور.',
    bioText2: 'باور عمیق دکتر شمس پور بر رویکرد «دندان‌پزشکی محافظه‌کارانه و بیومیمتیک (حداقل مداخله)» استوار است؛ به این معنا که اولویت اول و بنیادین در مطب پارمیس، حفظ سلامت و نگهداری دندان طبیعی خود بیمار است و تنها در شرایط اضطرار و پس از ارزیابی کامل دیجیتال، روش‌های جایگزین همچون جراحی و ایمپلنت پیشنهاد می‌گردند.',
    clinicLocationTag: 'مطب پارمیس، مجتمع راستین، طبقه دوم',
    licenseLinkText: 'مشاهده پروانه طبابت',
    checklist: [
      { id: 'c1', text: 'حفظ حداکثری مینا و بافت دندانی' },
      { id: 'c2', text: 'استفاده از پروتکل‌های بی‌حسی بدون درد' },
      { id: 'c3', text: 'آموزش گام‌به‌گام و تصویربرداری زنده حین درمان' },
      { id: 'c4', text: 'پیگیری و چک‌آپ‌های دوره‌ای رایگان' },
    ],
    cards: [
      {
        id: 'card1',
        icon: 'sentiment_satisfied',
        title: 'درمان بدون درد و تنش',
        description: 'به‌کارگیری بی‌حسی‌های عمیق، تزریق دیجیتال با نیدل‌های بسیار ظریف و محیطی معطر و آرام جهت زدودن کامل فوبیای دندانپزشکی.',
      },
      {
        id: 'card2',
        icon: 'format_image_left',
        title: 'حفظ حداکثری دندان طبیعی (Biomimetic)',
        description: 'هیچ جایگزینی معادل دندان طبیعی خود فرد نیست. تمام تلاش علمی دکتر شمس پور نجات ریشه و تاج با ترمیم‌های نوین است.',
      },
      {
        id: 'card3',
        icon: 'request_quote',
        title: 'شفافیت کامل در هزینه‌ها و معاینه دقیق',
        description: 'تشریح کامل طرح درمان به همراه صدور برآورد مالی مکتوب پیش از شروع هر مرحله، بدون هیچ‌گونه هزینه پنهان.',
      },
    ],
  },
  sterilization: {
    enabled: true,
    badge: 'استانداردهای بهداشتی و تجهیزات پیشرفته',
    title: 'سلامت و ایمنی شما در کلینیک پارمیس، بالاترین اولویت ماست',
    description: 'ما در مطب دندان‌پزشکی پارمیس واقع در مجتمع پزشکی راستین پاکدشت، سخت‌گیرانه‌ترین استانداردهای کنترل عفونت را به اجرا گذاشته‌ایم تا شما و خانواده محترمتان با خاطری کاملاً آسوده تحت درمان قرار گیرید.',
    mainImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    overlayBadgeTitle: 'استریلیزاسیون ۱۰۰٪ تضمینی',
    overlayBadgeSubtitle: 'تست‌های بیولوژیک و شیمیایی ماهانه',
    overlayBadgeIcon: 'sanitizer',
    items: [
      {
        id: 's1',
        icon: 'cleaning_services',
        title: 'اتوکلاو کلاس B اروپایی و بسته‌بندی پک وکیوم',
        description: 'تمامی ابزارهای غیر یکبارمصرف در پاکت‌های استریل بسته‌بندی شده و دقیقاً مقابل چشمان بیمار باز می‌شوند.',
      },
      {
        id: 's2',
        icon: 'monitor_heart',
        title: 'رادیوگرافی دیجیتال (RVG) با وضوح فوق‌العاده',
        description: 'ثبت آنی تصاویر دندانی با کاهش ۹۰ درصدی دوز تابش اشعه ایکس نسبت به رادیوگرافی‌های سنتی و فیلمی قدیمی.',
      },
      {
        id: 's3',
        icon: 'camera_indoor',
        title: 'دوربین داخل دهانی و نمایش زنده در مانیتور بیمار',
        description: 'شما وضعیت دندان، پوسیدگی‌ها و مراحل درمان خود را به وضوح بر روی مانیتور یونیت مشاهده خواهید کرد.',
      },
      {
        id: 's4',
        icon: 'sanitizer',
        title: 'پک‌های استریل یک‌بار مصرف اختصاصی',
        description: 'بازگشایی بسته‌بندی استریل اینسترومنت‌ها منحصراً در حضور خود بیمار با نشانگر حرارتی معتبر.',
      },
    ],
  },
  gallery: {
    enabled: true,
    badge: 'فضای مطب پارمیس',
    badgeSubtitle: 'پاکدشت، مجتمع راستین، طبقه ۲',
    title: 'محیطی پاکیزه، مدرن و صمیمی برای آرامش شما',
    description: 'گوشه‌ای از فضای درمانی و پذیرش کلینیک دندان‌پزشکی پارمیس در مجتمع پزشکی راستین پاکدشت.',
    slides: [
      {
        id: 'g1',
        title: 'سالن انتظار دلباز و آرام',
        subtitle: 'محیطی صمیمی همراه با سیستم تهویه مطبوع هوا و موسیقی ملایم برای آرامش همراهان.',
        tag: 'سالن انتظار',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'g2',
        title: 'یونیت ارگونومیک هوشمند',
        subtitle: 'طراحی فوم حافظه‌دار صندلی بیمار جهت رفع خستگی ستون فقرات حین درمان‌های طولانی.',
        tag: 'یونیت درمان',
        image: CLINIC_INFO.operatoryImage,
      },
      {
        id: 'g3',
        title: 'واحد مکانیزه ضدعفونی',
        subtitle: 'جداسازی کامل خط کثیف و خط تمیز مطابق استانداردهای سخت‌گیرانه وزارت بهداشت.',
        tag: 'مرکز CSR',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  services: {
    enabled: true,
    badge: 'طیف خدمات بالینی',
    title: 'خدمات درمانی و زیبایی زیر نظر دکتر شمس پور',
    description: 'ارائه کلیه اقدامات تخصصی دندان‌پزشکی با پروتکل‌های محافظه‌کارانه و بهترین متریال استاندارد.',
    items: [
      {
        id: 'srv1',
        icon: 'auto_awesome',
        title: 'ونیر کامپوزیت و لمینت',
        description: 'طراحی لبخند هالیوودی متناسب با فرم چهره، شفافیت طبیعی و ماندگاری بالا.',
        linkText: 'جزئیات درمان',
      },
      {
        id: 'srv2',
        icon: 'dentistry',
        title: 'ایمپلنت و کاشت دندان',
        description: 'جایگزینی ریشه با فیکسچرهای استاندارد مادام‌العمر بدون تحلیل لثه.',
        linkText: 'جزئیات درمان',
      },
      {
        id: 'srv3',
        icon: 'healing',
        title: 'درمان ریشه (عصب‌کشی)',
        description: 'درمان بدون درد ریشه دندان با فایل‌های چرخشی روتاری و اپکس‌لوکیتورهای دیجیتال.',
        linkText: 'جزئیات درمان',
      },
      {
        id: 'srv4',
        icon: 'child_care',
        title: 'دندان‌پزشکی ترمیمی و اطفال',
        description: 'پرکردن همرنگ دندان، فلورایدتراپی و مراقبت دندان‌های شیری با صبوری و حوصله.',
        linkText: 'جزئیات درمان',
      },
    ],
  },
  testimonials: {
    enabled: true,
    badge: 'تجربه بیماران',
    title: 'روایت مراجعین از درمان در کلینیک پارمیس',
    description: 'نظرات ثبت‌شده بیماران محترم درباره برخورد حرفه‌ای و درمان‌های دکتر انوشیروان شمس پور.',
    ratingValue: '۴.۹',
    items: [
      {
        id: 't1',
        name: 'مهدی رضایی',
        avatarInitials: 'م.ر',
        tag: 'ساکن پاکدشت (مامازند) • کامپوزیت زیبایی',
        quote: 'من سال‌ها از دندان‌پزشکی وحشت داشتم، اما صبوری و اخلاق حرفه‌ای دکتر شمس پور واقعاً فوق‌العاده بود. برای درمان دندان عصب‌کشی و روکش حتی سرسوزنی درد حس نکردم. محیط کلینیک هم فوق‌العاده تمیز و باکلاسه.',
        stars: 5,
      },
      {
        id: 't2',
        name: 'سارا مشفق',
        avatarInitials: 'س.م',
        tag: 'ساکن شهرک دانشگاه • کاشت ایمپلنت',
        quote: 'برای ایمپلنت دوتا دندونم خیلی تحقیق کرده بودم تا تهران نرم. خوشبختانه کلینیک پارمیس توی پاکدشت مجتمع راستین بهترین انتخاب بود؛ رادیوگرافی دقیق خودشون داشتن و همه‌چیز کاملا استریل و پک شده بود.',
        stars: 5,
      },
      {
        id: 't3',
        name: 'علی میرزایی',
        avatarInitials: 'ع.م',
        tag: 'جراحی و ایمپلنت دیجیتال',
        quote: 'بهداشت فوق‌العاده مطب و خوش‌قولی در زمان نوبت‌دهی واقعاً ستودنی است. پک‌ها استریل جلوی خود بیمار باز می‌شود و آقای دکتر تمام مراحل را با دقت برای من توضیح دادند.',
        stars: 5,
      },
    ],
  },
  contact: {
    enabled: true,
    badge: 'اطلاعات دسترسی و نوبت‌دهی',
    title: 'مطب دندان‌پزشکی پارمیس • دکتر انوشیروان شمس پور',
    addressTitle: 'آدرس کلینیک',
    addressText: 'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
    phoneTitle: 'شماره تماس مستقیم',
    phone1: '02136048581',
    phone2: '02136048582',
    phone1Display: '۰۲۱۳۶۰۴۸۵۸۱',
    phone2Display: '۰۲۱۳۶۰۴۸۵۸۲',
    hoursTitle: 'ساعات کاری و پذیرش',
    hoursText: 'شنبه تا پنجشنبه: ۱۰ صبح الی ۲۱ (با تعیین وقت قبلی)',
    hoursEmergencyText: 'جمعه‌ها و ایام تعطیل رسمی: پذیرش موارد اورژانسی با هماهنگی تلفنی',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB46eR0IQlF5wtRFa0UaCzRiEuaHPhc782AKsDtnuzImaR_GsyaZAy0aTmHdTnULJ9J2fvzlC3pG3IVi6BGONR__LzhfN42tLlEOlHxkU8mstUg-mAXCq9eBroGOmwC-rNglqS6MJde07opdTceAXWUHFLUlCnKiUeMCJO_kJdOmAzP0gkYjq1IbuAefJrq3OcHAp5lF1y-L4UgeFkDD70CydNfgxdRhcORg99CfCx6TD8xZFy_uuzU',
    mapPinLabel: 'مجتمع پزشکی راستین • مطب پارمیس',
    amenitiesTitle: 'مسیریابی آسان و امکانات رفاهی',
    amenitiesDesc: 'فضای مناسب پارک خودرو، آسانسور فعال، داروخانه در مجتمع و امکانات رفاهی کلینیک',
    neshanUrl: CLINIC_INFO.neshanUrl,
    baladUrl: CLINIC_INFO.baladUrl,
    googleMapsUrl: CLINIC_INFO.googleMapsUrl,
  },
  cta: {
    enabled: true,
    badge: 'مشاوره و ارزیابی اولیه لبخند',
    badgeIcon: 'favorite',
    title: 'آماده‌اید لبخند خود را با اطمینان به ما بسپارید؟',
    description: 'جهت رزرو نوبت معاینه، اطلاع از طرح‌های درمان یا دریافت مشاوره با کادر مطب دکتر شمس پور تماس بگیرید.',
    buttonText: 'تماس:',
    phone: CLINIC_INFO.phone2,
    phoneDisplay: CLINIC_INFO.phoneDisplay2,
  },
};

// Default fallback data matching static clinic data
const defaultState: CMSContextType = {
  data: null,
  loading: false,
  error: null,
  refreshCMS: async () => {},
  siteImages: defaultSiteImages,
  clinicInfo: CLINIC_INFO,
  valuePropositions: VALUE_PROPOSITIONS,
  services: SERVICES,
  transformations: TRANSFORMATIONS,
  articles: ARTICLES,
  comments: [],
  blogCategories: BLOG_CATEGORIES,
  faqs: FAQS,
  mobileFaqs: MOBILE_FAQS,
  treatments: DENTAL_TREATMENTS,
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
  doctor: {
    name: CLINIC_INFO.doctorName,
    title: CLINIC_INFO.doctorTitleBrand,
    role: CLINIC_INFO.doctorRole,
    specialty: CLINIC_INFO.specialty,
    medicalCouncilCode: CLINIC_INFO.medicalCouncilCode,
    medicalLicenseLink: CLINIC_INFO.medicalLicenseLink || 'https://membersearch.irimc.org/',
    city: 'پاکدشت',
    experienceYears: '+۱۰ سال',
    successfulTreatments: '+۵,۰۰۰',
    image: CLINIC_INFO.doctorImage,
    phone: CLINIC_INFO.phone,
    bio: 'دکتر انوشیروان شمس پور با سال‌ها تجربه بالینی درخشان و بهره‌گیری از پروتکل‌های درمانی مدرن، اصل کاری خود را بر پایه «صداقت در تشخیص و اولویت حفظ حداکثری دندان طبیعی بیمار» بنا نهاده است.',
    bioFull: 'دکتر انوشیروان شمس پور با بیش از یک دهه سابقه بالینی درخشان و عضویت در سازمان نظام پزشکی کل کشور، به عنوان یکی از پیشگامان دندان‌پزشکی کم‌تهاجمی (Biomimetic) و اصلاح طرح لبخند دیجیتال در پاکدشت فعالیت می‌نمایند.',
    quote: 'اولویت اول در کلینیک پارمیس همواره نجات و حفظ دندان طبیعی بیمار با حداقل تهاجم و بدون درد است.',
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
      { title: 'حفظ دندان طبیعی', desc: 'اولویت اول در کلینیک پارمیس همواره نجات و حفظ دندان طبیعی بیمار است.' },
      { title: 'درمان بدون استرس و درد', desc: 'با استفاده از بی‌حسی‌های موضعی مدرن و تکنیک‌های آرام‌بخش.' },
      { title: 'متریال استاندارد اروپایی', desc: 'استفاده انحصاری از برندهای دارای تاییدیه CE اروپا و FDA آمریکا.' },
      { title: 'شفافیت مالی و طرح درمان', desc: 'ارائه طرح درمان مکتوب همراه با پیش‌فاکتور دقیق.' },
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
      metro: 'نزدیک‌ترین ایستگاه مترو: فرهنگسرا یا پیروزی (سپس تاکسی‌های خطی پاکدشت / میدان قدس)',
      bus: 'پایانه مسافربری پاکدشت و ایستگاه اتوبوس‌های بین‌شهری خاوران - پاکدشت',
      car: 'دسترسی سریع از بزرگراه امام رضا (ع) به بلوار شهدای قمی و میدان علی ابن ابیطالب با پارکینگ اختصاصی',
    },
  },
  siteSettings: {
    title: 'کلینیک دندان‌پزشکی پارمیس | دکتر انوشیروان شمس پور',
    tagline: 'خدمات تخصصی دندان‌پزشکی و ایمپلنت در پاکدشت',
    metaDescription: 'کلینیک دندان‌پزشکی پارمیس در پاکدشت با مدیریت دکتر انوشیروان شمس پور؛ ارائه دهنده خدمات تخصصی ایمپلنت، کامپوزیت، لمینت، عصب‌کشی و دندان‌پزشکی اطفال.',
    phone: CLINIC_INFO.phone,
    address: CLINIC_INFO.address,
  },
  editorPick: {
    badgeText: 'مقاله منتخب سردبیر / توصیه دکتر شمس پور',
    doctorName: 'دکتر انوشیروان شمس پور',
    doctorRole: 'جراح و دندانپزشک • سرپرست درمان کلینیک پارمیس',
    avatarUrl: '/uploads/photo_2026-10-18_21-28-58-1792346391612-941489.jpg',
  },
  articleDoctorCard: {
    doctorName: CLINIC_INFO.doctorName,
    doctorRole: CLINIC_INFO.doctorRole,
    bio: 'دارای بورد تخصصی و سال‌ها تجربه در ارائه درمان‌های پیشرفته ایمپلنت، اصلاح لبخند دیجیتال و پروتزهای دندانی در شهرستان پاکدشت.',
    avatarUrl: CLINIC_INFO.doctorImage,
    experienceText: '+۱۴',
    experienceLabel: 'سال تجربه',
    successCountText: '+۳,۵۰۰',
    successCountLabel: 'لبخند موفق',
    buttonText: 'مشاهده رزومه و سوابق پزشک',
  },
  articleLatestSection: {
    title: 'جدیدترین مقالات کلینیک',
    count: 4,
    showViews: true,
    showReadTime: true,
  },
  articleRelatedSection: {
    badgeText: 'بیشتر بخوانید',
    title: 'مقالات مرتبط با این موضوع',
    subtitle: 'مطالبی که برچسب‌ها و مباحث تخصصی مشترکی با این مقاله دارند',
    count: 3,
    buttonText: 'مشاهده همه مقالات',
    showCategoryBadge: true,
    showDate: true,
    showReadTime: true,
    showSummary: true,
    showCardButton: true,
    cardButtonText: 'مطالعه مقاله',
    emptyStateMessage: 'در حال حاضر مقاله دیگری با این برچسب منتشر نشده است.',
    fallbackToCategory: false,
  },
  articleAuthor: {
    enabled: true,
    name: 'دکتر انوشیروان شمس پور',
    role: 'جراح و دندانپزشک • سرپرست درمان کلینیک',
    avatarUrl: CLINIC_INFO.doctorImage,
  },
  articleCtaSection: {
    enabled: true,
    badgeText: 'مرکز تخصصی دندان‌پزشکی در پاکدشت',
    title: 'آماده لبخندی بی‌نقص و مطمئن هستید؟',
    description: 'برای معاینه بالینی، ارزیابی ضخامت مینای دندان و دریافت برآورد شفاف هزینه‌ها، همین امروز با کلینیک پارمیس (دکتر انوشیروان شمس پور) تماس بگیرید یا نوبت حضوری خود را در پاکدشت هماهنگ نمایید.',
    phoneText: `تماس با مطب: ${CLINIC_INFO.phoneCompact2}`,
    phone: CLINIC_INFO.phone2,
    navButtonText: 'مسیریابی و تماس با ما',
    features: [
      'تجهیزات دیجیتال مدرن',
      'متریال درجه یک اصل سوئیس و ژاپن',
      'طرف قرارداد بیمه‌ها',
    ],
  },
  homeSettings: defaultHomeSettings,
  servicesPageSettings: defaultServicesPageSettings,
  galleryPageSettings: defaultGalleryPageSettings,
  aboutPageSettings: defaultAboutPageSettings,
  contactPageSettings: defaultContactPageSettings,
};

const CMSContext = createContext<CMSContextType>(defaultState);

const CMS_CACHE_KEY = 'parmis_cms_data_cache';

const getInitialCmsData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CMS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('CMS cache read warning:', e);
  }
  return null;
};

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(getInitialCmsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCMS = async () => {
    try {
      const res = await fetch(`/api/cms-data?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (!res.ok) throw new Error('خطا در دریافت اطلاعات از سرور');
      const json = await res.json();
      setData(json);
      try {
        localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(json));
      } catch (e) {
        // quota exceeded or private mode
      }
      setError(null);
    } catch (err: any) {
      console.warn('CMS fetch warning (using static fallback):', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCMS();

    // 1. Listen for local custom event dispatched by AdminPanel actions
    const handleLocalUpdate = () => {
      refreshCMS();
    };
    window.addEventListener('parmis_cms_updated', handleLocalUpdate);

    // 2. Listen for cross-tab storage event (when admin updates in another tab)
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'parmis_cms_updated') {
        refreshCMS();
      }
    };
    window.addEventListener('storage', handleStorageUpdate);

    // 3. Listen for BroadcastChannel across tabs
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('parmis_cms_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'CMS_UPDATED') {
          refreshCMS();
        }
      };
    } catch {
      // BroadcastChannel unsupported fallback handled by storage
    }

    // 4. When user focuses back on the tab, refresh immediately to guarantee fresh data
    const handleFocus = () => {
      refreshCMS();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('parmis_cms_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('focus', handleFocus);
      if (channel) {
        try {
          channel.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const value: CMSContextType = {
    data,
    loading,
    error,
    refreshCMS,
    siteImages: { ...defaultSiteImages, ...(data?.siteImages || {}) },
    clinicInfo: {
      ...CLINIC_INFO,
      ...(data?.clinicInfo || {}),
      ...(data?.doctor ? {
        doctorName: data.doctor.name || data.doctor.doctorName || data.clinicInfo?.doctorName || CLINIC_INFO.doctorName,
        doctorTitleBrand: data.doctor.title || data.doctor.doctorTitleBrand || data.clinicInfo?.doctorTitleBrand || CLINIC_INFO.doctorTitleBrand,
        doctorRole: data.doctor.role || data.doctor.doctorRole || data.clinicInfo?.doctorRole || CLINIC_INFO.doctorRole,
        doctorImage: data.doctor.image || data.doctor.imageUrl || data.clinicInfo?.doctorImage || CLINIC_INFO.doctorImage,
        mobileDoctorAvatar: data.doctor.image || data.doctor.imageUrl || data.clinicInfo?.mobileDoctorAvatar || CLINIC_INFO.mobileDoctorAvatar,
        mobileDrawerAvatar: data.doctor.image || data.doctor.imageUrl || data.clinicInfo?.mobileDrawerAvatar || CLINIC_INFO.mobileDrawerAvatar,
        medicalCouncilCode: data.doctor.medicalCouncilCode || data.clinicInfo?.medicalCouncilCode || CLINIC_INFO.medicalCouncilCode,
        medicalLicenseLink: data.doctor.medicalLicenseLink || data.clinicInfo?.medicalLicenseLink || CLINIC_INFO.medicalLicenseLink,
      } : {}),
    },
    valuePropositions: data?.valuePropositions || VALUE_PROPOSITIONS,
    services: data?.services || SERVICES,
    transformations: data?.transformations || TRANSFORMATIONS,
    articles: data?.articles || ARTICLES,
    comments: data?.comments || [],
    blogCategories: data?.blogCategories || BLOG_CATEGORIES,
    faqs: data?.faqs || FAQS,
    mobileFaqs: data?.mobileFaqs || MOBILE_FAQS,
    treatments: data?.treatments || DENTAL_TREATMENTS,
    hero: data?.hero || defaultState.hero,
    doctor: data?.doctor || defaultState.doctor,
    about: data?.about || defaultState.about,
    contact: data?.contact || defaultState.contact,
    siteSettings: data?.siteSettings || defaultState.siteSettings,
    editorPick: data?.editorPick || defaultState.editorPick,
    articleDoctorCard: data?.articleDoctorCard || defaultState.articleDoctorCard,
    articleLatestSection: data?.articleLatestSection || defaultState.articleLatestSection,
    articleRelatedSection: data?.articleRelatedSection || defaultState.articleRelatedSection,
    articleAuthor: data?.articleAuthor || defaultState.articleAuthor,
    articleCtaSection: data?.articleCtaSection || defaultState.articleCtaSection,
    homeSettings: {
      ...defaultHomeSettings,
      ...(data?.homeSettings || {}),
      hero: { ...defaultHomeSettings.hero, ...(data?.homeSettings?.hero || {}) },
      valueProps: {
        ...defaultHomeSettings.valueProps,
        ...(data?.homeSettings?.valueProps || {}),
        items: data?.homeSettings?.valueProps?.items || defaultHomeSettings.valueProps.items,
      },
      advancedCare: {
        ...defaultHomeSettings.advancedCare,
        ...(data?.homeSettings?.advancedCare || {}),
        checklist: data?.homeSettings?.advancedCare?.checklist || defaultHomeSettings.advancedCare.checklist,
      },
      transformations: { ...defaultHomeSettings.transformations, ...(data?.homeSettings?.transformations || {}) },
      services: { ...defaultHomeSettings.services, ...(data?.homeSettings?.services || {}) },
      doctor: { ...defaultHomeSettings.doctor, ...(data?.homeSettings?.doctor || {}) },
      articles: { ...defaultHomeSettings.articles, ...(data?.homeSettings?.articles || {}) },
      faqAndContact: { ...defaultHomeSettings.faqAndContact, ...(data?.homeSettings?.faqAndContact || {}) },
      cta: { ...defaultHomeSettings.cta, ...(data?.homeSettings?.cta || {}) },
      motionGuides: { ...defaultHomeSettings.motionGuides, ...(data?.homeSettings?.motionGuides || {}) },
    },
    servicesPageSettings: {
      ...defaultServicesPageSettings,
      ...(data?.servicesPageSettings || {}),
      hero: {
        ...defaultServicesPageSettings.hero,
        ...(data?.servicesPageSettings?.hero || {}),
        highlights: data?.servicesPageSettings?.hero?.highlights || defaultServicesPageSettings.hero.highlights,
      },
      implant: {
        ...defaultServicesPageSettings.implant,
        ...(data?.servicesPageSettings?.implant || {}),
        features: data?.servicesPageSettings?.implant?.features || defaultServicesPageSettings.implant.features,
      },
      cosmeticCategory: {
        ...defaultServicesPageSettings.cosmeticCategory,
        ...(data?.servicesPageSettings?.cosmeticCategory || {}),
        cards: data?.servicesPageSettings?.cosmeticCategory?.cards || defaultServicesPageSettings.cosmeticCategory.cards,
      },
      restorativeCategory: {
        ...defaultServicesPageSettings.restorativeCategory,
        ...(data?.servicesPageSettings?.restorativeCategory || {}),
        cards: data?.servicesPageSettings?.restorativeCategory?.cards || defaultServicesPageSettings.restorativeCategory.cards,
        promoCard: {
          ...defaultServicesPageSettings.restorativeCategory.promoCard,
          ...(data?.servicesPageSettings?.restorativeCategory?.promoCard || {}),
        },
      },
      journey: {
        ...defaultServicesPageSettings.journey,
        ...(data?.servicesPageSettings?.journey || {}),
        steps: data?.servicesPageSettings?.journey?.steps || defaultServicesPageSettings.journey.steps,
      },
      faqs: {
        ...defaultServicesPageSettings.faqs,
        ...(data?.servicesPageSettings?.faqs || {}),
        items: data?.servicesPageSettings?.faqs?.items || defaultServicesPageSettings.faqs.items,
      },
      cta: {
        ...defaultServicesPageSettings.cta,
        ...(data?.servicesPageSettings?.cta || {}),
      },
    },
    galleryPageSettings: {
      ...defaultGalleryPageSettings,
      ...(data?.galleryPageSettings || {}),
      hero: {
        ...defaultGalleryPageSettings.hero,
        ...(data?.galleryPageSettings?.hero || {}),
        metrics: data?.galleryPageSettings?.hero?.metrics || defaultGalleryPageSettings.hero.metrics,
      },
      filterChips: {
        ...defaultGalleryPageSettings.filterChips,
        ...(data?.galleryPageSettings?.filterChips || {}),
        categories: data?.galleryPageSettings?.filterChips?.categories || defaultGalleryPageSettings.filterChips.categories,
      },
      featuredCase: {
        ...defaultGalleryPageSettings.featuredCase,
        ...(data?.galleryPageSettings?.featuredCase || {}),
      },
      caseGrid: {
        ...defaultGalleryPageSettings.caseGrid,
        ...(data?.galleryPageSettings?.caseGrid || {}),
      },
      testimonials: {
        ...defaultGalleryPageSettings.testimonials,
        ...(data?.galleryPageSettings?.testimonials || {}),
        items: data?.galleryPageSettings?.testimonials?.items || defaultGalleryPageSettings.testimonials.items,
      },
      photographyManifesto: {
        ...defaultGalleryPageSettings.photographyManifesto,
        ...(data?.galleryPageSettings?.photographyManifesto || {}),
        principles: data?.galleryPageSettings?.photographyManifesto?.principles || defaultGalleryPageSettings.photographyManifesto.principles,
      },
      journey: {
        ...defaultGalleryPageSettings.journey,
        ...(data?.galleryPageSettings?.journey || {}),
        steps: data?.galleryPageSettings?.journey?.steps || defaultGalleryPageSettings.journey.steps,
      },
      faqs: {
        ...defaultGalleryPageSettings.faqs,
        ...(data?.galleryPageSettings?.faqs || {}),
        items: data?.galleryPageSettings?.faqs?.items || defaultGalleryPageSettings.faqs.items,
      },
      cta: {
        ...defaultGalleryPageSettings.cta,
        ...(data?.galleryPageSettings?.cta || {}),
      },
    },
    aboutPageSettings: {
      ...defaultAboutPageSettings,
      ...(data?.aboutPageSettings || {}),
      hero: {
        ...defaultAboutPageSettings.hero,
        ...(data?.aboutPageSettings?.hero || {}),
        metrics: data?.aboutPageSettings?.hero?.metrics || defaultAboutPageSettings.hero.metrics,
      },
      pillars: {
        ...defaultAboutPageSettings.pillars,
        ...(data?.aboutPageSettings?.pillars || {}),
        items: data?.aboutPageSettings?.pillars?.items || defaultAboutPageSettings.pillars.items,
      },
      philosophy: {
        ...defaultAboutPageSettings.philosophy,
        ...(data?.aboutPageSettings?.philosophy || {}),
        checklist: data?.aboutPageSettings?.philosophy?.checklist || defaultAboutPageSettings.philosophy.checklist,
        cards: data?.aboutPageSettings?.philosophy?.cards || defaultAboutPageSettings.philosophy.cards,
      },
      sterilization: {
        ...defaultAboutPageSettings.sterilization,
        ...(data?.aboutPageSettings?.sterilization || {}),
        items: data?.aboutPageSettings?.sterilization?.items || defaultAboutPageSettings.sterilization.items,
      },
      gallery: {
        ...defaultAboutPageSettings.gallery,
        ...(data?.aboutPageSettings?.gallery || {}),
        slides: data?.aboutPageSettings?.gallery?.slides || defaultAboutPageSettings.gallery.slides,
      },
      services: {
        ...defaultAboutPageSettings.services,
        ...(data?.aboutPageSettings?.services || {}),
        items: data?.aboutPageSettings?.services?.items || defaultAboutPageSettings.services.items,
      },
      testimonials: {
        ...defaultAboutPageSettings.testimonials,
        ...(data?.aboutPageSettings?.testimonials || {}),
        items: data?.aboutPageSettings?.testimonials?.items || defaultAboutPageSettings.testimonials.items,
      },
      contact: {
        ...defaultAboutPageSettings.contact,
        ...(data?.aboutPageSettings?.contact || {}),
      },
      cta: {
        ...defaultAboutPageSettings.cta,
        ...(data?.aboutPageSettings?.cta || {}),
      },
    },
    contactPageSettings: {
      ...defaultContactPageSettings,
      ...(data?.contactPageSettings || {}),
      hero: {
        ...defaultContactPageSettings.hero,
        ...(data?.contactPageSettings?.hero || {}),
        amenities: data?.contactPageSettings?.hero?.amenities || defaultContactPageSettings.hero.amenities,
      },
      quickCards: {
        ...defaultContactPageSettings.quickCards,
        ...(data?.contactPageSettings?.quickCards || {}),
        addressCard: { ...defaultContactPageSettings.quickCards.addressCard, ...(data?.contactPageSettings?.quickCards?.addressCard || {}) },
        phoneCard: { ...defaultContactPageSettings.quickCards.phoneCard, ...(data?.contactPageSettings?.quickCards?.phoneCard || {}) },
        hoursCard: { ...defaultContactPageSettings.quickCards.hoursCard, ...(data?.contactPageSettings?.quickCards?.hoursCard || {}) },
        amenitiesCard: { ...defaultContactPageSettings.quickCards.amenitiesCard, ...(data?.contactPageSettings?.quickCards?.amenitiesCard || {}) },
      },
      mapAndRouting: {
        ...defaultContactPageSettings.mapAndRouting,
        ...(data?.contactPageSettings?.mapAndRouting || {}),
      },
      triageAndBooking: {
        ...defaultContactPageSettings.triageAndBooking,
        ...(data?.contactPageSettings?.triageAndBooking || {}),
      },
      commuters: {
        ...defaultContactPageSettings.commuters,
        ...(data?.contactPageSettings?.commuters || {}),
        cards: data?.contactPageSettings?.commuters?.cards || defaultContactPageSettings.commuters.cards,
      },
      faqs: {
        ...defaultContactPageSettings.faqs,
        ...(data?.contactPageSettings?.faqs || {}),
        items: data?.contactPageSettings?.faqs?.items || defaultContactPageSettings.faqs.items,
      },
      cta: {
        ...defaultContactPageSettings.cta,
        ...(data?.contactPageSettings?.cta || {}),
      },
    },
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = () => useContext(CMSContext);
