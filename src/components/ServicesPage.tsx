import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { useCMS, defaultServicesPageSettings } from '../context/CMSContext.tsx';
import { AppIcon } from './AppIcon.tsx';
import { isVideoUrl } from '../utils/mediaUtils.tsx';

interface ServicesPageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateHome: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking }) => {
  const { siteImages, clinicInfo, servicesPageSettings } = useCMS();
  const sSettings = servicesPageSettings || defaultServicesPageSettings;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [openMobileFaq, setOpenMobileFaq] = useState<number | null>(null);
  const [openDesktopFaq, setOpenDesktopFaq] = useState<number | null>(0);

  const handleMobileFilterClick = (cat: string) => {
    setActiveFilter(cat);
    if (cat === 'implant') {
      document.getElementById('implant-highlight')?.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'beauty') {
      document.getElementById('mobile-cosmetic-services')?.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'therapy') {
      document.getElementById('mobile-restorative-services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentFaqs =
    sSettings.faqs?.items && sSettings.faqs.items.length > 0
      ? sSettings.faqs.items
      : defaultServicesPageSettings.faqs.items;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e]">
      {/* ================= MOBILE SERVICES PAGE (< md) ================= */}
      <div className="md:hidden text-right">
        {/* 1. HERO SECTION */}
        {sSettings.hero?.enabled !== false && (
          <section className="px-4 pt-5 pb-6">
            {/* Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dae2fd]/60 text-[#004ac6] rounded-full mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-ping" />
              <span className="text-xs font-bold">{sSettings.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[1.75rem] text-[#191c1e] tracking-tight leading-tight font-extrabold mb-2.5">
              {sSettings.hero.title} <span className="text-[#2563eb]">{sSettings.hero.titleHighlight}</span>
            </h1>
            <p className="text-base text-[#434655] leading-relaxed mb-4">
              {sSettings.hero.description}
            </p>

            {/* Key Medical Highlights Matrix (3 Pills) */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(sSettings.hero.highlights || defaultServicesPageSettings.hero.highlights).map((hl) => (
                <div
                  key={hl.id}
                  className="dental-card-interactive bg-white p-2.5 rounded-2xl border border-[#c3c6d7]/30 text-center flex flex-col items-center justify-center shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-[#dae2fd]/40 text-[#004ac6] flex items-center justify-center mb-1">
                    <AppIcon name={hl.icon} className="text-lg animate-dental-sparkle" />
                  </div>
                  <span className="text-xs font-bold text-[#191c1e]">{hl.title}</span>
                </div>
              ))}
            </div>

            {/* Hero Visual Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#c3c6d7]/20 bg-white">
              <img
                className="w-full h-52 object-cover"
                alt={sSettings.hero.bannerAlt || 'کلینیک مجهز پارمیس پاکدشت'}
                src={sSettings.hero.bannerImage || siteImages.servicesBannerImage?.url}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d3133]/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-sm font-bold">
                  {sSettings.hero.bannerCaptionTitle}
                </span>
                <span className="text-[#e0e3e5] text-sm">{sSettings.hero.bannerCaptionDesc}</span>
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs animate-dental-float">
                <AppIcon
                  name={sSettings.hero.floatingBadgeIcon || 'star'}
                  className="text-[#004ac6] text-sm"
                />
                <span className="text-xs font-bold text-[#191c1e]">
                  {sSettings.hero.floatingBadgeTitle}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 2. CATEGORY FILTER TABS (HORIZONTAL SCROLL) */}
        <section className="sticky top-[56px] sm:top-[62px] z-30 bg-[#f7f9fb]/98 backdrop-blur-md pt-5 pb-4 px-4 sm:px-6 border-b border-[#c3c6d7]/30 shadow-xs transition-all">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <button
              type="button"
              onClick={() => handleMobileFilterClick('all')}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-[#004ac6] text-white font-bold shadow-xs'
                  : 'bg-white text-[#434655] border border-[#c3c6d7]/40 font-medium'
              }`}
            >
              <AppIcon name="tune" className="text-sm" />
              <span>همه خدمات</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileFilterClick('beauty')}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                activeFilter === 'beauty'
                  ? 'bg-[#004ac6] text-white font-bold shadow-xs'
                  : 'bg-white text-[#434655] border border-[#c3c6d7]/40 font-medium'
              }`}
            >
              <AppIcon name="sentiment_very_satisfied" className="text-sm" />
              <span>زیبایی و لبخند</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileFilterClick('implant')}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                activeFilter === 'implant'
                  ? 'bg-[#004ac6] text-white font-bold shadow-xs'
                  : 'bg-white text-[#434655] border border-[#c3c6d7]/40 font-medium'
              }`}
            >
              <AppIcon name="dentistry" className="text-sm" />
              <span>ایمپلنت و جراحی</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileFilterClick('therapy')}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                activeFilter === 'therapy'
                  ? 'bg-[#004ac6] text-white font-bold shadow-xs'
                  : 'bg-white text-[#434655] border border-[#c3c6d7]/40 font-medium'
              }`}
            >
              <AppIcon name="healing" className="text-sm" />
              <span>درمانی و عصب‌کشی</span>
            </button>
          </div>
        </section>

        {/* 3. FEATURED PROMINENT IMPLANT CARD */}
        {sSettings.implant?.enabled !== false && (
          <section className="px-4 py-4" id="implant-highlight">
            <div className="bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#00569c] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <div className="flex justify-between items-start mb-3">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                  <AppIcon name={sSettings.implant.badgeIcon || 'stars'} className="text-sm" />
                  <span>{sSettings.implant.badge}</span>
                </span>
                <span className="text-xs bg-[#dae2fd] text-[#00174b] px-2.5 py-0.5 rounded-full font-bold">
                  {sSettings.implant.guaranteeBadge}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-1.5">{sSettings.implant.title}</h2>
              <p className="text-sm text-white/90 mb-4 leading-relaxed">
                {sSettings.implant.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4 bg-white/10 p-3 rounded-2xl backdrop-blur-xs text-xs">
                {(sSettings.implant.features || []).map((feat) => (
                  <div key={feat.id} className="flex items-center gap-1.5">
                    <AppIcon name={feat.icon || 'check_circle'} className="text-[#b4c5ff] text-base shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <a
                  href={`tel:${sSettings.implant.buttonPhone || CLINIC_INFO.phone}`}
                  className="flex-1 bg-white text-[#004ac6] py-2.5 rounded-full text-center text-sm font-bold shadow-md hover:bg-[#e6e8ea] transition-colors active:scale-95 duration-150"
                >
                  {sSettings.implant.buttonText}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 4. COSMETIC & SMILE DESIGN SECTION */}
        {sSettings.cosmeticCategory?.enabled !== false && (
          <section className="px-4 py-4" id="mobile-cosmetic-services">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-[#004ac6] font-bold">
                  {sSettings.cosmeticCategory.badge}
                </span>
                <h2 className="text-xl font-bold text-[#191c1e]">
                  {sSettings.cosmeticCategory.title}
                </h2>
              </div>
              <AppIcon
                name={sSettings.cosmeticCategory.badgeIcon || 'auto_fix_high'}
                className="text-[#004ac6] text-2xl"
              />
            </div>

            {/* Cosmetic Cards Grid (Stacked for Mobile) */}
            <div className="space-y-3.5">
              {(sSettings.cosmeticCategory.cards || []).map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 border border-[#c3c6d7]/30 shadow-xs flex flex-col gap-3"
                >
                  <div className="flex gap-3">
                    {c.imageUrl ? (
                      <img
                        className="w-24 h-24 rounded-2xl object-cover shrink-0"
                        alt={c.title}
                        src={c.imageUrl}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-[#dae2fd]/40 text-[#004ac6] flex items-center justify-center shrink-0">
                        <AppIcon name={c.icon || 'dentistry'} className="text-3xl" />
                      </div>
                    )}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#191c1e] text-base">{c.title}</h3>
                          {c.badge && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                c.badgeType === 'secondary'
                                  ? 'bg-[#d4e3ff] text-[#00569c]'
                                  : c.badgeType === 'neutral'
                                  ? 'bg-[#eceef0] text-[#434655]'
                                  : 'bg-[#dae2fd] text-[#004ac6]'
                              }`}
                            >
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#434655] line-clamp-2 mt-1">
                          {c.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#565e74] mt-1">
                        {c.lifespan && (
                          <span className="flex items-center gap-1">
                            <AppIcon name="schedule" className="text-xs text-[#004ac6]" />
                            ماندگاری: {c.lifespan}
                          </span>
                        )}
                        {c.technique && (
                          <span className="flex items-center gap-1">
                            <AppIcon name="verified" className="text-xs text-[#004ac6]" />
                            {c.technique}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#c3c6d7]/20 flex items-center justify-between">
                    <span className="text-sm text-[#191c1e] font-semibold">
                      {c.technique || 'مشاوره انتخاب رنگ و تناژ'}
                    </span>
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="text-[#004ac6] text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>{c.ctaText || 'درخواست مشاوره'}</span>
                      <AppIcon name="arrow_back" className="text-sm" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. GENERAL & RESTORATIVE DENTAL SERVICES */}
        {sSettings.restorativeCategory?.enabled !== false && (
          <section
            className="px-4 py-4 bg-[#f2f4f6]/60 rounded-xl my-4"
            id="mobile-restorative-services"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-[#004ac6] font-bold">
                  {sSettings.restorativeCategory.badge}
                </span>
                <h2 className="text-xl font-bold text-[#191c1e]">
                  {sSettings.restorativeCategory.title}
                </h2>
              </div>
              <AppIcon
                name={sSettings.restorativeCategory.badgeIcon || 'medical_services'}
                className="text-[#004ac6] text-2xl"
              />
            </div>

            {/* Bento-style 2-column list */}
            <div className="grid grid-cols-2 gap-2.5">
              {(sSettings.restorativeCategory.cards || []).map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#c3c6d7]/20 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-full bg-[#dae2fd]/50 text-[#004ac6] flex items-center justify-center mb-2">
                      <AppIcon name={c.icon || 'healing'} className="text-xl" />
                    </div>
                    <h4 className="text-sm font-bold text-[#191c1e] mb-1">{c.title}</h4>
                    <p className="text-[#434655] text-xs line-clamp-3">{c.description}</p>
                  </div>
                  {c.badge && (
                    <span className="text-[11px] font-bold text-[#004ac6] mt-2">
                      {c.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. TREATMENT STEPS (JOURNEY FOR MOBILE) */}
        {sSettings.journey?.enabled !== false && (
          <section className="px-4 py-4">
            <div className="bg-white rounded-2xl p-4 border border-[#c3c6d7]/20 shadow-xs">
              <h3 className="text-xl font-bold text-[#191c1e] mb-3 flex items-center gap-2">
                <AppIcon name={sSettings.journey.badgeIcon || 'route'} className="text-[#004ac6]" />
                <span>{sSettings.journey.title}</span>
              </h3>

              <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:right-4 before:w-0.5 before:bg-[#dae2fd]">
                {(sSettings.journey.steps || []).map((st, sIdx) => (
                  <div key={st.id || sIdx} className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white font-bold text-xs flex items-center justify-center z-10 shrink-0 shadow-xs">
                      {st.stepNumber || `${sIdx + 1}`}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191c1e]">{st.title}</h4>
                      <p className="text-[#434655] text-xs">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. DOCTOR PROFILE CARD */}
        <section className="px-4 py-4">
          <div className="bg-white rounded-2xl p-4 border border-[#c3c6d7]/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2563eb] shadow-xs"
                alt={siteImages.doctorProfileImage?.alt || clinicInfo.doctorName}
                src={siteImages.doctorProfileImage?.url || clinicInfo.doctorImage || CLINIC_INFO.doctorImage}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-[#191c1e]">{clinicInfo.doctorName}</h3>
                <span className="text-sm text-[#004ac6] font-semibold">{clinicInfo.doctorRole || 'جراح - دندانپزشک'}</span>
                <span className="text-xs text-[#565e74]">
                  {clinicInfo.medicalCouncilCode ? `شماره نظام پزشکی: ${clinicInfo.medicalCouncilCode}` : 'عضو سازمان نظام پزشکی کشور'}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#434655] leading-relaxed">
              با سال‌ها تجربه درخشان در زمینه جراحی دندان، کاشت ایمپلنت و دندانپزشکی ترمیمی و زیبایی
              در پاکدشت با تعهد به سلامت پایدار دهان و دندان بیماران.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#c3c6d7]/20">
              <span className="bg-[#eceef0] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#434655]">
                مجهز به رادیوگرافی دیجیتال RVG
              </span>
              <span className="bg-[#eceef0] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#434655]">
                دستگاه اتوکلاو کلاس B بیمارستانی
              </span>
              <span className="bg-[#eceef0] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#434655]">
                محیط اختصاصی کودکان و بزرگسالان
              </span>
            </div>
          </div>
        </section>

        {/* 8. FAQ ACCORDION */}
        {sSettings.faqs?.enabled !== false && (
          <section className="px-4 py-4">
            <div className="text-center mb-3">
              <span className="text-xs text-[#004ac6] font-bold">{sSettings.faqs.badge}</span>
              <h2 className="text-xl font-bold text-[#191c1e]">{sSettings.faqs.title}</h2>
            </div>

            <div className="space-y-2.5">
              {currentFaqs.map((faq, idx) => {
                const isOpen = openMobileFaq === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className="bg-white rounded-2xl border border-[#c3c6d7]/30 overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMobileFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-3.5 text-right text-sm font-bold text-[#191c1e]"
                    >
                      <span>{faq.q}</span>
                      <AppIcon
                        name="expand_more"
                        className={`text-[#004ac6] text-xl transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-[#434655] text-xs leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 9. LOCATION & CONTACT QUICK CARD */}
        <section className="px-4 py-4">
          <div className="bg-white rounded-2xl p-4 border border-[#c3c6d7]/30 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AppIcon name="location_on" className="text-[#004ac6]" />
              <h3 className="text-xl font-bold text-[#191c1e]">
                آدرس و اطلاعات دسترسی کلینیک
              </h3>
            </div>
            <p className="text-sm text-[#434655] mb-3">
              پاکدشت، مجتمع پزشکی راستین، طبقه دندانپزشکی پارمیس (دکتر انوشیروان شمس پور)
            </p>

            {/* Simulated Map / Location Preview */}
            <div className="relative rounded-2xl overflow-hidden mb-3 border border-[#c3c6d7]/20 h-36 bg-[#eceef0]">
              <img
                className="w-full h-full object-cover"
                alt="پاکدشت، مجتمع پزشکی راستین"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo_eNj0205uzg3HAbJRgYsLoEp5HF0Vzc8fBbUyalDcPllL9JwWrnxzVG5E2018okWfJ_kKJKd17lGi-SsDgdp57nzezf670DaOkAEMVFRXlK2TAAoMYftlnVVE7Jrah3kwfq3wr1Zc17SUvfbmwwvfwAemoysdEI-w_tC2wJl4aSxm3f1hMJJIADodJadNixT7DBqR5jiXiMVlhjZxh1kiQhLl00elp-Q3y7rIK-AFKnI9zGV9whx"
              />
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 left-2 bg-white text-[#004ac6] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
              >
                <AppIcon name="directions" className="text-sm" />
                <span>مسیریابی در نشان / بلد</span>
              </a>
            </div>

            {/* Working Hours & Direct Call Box */}
            <div className="space-y-2 text-xs bg-[#f2f4f6] p-3 rounded-2xl mb-3">
              <div className="flex justify-between items-center">
                <span className="text-[#565e74] font-medium">ساعات کاری مطب:</span>
                <span className="font-bold text-[#191c1e]">{clinicInfo?.workingHours || CLINIC_INFO.workingHours}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#565e74] font-medium">شماره تماس مستقیم:</span>
                <div className="font-bold text-[#004ac6] text-sm space-y-0.5 text-left dir-ltr">
                  <div className="block">{clinicInfo?.phoneDisplay || CLINIC_INFO.phoneDisplay}</div>
                  <div className="block">{clinicInfo?.phoneDisplay2 || CLINIC_INFO.phoneDisplay2}</div>
                </div>
              </div>
            </div>

            <a
              href={`tel:${CLINIC_INFO.phone2}`}
              className="w-full bg-[#2563eb] text-white py-3 rounded-full flex items-center justify-center gap-2 text-sm font-bold shadow-md active:scale-95 duration-150"
            >
              <AppIcon name="call" />
              <span>تماس و رزرو وقت ویزیت ({CLINIC_INFO.phoneCompact2})</span>
            </a>
          </div>
        </section>
      </div>

      {/* ================= DESKTOP SERVICES PAGE (>= md) ================= */}
      <div className="hidden md:block text-right">
        {/* Hero Section */}
        {sSettings.hero?.enabled !== false && (
          <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-[#f7f9fb] via-[#f2f4f6]/50 to-[#f7f9fb]">
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#dbe1ff]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-4 w-72 h-72 bg-[#dae2fd]/40 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
              {/* Eyebrow Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004ac6]/10 text-[#004ac6] border border-[#004ac6]/20 text-sm font-bold">
                  <AppIcon name={sSettings.hero.badgeIcon || 'verified'} className="text-lg" />
                  <span>{sSettings.hero.badge}</span>
                </div>
              </div>

              {/* Main Headline & Subtitle */}
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h1 className="text-4xl lg:text-[3.5rem] font-extrabold text-[#191c1e] tracking-tight mb-4 leading-[1.15]">
                  {sSettings.hero.title} <span className="text-[#2563eb]">{sSettings.hero.titleHighlight}</span>
                </h1>
                <p className="text-[1.125rem] text-[#565e74] leading-relaxed">
                  {sSettings.hero.description}
                </p>
              </div>

              {/* Quick Category Navigation Pill Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-12 p-1.5 bg-white rounded-full shadow-xs border border-[#c3c6d7]/40">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-[#2563eb] text-white font-bold text-sm shadow-xs transition-all"
                >
                  همه خدمات
                </button>
                <a
                  href="#cosmetic"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('cosmetic')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[#565e74] hover:text-[#004ac6] hover:bg-[#f2f4f6] font-bold text-sm transition-colors"
                >
                  دندان‌پزشکی زیبایی
                </a>
                <a
                  href="#restorative"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('restorative')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[#565e74] hover:text-[#004ac6] hover:bg-[#f2f4f6] font-bold text-sm transition-colors"
                >
                  درمان و ترمیمی
                </a>
                <a
                  href="#implant"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('implant')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[#565e74] hover:text-[#004ac6] hover:bg-[#f2f4f6] font-bold text-sm transition-colors"
                >
                  جراحی و ایمپلنت
                </a>
                <a
                  href="#journey"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[#565e74] hover:text-[#004ac6] hover:bg-[#f2f4f6] font-bold text-sm transition-colors"
                >
                  مراحل درمان
                </a>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[#565e74] hover:text-[#004ac6] hover:bg-[#f2f4f6] font-bold text-sm transition-colors"
                >
                  پرسش‌های متداول
                </a>
              </div>

              {/* Hero Visual Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Main Image Presentation */}
                <div className="lg:col-span-7 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#f2f4f6]">
                    <img
                      className="w-full h-[420px] object-cover"
                      alt={sSettings.hero.bannerAlt || 'زیبایی طبیعی و لبخندی بااعتمادبه‌نفس'}
                      src={sSettings.hero.bannerImage || siteImages.servicesBannerImage?.url}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d3133]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 right-6 left-6 text-white flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold">{sSettings.hero.bannerCaptionTitle}</p>
                        <p className="text-sm opacity-90 mt-1">
                          {sSettings.hero.bannerCaptionDesc}
                        </p>
                      </div>
                      {sSettings.hero.bannerTechnologyTag && (
                        <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 text-xs font-semibold">
                          {sSettings.hero.bannerTechnologyTag}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Badge Top Left */}
                  <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border border-[#c3c6d7]/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#d4e3ff] text-[#004ac6] flex items-center justify-center">
                      <AppIcon
                        name={sSettings.hero.floatingBadgeIcon || 'health_and_safety'}
                        className="text-2xl"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-[#191c1e] font-bold">{sSettings.hero.floatingBadgeTitle}</p>
                      <p className="text-sm text-[#565e74]">{sSettings.hero.floatingBadgeDesc}</p>
                    </div>
                  </div>
                </div>

                {/* 3 Feature Stat Cards on the Left */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {(sSettings.hero.highlights || defaultServicesPageSettings.hero.highlights).map((hl, hIdx) => (
                    <div
                      key={hl.id || hIdx}
                      className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs hover:-translate-y-1 transition-transform"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shrink-0">
                          <AppIcon name={hl.icon} className="text-2xl" />
                        </div>
                        <div>
                          <h2 className="text-xl text-[#191c1e] font-bold mb-1">
                            {hl.title}
                          </h2>
                          <p className="text-base text-[#565e74] leading-relaxed">
                            {hl.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 1: دندان‌پزشکی زیبایی (Cosmetic Dentistry) */}
        {sSettings.cosmeticCategory?.enabled !== false && (
          <section className="py-16 bg-white border-t border-[#c3c6d7]/20" id="cosmetic">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-semibold mb-3">
                    <AppIcon name={sSettings.cosmeticCategory.badgeIcon || 'flare'} className="text-base" />
                    <span>{sSettings.cosmeticCategory.badge}</span>
                  </div>
                  <h2 className="text-[2.25rem] text-[#191c1e] font-bold leading-[1.25]">
                    {sSettings.cosmeticCategory.title}
                  </h2>
                  <p className="text-base text-[#565e74] mt-2 max-w-2xl">
                    {sSettings.cosmeticCategory.description}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="inline-flex items-center gap-2 text-[#004ac6] font-bold text-sm hover:underline"
                  >
                    <span>{sSettings.cosmeticCategory.consultationText || 'دریافت مشاوره تخصصی زیبایی'}</span>
                    <AppIcon name="arrow_back" className="text-lg" />
                  </a>
                </div>
              </div>

              {/* Grid of Cosmetic Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(sSettings.cosmeticCategory.cards || []).map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#f7f9fb] rounded-2xl p-6 border border-[#c3c6d7]/40 flex flex-col justify-between hover:-translate-y-1 transition-all"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center mb-5">
                        <AppIcon name={c.icon || 'dentistry'} className="text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-[#191c1e] mb-2">{c.title}</h3>
                      <p className="text-sm text-[#565e74] mb-6 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="space-y-2.5 pt-4 border-t border-[#c3c6d7]/30 mb-6 text-sm">
                        {c.duration && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#565e74] flex items-center gap-1">
                              <AppIcon name="schedule" className="text-base text-[#737686]" />
                              طول درمان:
                            </span>
                            <span className="font-semibold text-[#191c1e]">{c.duration}</span>
                          </div>
                        )}
                        {c.lifespan && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#565e74] flex items-center gap-1">
                              <AppIcon name="verified_user" className="text-base text-[#737686]" />
                              میزان ماندگاری:
                            </span>
                            <span className="font-semibold text-[#191c1e]">{c.lifespan}</span>
                          </div>
                        )}
                        {c.technique && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#565e74] flex items-center gap-1">
                              <AppIcon name="healing" className="text-base text-[#737686]" />
                              تکنیک:
                            </span>
                            <span className="font-semibold text-[#004ac6]">{c.technique}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="w-full text-center py-2.5 rounded-full bg-[#004ac6]/10 hover:bg-[#004ac6] hover:text-white text-[#004ac6] font-bold text-sm transition-all"
                    >
                      {c.ctaText || 'درخواست مشاوره'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 2: خدمات درمانی، ترمیمی و اندودانتیکس */}
        {sSettings.restorativeCategory?.enabled !== false && (
          <section className="py-16 bg-[#f7f9fb]" id="restorative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00569c]/10 text-[#00569c] text-xs font-semibold mb-3">
                  <AppIcon name={sSettings.restorativeCategory.badgeIcon || 'medical_services'} className="text-base" />
                  <span>{sSettings.restorativeCategory.badge}</span>
                </div>
                <h2 className="text-[2.25rem] text-[#191c1e] font-bold leading-[1.25]">
                  {sSettings.restorativeCategory.title}
                </h2>
                <p className="text-base text-[#565e74] mt-2">
                  {sSettings.restorativeCategory.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(sSettings.restorativeCategory.cards || []).map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center">
                          <AppIcon name={c.icon || 'healing'} className="text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#191c1e]">{c.title}</h3>
                          <span className="text-sm text-[#565e74]">{c.technique || c.duration}</span>
                        </div>
                      </div>
                      <p className="text-base text-[#565e74] mb-4 leading-relaxed">
                        {c.description}
                      </p>
                      {c.checklist && c.checklist.length > 0 && (
                        <ul className="space-y-2 mb-6 text-sm text-[#434655]">
                          {c.checklist.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-center gap-2">
                              <AppIcon name="check_circle" className="text-[#004ac6] text-base shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="pt-4 border-t border-[#c3c6d7]/20 flex items-center justify-between">
                      {c.badge && (
                        <span className="text-xs font-semibold text-[#00569c] bg-[#d4e3ff]/30 px-3 py-1 rounded-full">
                          {c.badge}
                        </span>
                      )}
                      <a
                        href={`tel:${CLINIC_INFO.phone}`}
                        className="text-sm font-bold text-[#004ac6] hover:underline"
                      >
                        {c.ctaText || 'اطلاعات بیشتر'}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Promo Card */}
                {sSettings.restorativeCategory.promoCard?.enabled !== false && (
                  <div className="bg-gradient-to-br from-[#2563eb] to-[#004ac6] p-6 rounded-2xl text-white flex flex-col justify-between shadow-md">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-4">
                        <AppIcon
                          name={sSettings.restorativeCategory.promoCard.badgeIcon || 'alarm'}
                          className="text-sm"
                        />
                        <span>{sSettings.restorativeCategory.promoCard.badge}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">
                        {sSettings.restorativeCategory.promoCard.title}
                      </h3>
                      <p className="text-base opacity-90 leading-relaxed mb-6">
                        {sSettings.restorativeCategory.promoCard.description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <a
                        href={`tel:${sSettings.restorativeCategory.promoCard.phone || CLINIC_INFO.phone}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-[#004ac6] font-bold text-sm shadow-md hover:bg-[#f2f4f6] transition-colors"
                      >
                        <AppIcon name="phone_in_talk" />
                        <span>
                          {sSettings.restorativeCategory.promoCard.buttonText}:{' '}
                          {sSettings.restorativeCategory.promoCard.phone || CLINIC_INFO.phoneCompact}
                        </span>
                      </a>
                      <p className="text-center text-sm opacity-80">
                        {sSettings.restorativeCategory.promoCard.locationText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 3: ایمپلنت و کاشت دیجیتال */}
        {sSettings.implant?.enabled !== false && (
          <section className="py-16 bg-white relative overflow-hidden" id="implant">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-[#f2f4f6]/70 rounded-3xl p-8 lg:p-12 border border-[#c3c6d7]/30 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-semibold mb-4">
                      <AppIcon name={sSettings.implant.badgeIcon || 'stars'} className="text-base" />
                      <span>{sSettings.implant.badge}</span>
                    </div>
                    <h2 className="text-[2.25rem] text-[#191c1e] font-bold mb-4 leading-[1.25]">
                      {sSettings.implant.title}
                    </h2>
                    <p className="text-[1.125rem] text-[#565e74] leading-relaxed mb-6">
                      {sSettings.implant.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {(sSettings.implant.features || []).map((feat) => (
                        <div
                          key={feat.id}
                          className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-[#c3c6d7]/20"
                        >
                          <AppIcon
                            name={feat.icon || 'task_alt'}
                            className="text-[#004ac6] text-2xl shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-[#191c1e]">{feat.title}</h4>
                            {feat.subtitle && (
                              <p className="text-sm text-[#565e74]">{feat.subtitle}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={`tel:${sSettings.implant.buttonPhone || CLINIC_INFO.phone}`}
                        className="px-6 py-3 rounded-full bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
                      >
                        <AppIcon name="call" />
                        <span>{sSettings.implant.buttonText}</span>
                      </a>
                      <span className="text-sm text-[#565e74]">
                        {sSettings.implant.paymentNote}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
                      {isVideoUrl(sSettings.implant.surgeryImage) ? (
                        <video
                          className="w-full h-96 object-cover"
                          src={sSettings.implant.surgeryImage}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          className="w-full h-96 object-cover"
                          alt={sSettings.implant.surgeryImageAlt}
                          src={sSettings.implant.surgeryImage}
                        />
                      )}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#c3c6d7]/30 text-[#191c1e]">
                        <p className="text-sm font-bold">{sSettings.implant.surgeryImageTitle}</p>
                        <p className="text-sm text-[#565e74]">{sSettings.implant.surgeryImageSubtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: فرآیند ۴ مرحله‌ای درمان */}
        {sSettings.journey?.enabled !== false && (
          <section className="py-16 bg-[#f7f9fb]" id="journey">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-semibold mb-3">
                  <AppIcon name={sSettings.journey.badgeIcon || 'route'} className="text-base" />
                  <span>{sSettings.journey.badge}</span>
                </div>
                <h2 className="text-[2.25rem] text-[#191c1e] font-bold leading-[1.25]">
                  {sSettings.journey.title}
                </h2>
                <p className="text-base text-[#565e74] mt-2">
                  {sSettings.journey.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {(sSettings.journey.steps || []).map((st, sIdx) => (
                  <div
                    key={st.id || sIdx}
                    className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 relative flex flex-col hover:-translate-y-1 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#004ac6] text-white text-xl font-bold flex items-center justify-center mb-4">
                      {st.stepNumber || `${sIdx + 1}`}
                    </div>
                    <h3 className="text-xl font-bold text-[#191c1e] mb-2">{st.title}</h3>
                    <p className="text-sm text-[#565e74] leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: سوالات متداول مراجعین */}
        {sSettings.faqs?.enabled !== false && (
          <section className="py-16 bg-[#f7f9fb]" id="faq">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-semibold mb-3">
                  <AppIcon name={sSettings.faqs.badgeIcon || 'help'} className="text-base" />
                  <span>{sSettings.faqs.badge}</span>
                </div>
                <h2 className="text-[2.25rem] text-[#191c1e] font-bold leading-[1.25]">
                  {sSettings.faqs.title}
                </h2>
                <p className="text-base text-[#565e74] mt-2">
                  {sSettings.faqs.description}
                </p>
              </div>

              <div className="space-y-4">
                {currentFaqs.map((faq, idx) => {
                  const isOpen = openDesktopFaq === idx;
                  return (
                    <div
                      key={faq.id || idx}
                      className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/30 shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDesktopFaq(isOpen ? null : idx)}
                        className="w-full text-xl font-bold text-[#191c1e] flex items-center justify-between cursor-pointer text-right"
                      >
                        <span>{faq.q}</span>
                        <AppIcon
                          name="expand_more"
                          className={`text-[#004ac6] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="text-base text-[#565e74] mt-3 leading-relaxed">{faq.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Section 6: بنر نهایی فراخوان نوبت‌دهی */}
        {sSettings.cta?.enabled !== false && (
          <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#196fc0] rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4">
                    <AppIcon name={sSettings.cta.badgeIcon || 'location_on'} className="text-sm" />
                    <span>{sSettings.cta.badge}</span>
                  </div>
                  <h2 className="text-[2.25rem] font-extrabold mb-3 leading-tight">
                    {sSettings.cta.title}
                  </h2>
                  <p className="text-[1.125rem] opacity-90 leading-relaxed">
                    {sSettings.cta.description}
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 shrink-0">
                  <a
                    href={`tel:${sSettings.cta.phone || CLINIC_INFO.phone2}`}
                    className="px-8 py-4 rounded-full bg-white hover:bg-[#f2f4f6] text-[#004ac6] text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    <AppIcon name="call" className="text-2xl" />
                    <span>
                      {sSettings.cta.buttonText}: {sSettings.cta.phoneDisplay || sSettings.cta.phone || CLINIC_INFO.phoneCompact2}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
