import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ComparisonSlider } from './ComparisonSlider.tsx';
import { CLINICAL_CASES, EXTRA_CASES } from '../data/clinicalCases.ts';
import { useCMS, defaultGalleryPageSettings } from '../context/CMSContext.tsx';
import { isVideoUrl } from '../utils/mediaUtils.tsx';

interface SmileGalleryPageProps {
  onOpenBooking: (preselectedService?: string) => void;
  onNavigateHome: () => void;
  onNavigateServices?: () => void;
  onNavigateBlog?: () => void;
}

export const SmileGalleryPage: React.FC<SmileGalleryPageProps> = ({
  onOpenBooking,
  onNavigateHome,
  onNavigateServices,
  onNavigateBlog,
}) => {
  const { galleryPageSettings, transformations, clinicInfo } = useCMS();
  const CLINIC_INFO = clinicInfo;
  const gallery = galleryPageSettings || defaultGalleryPageSettings;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);

  // Testimonials Carousel State
  const rawTestimonials = (gallery.testimonials?.items && gallery.testimonials.items.length > 0)
    ? gallery.testimonials.items
    : defaultGalleryPageSettings.testimonials.items;
  const [localTestimonials, setLocalTestimonials] = useState<any[]>(rawTestimonials);

  useEffect(() => {
    if (gallery.testimonials?.items && gallery.testimonials.items.length > 0) {
      setLocalTestimonials(gallery.testimonials.items);
    }
  }, [gallery.testimonials?.items]);

  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const touchStartX = useRef<number | null>(null);

  // Responsive itemsPerPage
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setItemsPerPage(1);
        } else if (window.innerWidth < 1024) {
          setItemsPerPage(2);
        } else {
          setItemsPerPage(3);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCarousel = localTestimonials.length > 3;
  const maxIndex = Math.max(0, localTestimonials.length - itemsPerPage);
  const safeIndex = Math.min(carouselIndex, maxIndex);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      handlePrevSlide();
    } else if (diff < -50) {
      handleNextSlide();
    }
    touchStartX.current = null;
  };

  const [previewGalleryImage, setPreviewGalleryImage] = useState<{ url: string; label?: string; stage?: string } | null>(null);

  // Compile all cases from CMS transformations or fall back to static cases
  const allAvailableCases = useMemo(() => {
    if (transformations && transformations.length > 0) {
      return transformations.map((t: any, idx: number) => ({
        id: t.id || `case-${idx}`,
        caseNumber: t.caseNumber || `کیس #${idx + 101}`,
        category: t.category || 'composite',
        categoryLabel: t.categoryLabel || t.badge || 'اصلاح طرح لبخند',
        icon: t.iconName || t.icon || 'auto_fix_high',
        accentColor: t.accentColor || '#004ac6',
        title: t.title || 'اصلاح طرح لبخند',
        patientInfo: t.patientInfo || t.subtitle || 'مراجع کلینیک پارمیس پاکدشت',
        duration: t.duration || '۲ جلسه',
        description: t.description || '',
        guaranteeText: t.guaranteeText || 'ضمانت کتبی کیفیت',
        afterBadge: t.afterBadge || t.afterLabel || 'بعد از درمان',
        beforeImage: t.beforeImage || t.image || '',
        afterImage: t.afterImage || t.mobileImage || t.image || '',
        serviceBookingId: t.serviceBookingId || 'cosmetic-composite',
        galleryImages: t.galleryImages || [],
        tags: t.tags || [],
      }));
    }
    return [...CLINICAL_CASES, ...EXTRA_CASES];
  }, [transformations]);

  // Filter cases based on category
  const filteredCases = useMemo(() => {
    return allAvailableCases.filter(
      (c) => selectedCategory === 'all' || c.category === selectedCategory
    );
  }, [allAvailableCases, selectedCategory]);

  const visibleCases = isExpanded ? filteredCases : filteredCases.slice(0, 6);

  const heroConfig = gallery.hero || defaultGalleryPageSettings.hero;
  const featuredCaseConfig = gallery.featuredCase || defaultGalleryPageSettings.featuredCase;
  const caseGridConfig = gallery.caseGrid || defaultGalleryPageSettings.caseGrid;
  const testimonialsConfig = gallery.testimonials || defaultGalleryPageSettings.testimonials;
  const manifestoConfig = gallery.photographyManifesto || defaultGalleryPageSettings.photographyManifesto;
  const journeyConfig = gallery.journey || defaultGalleryPageSettings.journey;
  const faqsConfig = gallery.faqs || defaultGalleryPageSettings.faqs;
  const ctaConfig = gallery.cta || defaultGalleryPageSettings.cta;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen selection:bg-[#dbe1ff] selection:text-[#004ac6]">
      {/* ================= 1. HERO SECTION ================= */}
      {heroConfig.enabled !== false && (
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-[#004ac6]/10 via-[#f7f9fb] to-[#f7f9fb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Right Column: Text & Metrics */}
              <div className="lg:col-span-7 space-y-5 text-right">
                {/* Eyebrow Badge */}
                {heroConfig.badge && (
                  <div className="inline-flex items-center gap-2 bg-[#dae2fd]/70 text-[#004ac6] px-3.5 py-1.5 rounded-full border border-[#004ac6]/15 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold">
                      {heroConfig.badge}
                    </span>
                  </div>
                )}

                {/* Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#191c1e] leading-tight tracking-tight">
                  {heroConfig.title} <br className="hidden sm:inline" />
                  <span className="text-[#004ac6] drop-shadow-xs">{heroConfig.titleHighlight}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#565e74] leading-relaxed max-w-2xl text-justify">
                  {heroConfig.description}
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#cases-grid"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('cases-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#004ac6] hover:bg-[#003ea8] text-white px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{heroConfig.primaryButtonText || 'مشاهده پرونده‌ها و مقایسه‌ها'}</span>
                    <span className="material-symbols-outlined text-lg">arrow_downward</span>
                  </a>
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="border border-[#c3c6d7] bg-white hover:bg-[#004ac6]/5 text-[#004ac6] px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    <span>
                      {heroConfig.phoneButtonText || 'مشاوره ویزیت رایگان'}: {CLINIC_INFO.phoneCompact}
                    </span>
                  </a>
                </div>

                {/* Trust Verification Metrics (4x Grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#c3c6d7]/40">
                  {(heroConfig.metrics || defaultGalleryPageSettings.hero.metrics).map((metric, idx) => (
                    <div key={metric.id || idx} className="bg-white p-3.5 rounded-2xl border border-[#c3c6d7]/30 text-center shadow-xs">
                      <div className="text-lg sm:text-xl font-black text-[#004ac6]">{metric.value}</div>
                      <div className="text-xs text-[#565e74] font-medium mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left Column: Hero Featured Card (Desktop Anchor) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Glow */}
                  <div className="absolute -top-8 -right-8 w-64 h-64 bg-[#004ac6]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-[#004ac6]/20">
                    <div className="relative rounded-2xl overflow-hidden h-72 sm:h-84 bg-[#eceef0]">
                      {isVideoUrl(heroConfig.featuredCardImage) ? (
                        <video
                          src={heroConfig.featuredCardImage}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={heroConfig.featuredCardImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9IOcy7S7dxAxm2-5P261mSvnBAVLG3Om-maCCHtYzBuz6leLuV1PwxstWlzPV6LGJ0a9rflTBfsIMTSkAmvumYhJMOY5sivlEikShJmpXCxb_8H0lvjjGGaOGb7pBOsqSDHFlyaw663RSwJGTbMlkrP8JimiQsUEKKScYZXRJq4D9sA464cBAnmjMYoem9blqoEJY4xPEHvxTOCdMcTEoZB1-axAi-d6NCPp_d3HrbbOhEadoMD_M'}
                          alt={heroConfig.featuredCardTitle || 'اصلاح طرح لبخند دکتر شمس پور پاکدشت'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-3 inset-x-3 bg-[#191c1e]/85 backdrop-blur-md text-white p-3 rounded-xl flex items-center justify-between shadow-lg">
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-bold">{heroConfig.featuredCardTitle}</p>
                          <p className="text-[11px] text-white/80">{heroConfig.featuredCardSubtitle}</p>
                        </div>
                        <span className="bg-[#004ac6] text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-xs">
                          {heroConfig.featuredCardBadge || 'قبل / بعد'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between px-2 text-xs text-[#565e74]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#004ac6] text-lg">verified</span>
                        <span className="font-bold text-[#191c1e]">
                          {heroConfig.doctorName || CLINIC_INFO.doctorName}
                        </span>
                      </div>
                      <span className="text-[11px]">{heroConfig.doctorSubtitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 2. HORIZONTAL SCROLLABLE FILTER CHIPS ================= */}
      {gallery.filterChips?.enabled !== false && (
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-[#c3c6d7]/30 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-2 shrink-0">
                {(gallery.filterChips?.categories || defaultGalleryPageSettings.filterChips.categories)
                  .filter((cat) => cat.enabled !== false)
                  .map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count =
                      cat.id === 'all'
                        ? allAvailableCases.length
                        : allAvailableCases.filter((c) => c.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#004ac6] text-white shadow-sm'
                            : 'bg-white border border-[#c3c6d7]/40 text-[#434655] hover:bg-[#f2f4f6]'
                        }`}
                      >
                        {cat.icon && (
                          <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                        )}
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-[#565e74] shrink-0 font-medium pl-2">
                <span className="material-symbols-outlined text-[#004ac6] text-base">filter_list</span>
                <span>فیلتر بر اساس متریال و تکنیک</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 3. FEATURED CASE STUDY (HERO BEFORE/AFTER SHOWCASE) ================= */}
      {featuredCaseConfig.enabled !== false && (
        <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2">
            {featuredCaseConfig.badge && (
              <span className="text-[#004ac6] font-bold text-xs sm:text-sm bg-[#004ac6]/10 px-4 py-1.5 rounded-full inline-block">
                {featuredCaseConfig.badge}
              </span>
            )}
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e]">
              {featuredCaseConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#565e74]">
              {featuredCaseConfig.description}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#004ac6]/20 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive Before/After Touch Slider */}
              <div className="lg:col-span-7">
                <ComparisonSlider
                  beforeImage={featuredCaseConfig.beforeImage}
                  afterImage={featuredCaseConfig.afterImage}
                  alt={featuredCaseConfig.title}
                  beforeLabel={featuredCaseConfig.beforeLabel || 'وضعیت اولیه (قبل)'}
                  afterLabel={featuredCaseConfig.afterLabel || 'بعد از درمان'}
                  beforeBadge={featuredCaseConfig.beforeFloatingBadge}
                  afterBadge={featuredCaseConfig.afterFloatingBadge}
                  initialPosition={featuredCaseConfig.sliderInitialPosition ?? 50}
                  dividerColor={featuredCaseConfig.sliderDividerColor || '#004ac6'}
                  heightClass="h-64 sm:h-80 md:h-96"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-[#565e74] mt-3">
                  <span className="material-symbols-outlined text-[#004ac6] text-base">drag_indicator</span>
                  <span>اسلایدر را به چپ و راست بکشید تا نتیجه را مقایسه کنید</span>
                </div>
              </div>

              {/* Clinical Case File Data */}
              <div className="lg:col-span-5 space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-[#c3c6d7]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004ac6] text-2xl">clinical_notes</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#191c1e]">
                      {featuredCaseConfig.caseNumber}
                    </h3>
                  </div>
                  {featuredCaseConfig.unitBadge && (
                    <span className="bg-[#004ac6]/10 text-[#004ac6] text-xs font-bold px-3 py-1 rounded-full">
                      {featuredCaseConfig.unitBadge}
                    </span>
                  )}
                </div>

                {/* Specs Checklist */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-[#f7f9fb] p-3 rounded-2xl border border-[#c3c6d7]/30">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-xl mt-0.5 shrink-0">
                      report_problem
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#191c1e]">{featuredCaseConfig.challengeTitle}:</h4>
                      <p className="text-xs text-[#565e74] mt-0.5 leading-relaxed">
                        {featuredCaseConfig.challengeDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#f7f9fb] p-3 rounded-2xl border border-[#c3c6d7]/30">
                    <span className="material-symbols-outlined text-[#004ac6] text-xl mt-0.5 shrink-0">
                      healing
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#191c1e]">{featuredCaseConfig.planTitle}:</h4>
                      <p className="text-xs text-[#565e74] mt-0.5 leading-relaxed">
                        {featuredCaseConfig.planDesc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-right">
                    <div className="bg-[#f7f9fb] p-3 rounded-2xl border border-[#c3c6d7]/30">
                      <span className="text-[11px] text-[#565e74] block">طول دوره درمان:</span>
                      <span className="text-xs font-bold text-[#191c1e]">{featuredCaseConfig.duration}</span>
                    </div>
                    <div className="bg-[#f7f9fb] p-3 rounded-2xl border border-[#c3c6d7]/30">
                      <span className="text-[11px] text-[#565e74] block">میزان تراش دندان:</span>
                      <span className="text-xs font-bold text-[#191c1e]">{featuredCaseConfig.prepAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="bg-[#004ac6] hover:bg-[#003ea8] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    <span>{featuredCaseConfig.buttonText || 'تماس جهت طرح درمان مشابه'}</span>
                  </a>
                  <span className="text-xs text-[#565e74] flex items-center justify-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                    <span>{featuredCaseConfig.satisfactionText || 'رضایت کامل ثبت‌شده'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 4. CLINICAL CASE GRID (Detailed Patient Cards) ================= */}
      {caseGridConfig.enabled !== false && (
        <section className="py-12 bg-[#f2f4f6]/60 border-y border-[#c3c6d7]/30" id="cases-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 text-right">
              <div>
                <div className="inline-flex items-center gap-2 text-[#004ac6] font-bold text-xs mb-1.5">
                  <span className="material-symbols-outlined text-base">{caseGridConfig.badgeIcon || 'collections_bookmark'}</span>
                  <span>{caseGridConfig.badge}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e]">
                  {caseGridConfig.title}
                </h2>
              </div>
              <p className="text-[#565e74] text-xs sm:text-sm max-w-md">
                {caseGridConfig.description}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCases.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#c3c6d7]/40 hover:shadow-md transition-all flex flex-col justify-between text-right group"
                >
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${c.accentColor}15`,
                          color: c.accentColor,
                        }}
                      >
                        <span className="material-symbols-outlined text-[15px]">{c.icon}</span>
                        <span>{c.categoryLabel}</span>
                      </span>
                      <span className="text-xs text-[#737686] font-medium">{c.caseNumber}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#191c1e] mb-2 leading-snug">
                      {c.title}
                    </h3>

                    {/* Specialized Tags */}
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {c.tags.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="bg-[#004ac6]/8 text-[#004ac6] border border-[#004ac6]/15 text-[10px] font-bold px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Interactive Before/After Slider */}
                    <div className="mb-3">
                      <ComparisonSlider
                        beforeImage={c.beforeImage}
                        afterImage={c.afterImage}
                        alt={c.title}
                        beforeLabel="قبل"
                        afterLabel={c.afterBadge}
                        heightClass="h-48 sm:h-52"
                        accentColor={c.accentColor}
                      />
                    </div>

                    {/* Multi-photo Gallery Thumbnails (Before, During, After, X-ray) */}
                    {c.galleryImages && c.galleryImages.length > 0 && (
                      <div className="mb-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#004ac6]">photo_library</span>
                            <span>عکس‌های تکمیلی ({c.galleryImages.length}):</span>
                          </span>
                          <span className="text-[10px] text-slate-400">بزرگنمایی</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {c.galleryImages.map((img: any, gIdx: number) => {
                            const stageLabels: Record<string, string> = {
                              before: 'قبل',
                              during: 'حین درمان',
                              after: 'بعد',
                              xray: 'رادیوگرافی',
                            };
                            const stageColors: Record<string, string> = {
                              before: 'bg-slate-700',
                              during: 'bg-amber-600',
                              after: 'bg-emerald-600',
                              xray: 'bg-indigo-600',
                            };
                            return (
                              <button
                                key={gIdx}
                                type="button"
                                onClick={() => setPreviewGalleryImage(img)}
                                className="group/thumb relative w-14 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 hover:border-[#004ac6] transition-all cursor-pointer shadow-2xs"
                                title={img.label || 'تصویر پرونده'}
                              >
                                <img
                                  src={img.url}
                                  alt={img.label || 'تصویر پرونده'}
                                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                                />
                                {img.stage && (
                                  <span
                                    className={`absolute bottom-0 inset-x-0 text-white text-[7px] font-bold py-0.5 text-center leading-none ${
                                      stageColors[img.stage] || 'bg-black/70'
                                    }`}
                                  >
                                    {stageLabels[img.stage] || img.stage}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-[#565e74] leading-relaxed mb-3 text-justify">
                      {c.description}
                    </p>
                  </div>

                  {/* Footer specs & Actions */}
                  <div className="pt-3 border-t border-[#c3c6d7]/30 flex items-center justify-between text-xs text-[#565e74]">
                    <span>{c.duration}</span>
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="text-[#004ac6] hover:text-[#003ea8] font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>تماس جهت این درمان</span>
                      <span className="material-symbols-outlined text-sm rotate-180">arrow_back</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {filteredCases.length > 6 && (
              <div className="mt-8 sm:mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-[#004ac6]/30 text-[#004ac6] hover:bg-[#004ac6]/5 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                  <span>
                    {isExpanded
                      ? (caseGridConfig.collapseText || 'بستن موارد تکمیلی')
                      : (caseGridConfig.loadMoreText || `مشاهده موارد بیشتر (${filteredCases.length - 6} پرونده دیگر)`)}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= 5. VIDEO REVIEWS / PATIENT TESTIMONIALS ================= */}
      {testimonialsConfig.enabled !== false && (
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            {testimonialsConfig.badge && (
              <div className="inline-block mb-3.5 sm:mb-4">
                <span className="text-[#004ac6] font-bold text-xs sm:text-sm bg-[#004ac6]/10 px-4 py-1.5 rounded-full border border-[#004ac6]/15 shadow-2xs">
                  {testimonialsConfig.badge}
                </span>
              </div>
            )}
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e] mb-2.5 sm:mb-3.5">
              {testimonialsConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
              {testimonialsConfig.description}
            </p>
          </div>

          {!isCarousel ? (
            /* 3 or fewer items: standard clean grid without wrapping */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#c3c6d7]/30 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-right"
                >
                  <div>
                    {/* Video Preview Thumbnail */}
                    <div
                      onClick={() => setActiveVideoModal(t)}
                      className="relative rounded-2xl overflow-hidden aspect-video bg-[#191c1e] group mb-3 cursor-pointer select-none"
                    >
                      {isVideoUrl(t.videoUrl || t.image) ? (
                        <video
                          src={t.videoUrl || t.image}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-2xl">play_arrow</span>
                        </div>
                      </div>
                      {t.duration && (
                        <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded font-medium backdrop-blur-xs">
                          {t.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#191c1e]">{t.name}</h3>
                    <span className="text-xs text-[#565e74] block mt-0.5">{t.location}</span>
                    <p className="text-xs text-[#434655] mt-2.5 leading-relaxed text-justify line-clamp-3">
                      {t.quote}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#c3c6d7]/30 flex items-center justify-between text-[11px] text-[#004ac6] font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>تأیید رضایت بالینی</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(t)}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>مشاهده ویدیو</span>
                      <span className="material-symbols-outlined text-xs rotate-180">arrow_back</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* More than 3 items: Single-row Carousel with Navigation Controls (never stacks down) */
            <div className="relative">

              {/* Carousel Viewport */}
              <div
                className="overflow-hidden w-full select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-700 ease-out -mx-3"
                  style={{
                    transform: `translateX(${(safeIndex * 100) / itemsPerPage}%)`,
                  }}
                >
                  {localTestimonials.map((t) => (
                    <div
                      key={t.id}
                      style={{ width: `${100 / itemsPerPage}%` }}
                      className="shrink-0 px-3 flex flex-col"
                    >
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#c3c6d7]/30 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full text-right">
                        <div>
                          {/* Video Preview Thumbnail */}
                          <div
                            onClick={() => setActiveVideoModal(t)}
                            className="relative rounded-2xl overflow-hidden aspect-video bg-[#191c1e] group mb-3 cursor-pointer select-none"
                          >
                            {isVideoUrl(t.videoUrl || t.image) ? (
                              <video
                                src={t.videoUrl || t.image}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <img
                                src={t.image}
                                alt={t.name}
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                              <div className="w-11 h-11 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">play_arrow</span>
                              </div>
                            </div>
                            {t.duration && (
                              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded font-medium backdrop-blur-xs">
                                {t.duration}
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[#191c1e]">{t.name}</h3>
                          <span className="text-xs text-[#565e74] block mt-0.5">{t.location}</span>
                          <p className="text-xs text-[#434655] mt-2.5 leading-relaxed text-justify line-clamp-3">
                            {t.quote}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#c3c6d7]/30 flex items-center justify-between text-[11px] text-[#004ac6] font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>تأیید رضایت بالینی</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveVideoModal(t)}
                            className="hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>مشاهده ویدیو</span>
                            <span className="material-symbols-outlined text-xs rotate-180">arrow_back</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls: Dots & Next/Prev */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5 dir-ltr">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        safeIndex === idx
                          ? 'w-8 h-2.5 bg-[#004ac6]'
                          : 'w-2.5 h-2.5 bg-[#c3c6d7]/70 hover:bg-[#565e74]'
                      }`}
                      aria-label={`اسلاید ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-10 h-10 rounded-full border border-[#c3c6d7]/60 bg-white hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6] text-[#191c1e] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                    title="اسلاید قبلی"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>

                  <span className="text-xs font-bold text-[#565e74] px-1 font-mono">
                    {safeIndex + 1} / {maxIndex + 1}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-10 h-10 rounded-full border border-[#c3c6d7]/60 bg-white hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6] text-[#191c1e] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                    title="اسلاید بعدی"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Video Lightbox Modal */}
          {activeVideoModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right relative shadow-2xl animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#f2f4f6] text-[#565e74] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex items-center gap-2 mb-4 text-[#004ac6]">
                  <span className="material-symbols-outlined text-2xl">movie</span>
                  <h4 className="font-bold text-base text-[#191c1e]">
                    روایت تصویری مراجع: {typeof activeVideoModal === 'object' ? activeVideoModal.name : activeVideoModal}
                  </h4>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#191c1e] mb-4 flex items-center justify-center">
                  {typeof activeVideoModal === 'object' && isVideoUrl(activeVideoModal.videoUrl || activeVideoModal.image) ? (
                    <video
                      src={activeVideoModal.videoUrl || activeVideoModal.image}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <div className="text-center text-white px-4">
                      <span className="material-symbols-outlined text-4xl text-[#004ac6] mb-2 animate-pulse">
                        play_circle
                      </span>
                      <p className="text-xs font-semibold">
                        پخش مستند ویدیویی رضایت بیمار در کلینیک پارمیس پاکدشت
                      </p>
                      <p className="text-[11px] text-white/70 mt-1">
                        جهت مشاهده آلبوم کامل ویدیویی می‌توانید به کلینیک مراجعه فرمایید.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(null)}
                    className="px-5 py-2.5 rounded-full bg-[#f2f4f6] text-[#191c1e] text-xs font-bold hover:bg-[#e6e8ea] cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    onClick={() => setActiveVideoModal(null)}
                    className="px-5 py-2.5 rounded-full bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ea8] cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>تماس جهت نوبت مشاوره</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= 6. CLINICAL PHOTOGRAPHY INTEGRITY (TRANSPARENCY MANIFESTO) ================= */}
      {manifestoConfig.enabled !== false && (
        <section className="py-12 bg-white border-y border-[#c3c6d7]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#004ac6]/5 rounded-3xl p-6 sm:p-10 border border-[#004ac6]/15">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-3 text-right">
                  <span className="text-[#004ac6] font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">{manifestoConfig.badgeIcon || 'photo_camera'}</span>
                    <span>{manifestoConfig.badge}</span>
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e]">
                    {manifestoConfig.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed text-justify">
                    {manifestoConfig.description}
                  </p>
                </div>

                <div
                  className={`lg:col-span-7 grid gap-3.5 text-right ${
                    manifestoConfig.columns === '4'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                      : manifestoConfig.columns === '3'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {(manifestoConfig.principles || defaultGalleryPageSettings.photographyManifesto.principles).map((pr, pIdx) => (
                    <div key={pr.id || pIdx} className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] shrink-0">
                        <span className="material-symbols-outlined text-xl">{pr.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#191c1e]">{pr.title}</h3>
                        <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                          {pr.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 7. FOUR STEPS TO AN IDEAL SMILE (JOURNEY) ================= */}
      {journeyConfig.enabled !== false && (
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            {journeyConfig.badge && (
              <div className="inline-block mb-3.5 sm:mb-4">
                <span className="text-[#004ac6] font-bold text-xs sm:text-sm bg-[#004ac6]/10 px-4 py-1.5 rounded-full border border-[#004ac6]/15 shadow-2xs">
                  {journeyConfig.badge}
                </span>
              </div>
            )}
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e] mb-2.5 sm:mb-3.5">
              {journeyConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
              {journeyConfig.description}
            </p>
          </div>

          <div
            className={`grid gap-4 sm:gap-6 ${
              (journeyConfig.steps || defaultGalleryPageSettings.journey.steps).length <= 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : (journeyConfig.steps || defaultGalleryPageSettings.journey.steps).length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {(journeyConfig.steps || defaultGalleryPageSettings.journey.steps).map((step, sIdx) => (
              <div key={step.id || sIdx} className="bg-white p-5 rounded-3xl border border-[#c3c6d7]/30 shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#004ac6] text-white flex items-center justify-center font-black text-sm shadow-sm">
                      {step.stepNumber || `${sIdx + 1}`}
                    </span>
                    {step.icon && (
                      <span className="w-9 h-9 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">{step.icon}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#191c1e] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#565e74] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 8. FREQUENTLY ASKED QUESTIONS ================= */}
      {faqsConfig.enabled !== false && (
        <section className="py-12 sm:py-16 bg-[#f2f4f6]/60 border-t border-[#c3c6d7]/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
            <div className="text-center mb-8 sm:mb-12">
              {faqsConfig.badge && (
                <div className="inline-block mb-3.5 sm:mb-4">
                  <span className="text-[#004ac6] font-bold text-xs sm:text-sm bg-[#004ac6]/10 px-4 py-1.5 rounded-full border border-[#004ac6]/15 shadow-2xs">
                    {faqsConfig.badge}
                  </span>
                </div>
              )}
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e]">
                {faqsConfig.title}
              </h2>
            </div>

            <div className="space-y-3.5">
              {(faqsConfig.items || defaultGalleryPageSettings.faqs.items).map((faqItem, fIdx) => (
                <details key={faqItem.id || fIdx} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c3c6d7]/30 group shadow-xs">
                  <summary className="list-none flex items-center justify-between font-bold text-xs sm:text-sm text-[#191c1e] cursor-pointer select-none">
                    <span>{faqItem.q}</span>
                    <span className="material-symbols-outlined text-[#004ac6] transition-transform duration-200 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-xs text-[#565e74] mt-3 pt-3 border-t border-[#c3c6d7]/20 leading-relaxed text-justify">
                    {faqItem.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 9. DIRECT CONVERSION CTA BANNER ================= */}
      {ctaConfig.enabled !== false && (
        <section className="py-12 sm:py-16 bg-gradient-to-l from-[#004ac6] to-[#2563eb] text-white relative overflow-hidden">
          {/* Background Dental Deco */}
          <span className="material-symbols-outlined absolute -bottom-8 -left-8 text-[140px] text-white/10 pointer-events-none select-none">
            dentistry
          </span>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                {ctaConfig.badge && (
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {ctaConfig.badge}
                  </span>
                )}
                <h2 className="text-xl sm:text-3xl font-extrabold leading-tight">
                  {ctaConfig.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {ctaConfig.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <a
                  href={`tel:${CLINIC_INFO.phone2}`}
                  className="bg-white text-[#004ac6] hover:bg-[#f2f4f6] px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  <span>{ctaConfig.phoneButtonText || 'تماس مستقیم'}: {CLINIC_INFO.phoneCompact2}</span>
                </a>
                <a
                  href={ctaConfig.whatsappLink || (clinicInfo as any)?.whatsappUrl || 'https://wa.me/989215395923'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white hover:bg-white/10 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>{ctaConfig.whatsappButtonText || 'مشاوره و هماهنگی در واتساپ'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 10. PREVIEW GALLERY IMAGE MODAL ================= */}
      {previewGalleryImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 text-right relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setPreviewGalleryImage(null)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#004ac6] text-2xl">photo_library</span>
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">
                  {previewGalleryImage.label || 'تصویر پرونده بالینی'}
                </h4>
                {previewGalleryImage.stage && (
                  <span className="text-[10px] text-slate-500">
                    مرحله: {previewGalleryImage.stage === 'before' ? 'قبل از درمان' : previewGalleryImage.stage === 'during' ? 'حین درمان' : previewGalleryImage.stage === 'after' ? 'بعد از درمان' : 'رادیوگرافی'}
                  </span>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 mb-4 flex items-center justify-center border border-slate-200">
              <img
                src={previewGalleryImage.url}
                alt={previewGalleryImage.label || 'تصویر پرونده'}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewGalleryImage(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
