import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { useCMS, defaultContactPageSettings } from '../context/CMSContext.tsx';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateServices?: () => void;
  onNavigateGallery?: () => void;
  onNavigateBlog?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { siteImages, clinicInfo, contactPageSettings } = useCMS();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const settings = contactPageSettings || defaultContactPageSettings;
  const heroSec = settings.hero || defaultContactPageSettings.hero;
  const quickCardsSec = settings.quickCards || defaultContactPageSettings.quickCards;
  const mapSec = settings.mapAndRouting || defaultContactPageSettings.mapAndRouting;
  const triageSec = settings.triageAndBooking || defaultContactPageSettings.triageAndBooking;
  const commutersSec = settings.commuters || defaultContactPageSettings.commuters;
  const faqsSec = settings.faqs || defaultContactPageSettings.faqs;
  const ctaSec = settings.cta || defaultContactPageSettings.cta;

  // Active doctor name & brand
  const doctorName = clinicInfo?.doctorName || CLINIC_INFO.doctorName;
  const doctorTitle = clinicInfo?.doctorTitleBrand || CLINIC_INFO.doctorTitleBrand;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen selection:bg-[#dbe1ff] selection:text-[#004ac6] text-right">
      {/* ================= 1. HERO HEADER SECTION ================= */}
      {heroSec.enabled !== false && (
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-[#004ac6]/10 via-[#f7f9fb] to-[#f7f9fb]">
          {/* Ambient background glow */}
          <div className="absolute -top-20 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#004ac6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-16 w-72 h-72 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Eyebrow Badge */}
              {heroSec.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dae2fd]/70 text-[#004ac6] text-xs font-bold shadow-xs border border-[#004ac6]/15">
                  <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
                  <span>{heroSec.badge}</span>
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#191c1e] leading-tight tracking-tight">
                {heroSec.title || 'تماس با ما و دسترسی حضوری به'} <br className="hidden sm:inline" />
                <span className="text-[#004ac6]">{heroSec.titleHighlight || 'کلینیک دندان‌پزشکی پارمیس'}</span>
              </h1>

              {/* Subtitle */}
              {heroSec.description && (
                <p className="text-xs sm:text-base text-[#565e74] leading-relaxed max-w-2xl mx-auto text-justify sm:text-center">
                  {heroSec.description}
                </p>
              )}

              {/* Clinic Amenities Strip */}
              {heroSec.amenities && heroSec.amenities.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 py-1 text-xs font-semibold text-[#565e74]">
                  {heroSec.amenities.map((item) => (
                    <span
                      key={item.id}
                      className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-[#c3c6d7]/40 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#004ac6]">{item.icon || 'verified'}</span>
                      <span>{item.text}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ================= 2. 4 RAPID ACCESS INFO CARDS (Bento Grid) ================= */}
            {quickCardsSec.enabled !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 sm:mt-12">
                {/* Card 1: Address */}
                {quickCardsSec.addressCard?.enabled !== false && (
                  <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-[#c3c6d7]/30 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">location_on</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2">
                        {quickCardsSec.addressCard.title || 'نشانی دقیق مطب'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
                        {quickCardsSec.addressCard.text || clinicInfo?.address || CLINIC_INFO.address}
                      </p>
                    </div>
                    {quickCardsSec.addressCard.footerText && (
                      <div className="mt-4 pt-3 border-t border-[#f2f4f6] text-xs text-[#004ac6] font-bold flex items-center justify-between">
                        <span>{quickCardsSec.addressCard.footerText}</span>
                        <span className="material-symbols-outlined text-sm">
                          {quickCardsSec.addressCard.footerIcon || 'elevator'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card 2: Direct Phone & WhatsApp */}
                {quickCardsSec.phoneCard?.enabled !== false && (
                  <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-[#c3c6d7]/30 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#004ac6] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2">
                        {quickCardsSec.phoneCard.title || 'تلفن و پیام‌رسان'}
                      </h3>
                      <p className="text-xs text-[#565e74] mb-3 leading-relaxed">
                        {quickCardsSec.phoneCard.description || 'خط ویژه پذیرش، هماهنگی نوبت و مشاوره رایگان درمان:'}
                      </p>
                      <div className="space-y-1.5 font-bold dir-ltr text-right">
                        <a
                          className="text-[#004ac6] hover:text-[#003896] text-base sm:text-lg block transition-colors tracking-wide"
                          href={`tel:${quickCardsSec.phoneCard.phone1 || clinicInfo?.phone || CLINIC_INFO.phone}`}
                        >
                          {quickCardsSec.phoneCard.phone1Display || clinicInfo?.phoneDisplay || CLINIC_INFO.phoneDisplay}
                        </a>
                        <a
                          className="text-[#004ac6] hover:text-[#003896] text-base sm:text-lg block transition-colors tracking-wide"
                          href={`tel:${quickCardsSec.phoneCard.phone2 || clinicInfo?.phone2 || CLINIC_INFO.phone2}`}
                        >
                          {quickCardsSec.phoneCard.phone2Display || clinicInfo?.phoneDisplay2 || CLINIC_INFO.phoneDisplay2}
                        </a>
                        {quickCardsSec.phoneCard.whatsappPhone && (
                          <a
                            className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm flex items-center justify-end gap-1.5"
                            href={`https://wa.me/${quickCardsSec.phoneCard.whatsappPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{quickCardsSec.phoneCard.whatsappDisplay || 'پشتیبانی واتساپ'}</span>
                            <span className="material-symbols-outlined text-base">chat</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#f2f4f6]">
                      <a
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#004ac6]/10 text-[#004ac6] hover:bg-[#004ac6] hover:text-white rounded-full text-xs font-bold transition-all active:scale-95"
                        href={`tel:${quickCardsSec.phoneCard.phone1 || clinicInfo?.phone || CLINIC_INFO.phone}`}
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        <span>{quickCardsSec.phoneCard.footerButtonText || 'برقراری تماس فوری تلفنی'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Card 3: Working Hours */}
                {quickCardsSec.hoursCard?.enabled !== false && (
                  <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-[#c3c6d7]/30 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#00569c]/10 text-[#00569c] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">schedule</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2">
                        {quickCardsSec.hoursCard.title || 'ساعات کاری و پذیرش'}
                      </h3>
                      <div className="text-xs text-[#565e74] space-y-2 mt-2">
                        {quickCardsSec.hoursCard.weekdayHours && quickCardsSec.hoursCard.weekdayHours === quickCardsSec.hoursCard.thursdayHours ? (
                          <div className="flex items-center justify-between">
                            <span>شنبه تا پنج‌شنبه:</span>
                            <span className="font-bold text-[#191c1e] dir-ltr">{quickCardsSec.hoursCard.weekdayHours}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span>شنبه تا چهارشنبه:</span>
                              <span className="font-bold text-[#191c1e] dir-ltr">{quickCardsSec.hoursCard.weekdayHours}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>پنج‌شنبه‌ها:</span>
                              <span className="font-bold text-[#191c1e] dir-ltr">{quickCardsSec.hoursCard.thursdayHours}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between text-[#ba1a1a] font-semibold">
                          <span>جمعه‌ها و تعطیلات:</span>
                          <span>{quickCardsSec.hoursCard.emergencyHours}</span>
                        </div>
                      </div>
                    </div>
                    {quickCardsSec.hoursCard.footerText && (
                      <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex items-center gap-1.5 text-xs text-[#565e74] font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{quickCardsSec.hoursCard.footerText}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card 4: Facilities & Parking */}
                {quickCardsSec.amenitiesCard?.enabled !== false && (
                  <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-[#c3c6d7]/30 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#565e74]/10 text-[#565e74] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">local_parking</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2">
                        {quickCardsSec.amenitiesCard.title || 'امکانات رفاهی و دسترسی'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
                        {quickCardsSec.amenitiesCard.text}
                      </p>
                    </div>
                    {quickCardsSec.amenitiesCard.footerText && (
                      <div className="mt-4 pt-3 border-t border-[#f2f4f6] text-xs text-[#565e74] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#004ac6] text-sm">verified</span>
                        <span>{quickCardsSec.amenitiesCard.footerText}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= 3. TWO-COLUMN WORKSPACE: MAP & PHONE TRIAGE ================= */}
      <section className="py-8 sm:py-12" id="routing-map">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* RIGHT COLUMN: Map & Routing Apps */}
            {mapSec.enabled !== false && (
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#c3c6d7]/30 shadow-xs overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <span className="text-xs font-bold text-[#004ac6] tracking-wider uppercase">
                        {mapSec.badge || 'موقعیت مکانی و ناوبری'}
                      </span>
                      <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e]">
                        {mapSec.title || 'نقشه و دسترسی به کلینیک پارمیس'}
                      </h2>
                    </div>
                    {mapSec.cityTag && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f2f4f6] text-[#565e74] text-xs rounded-full">
                        <span className="material-symbols-outlined text-xs">my_location</span>
                        <span>{mapSec.cityTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Map Mock Frame with Clinic Pin */}
                  <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden border border-[#c3c6d7]/30 bg-[#eceef0] group shadow-inner">
                    <img
                      src={mapSec.mapImage || siteImages.mapPreviewImage?.url || CLINIC_INFO.mapImage}
                      alt={siteImages.mapPreviewImage?.alt || 'نقشه هوایی و موقعیت کلینیک دندان‌پزشکی پارمیس در پاکدشت'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e]/60 via-transparent to-transparent pointer-events-none" />

                    {/* Animated Clinic Pin Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
                      <div className="animate-bounce mb-1">
                        <div className="bg-[#004ac6] text-white px-3.5 py-1.5 rounded-full shadow-xl text-xs font-bold flex items-center gap-1.5 border-2 border-white">
                          <span className="material-symbols-outlined text-sm">dentistry</span>
                          <span>{mapSec.mapPinTitle ? mapSec.mapPinTitle.replace('دکتر شمس پور', doctorTitle) : `دندان‌پزشکی پارمیس (${doctorTitle})`}</span>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-[#004ac6] rounded-full border-2 border-white shadow-md relative">
                        <span className="absolute -inset-1 rounded-full bg-[#004ac6]/40 animate-ping" />
                      </div>
                    </div>

                    {/* Bottom Map Info Tag */}
                    {(mapSec.mapBottomBadge || mapSec.mapBottomLocation) && (
                      <div className="absolute bottom-3 right-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-xs shadow-md">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#004ac6] text-lg">local_hospital</span>
                          <span className="font-bold text-[#191c1e]">{mapSec.mapBottomBadge}</span>
                        </div>
                        <span className="text-[#565e74]">{mapSec.mapBottomLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Navigation Apps Action Bar */}
                  <div className="mt-6">
                    <p className="text-xs font-bold text-[#565e74] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#004ac6]">directions</span>
                      <span>انتخاب مسیریاب جهت شروع هدایت ماهواره‌ای خودرو یا تاکسی:</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {/* Neshan */}
                      <a
                        href={mapSec.neshanUrl || clinicInfo?.neshanUrl || CLINIC_INFO.neshanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f2f4f6] hover:bg-[#dbe1ff]/50 hover:border-[#004ac6] text-[#191c1e] font-semibold text-xs transition-all border border-transparent shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">N</div>
                        <span>مسیریابی با نشان</span>
                      </a>
                      {/* Balad */}
                      <a
                        href={mapSec.baladUrl || clinicInfo?.baladUrl || CLINIC_INFO.baladUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f2f4f6] hover:bg-[#dbe1ff]/50 hover:border-[#004ac6] text-[#191c1e] font-semibold text-xs transition-all border border-transparent shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">B</div>
                        <span>مسیریابی با بلد</span>
                      </a>
                      {/* Google Maps */}
                      <a
                        href={mapSec.googleMapsUrl || clinicInfo?.googleMapsUrl || CLINIC_INFO.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f2f4f6] hover:bg-[#dbe1ff]/50 hover:border-[#004ac6] text-[#191c1e] font-semibold text-xs transition-all border border-transparent shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        <span className="material-symbols-outlined text-rose-500 text-base">pin_drop</span>
                        <span>Google Maps</span>
                      </a>
                      {/* Snapp / Tap30 Taxi */}
                      <a
                        href={mapSec.snappUrl || 'https://snapp.ir'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f2f4f6] hover:bg-emerald-50 hover:text-emerald-800 text-[#191c1e] font-semibold text-xs transition-all border border-transparent shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        <span className="material-symbols-outlined text-emerald-600 text-base">local_taxi</span>
                        <span>اسنپ / تپسی</span>
                      </a>
                    </div>
                  </div>

                  {/* Driving & Transit Guidance */}
                  <div className="mt-6 pt-5 border-t border-[#f2f4f6] space-y-3">
                    <h4 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#004ac6] text-base">alt_route</span>
                      <span>{mapSec.drivingGuideTitle || 'راهنمای دسترسی از تهران و مناطق اطراف:'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#565e74] leading-relaxed">
                      <div className="p-3.5 rounded-2xl bg-[#f2f4f6]/60 border border-[#c3c6d7]/20">
                        <strong className="text-[#191c1e] block mb-1">{mapSec.carGuideTitle || 'مسیر خودرو شخصی از تهران (افسریه):'}</strong>
                        {mapSec.carGuideText}
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#f2f4f6]/60 border border-[#c3c6d7]/20">
                        <strong className="text-[#191c1e] block mb-1">{mapSec.transitGuideTitle || 'مسیر با وسایل حمل‌ونقل عمومی:'}</strong>
                        {mapSec.transitGuideText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Accreditation Banner */}
                {mapSec.doctorBadgeEnabled !== false && (
                  <div className="bg-gradient-to-l from-[#004ac6]/10 via-white to-white p-5 rounded-3xl border border-[#c3c6d7]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#004ac6] font-bold text-lg shrink-0">
                        <span className="material-symbols-outlined">verified_user</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#191c1e]">{doctorName}</h4>
                        <p className="text-xs text-[#565e74] mt-0.5">
                          {mapSec.doctorBadgeSubtitle || 'عضو نظام پزشکی • ارائه‌دهنده پیشرفته‌ترین درمان‌های ایمپلنت و زیبایی در پاکدشت'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${triageSec.phone1 || clinicInfo?.phone || CLINIC_INFO.phone}`}
                      className="px-5 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003896] text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>{mapSec.doctorBadgeButtonText || 'تماس جهت هماهنگی'}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* LEFT COLUMN: Direct Phone Triage & Booking Guidance */}
            {triageSec.enabled !== false && (
              <div className="lg:col-span-5">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#004ac6]/20 shadow-md relative overflow-hidden">
                  {/* Floating Accent Badge */}
                  {triageSec.badge && (
                    <div className="inline-flex items-center gap-1.5 bg-[#004ac6] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm mb-4">
                      <span className="material-symbols-outlined text-sm">support_agent</span>
                      <span>{triageSec.badge}</span>
                    </div>
                  )}

                  <div className="mb-6 space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#191c1e]">
                      {triageSec.title || 'راهنمای دریافت نوبت معاینه و ویزیت'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed text-justify">
                      {triageSec.description}
                    </p>
                  </div>

                  {/* Primary Fast Call Action */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#004ac6]/5 border border-[#004ac6]/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#004ac6]">{triageSec.phoneBoxTitle || 'شماره‌های تماس مستقیم پذیرش مطب:'}</span>
                        {triageSec.statusBadgeText && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{triageSec.statusBadgeText}</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <a
                          href={`tel:${triageSec.phone1 || clinicInfo?.phone || CLINIC_INFO.phone}`}
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#004ac6] hover:bg-[#003896] text-white font-black text-base sm:text-lg shadow-md shadow-[#004ac6]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-2xl">call</span>
                          <span className="tracking-wider">{triageSec.phone1Display || clinicInfo?.phoneDisplay || CLINIC_INFO.phoneDisplay}</span>
                        </a>
                        <a
                          href={`tel:${triageSec.phone2 || clinicInfo?.phone2 || CLINIC_INFO.phone2}`}
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#004ac6] hover:bg-[#003896] text-white font-black text-base sm:text-lg shadow-md shadow-[#004ac6]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-2xl">call</span>
                          <span className="tracking-wider">{triageSec.phone2Display || clinicInfo?.phoneDisplay2 || CLINIC_INFO.phoneDisplay2}</span>
                        </a>
                      </div>

                      {triageSec.hoursNotice && (
                        <p className="text-[11px] text-[#565e74] text-center">
                          {triageSec.hoursNotice}
                        </p>
                      )}
                    </div>

                    {/* WhatsApp Consult Action */}
                    {triageSec.whatsappEnabled !== false && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <span className="material-symbols-outlined text-xl">chat</span>
                          <h4 className="text-xs sm:text-sm font-bold">{triageSec.whatsappTitle || 'ارسال عکس دندان و مشاوره در واتساپ'}</h4>
                        </div>

                        <p className="text-xs text-emerald-700 leading-relaxed text-justify">
                          {triageSec.whatsappDescription}
                        </p>

                        <a
                          href={`https://wa.me/${triageSec.whatsappPhone || (clinicInfo as any)?.whatsappPhone || '989215395923'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                        >
                          <span className="material-symbols-outlined text-base">send</span>
                          <span>{triageSec.whatsappButtonText || 'ارسال پیام به واتساپ کلینیک'}</span>
                        </a>
                      </div>
                    )}

                    {/* Emergency Triage Notice */}
                    {triageSec.emergencyEnabled !== false && (
                      <div className="p-3.5 rounded-2xl bg-[#fff2f2] border border-[#ffdad6] text-right flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0 mt-0.5">
                          emergency
                        </span>
                        <div className="text-xs">
                          <strong className="text-[#ba1a1a] block font-bold mb-0.5">
                            {triageSec.emergencyTitle || 'موارد اورژانسی و دندان‌درد حاد:'}
                          </strong>
                          <span className="text-[#434655] leading-relaxed">
                            {triageSec.emergencyDescription}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {triageSec.trustBadgeText && (
                    <div className="mt-5 pt-4 border-t border-[#f2f4f6] flex items-center justify-center gap-2 text-[11px] text-[#565e74]">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                      <span>{triageSec.trustBadgeText}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. SPECIAL CARE FOR COMMUTERS ================= */}
      {commutersSec.enabled !== false && (
        <section className="py-12 bg-white border-y border-[#c3c6d7]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              {commutersSec.badge && <span className="text-xs font-bold text-[#004ac6]">{commutersSec.badge}</span>}
              <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mt-1">
                {commutersSec.title}
              </h2>
              {commutersSec.description && (
                <p className="text-xs sm:text-sm text-[#565e74] mt-1">
                  {commutersSec.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {commutersSec.cards?.map((card) => (
                <div
                  key={card.id}
                  className="bg-[#f7f9fb] p-5 sm:p-6 rounded-3xl border border-[#c3c6d7]/30 flex items-start gap-4 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{card.icon || 'verified'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#191c1e] mb-1">{card.title}</h3>
                    <p className="text-xs text-[#565e74] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 5. CLINIC FAQ ACCORDION SECTION ================= */}
      {faqsSec.enabled !== false && faqsSec.items && faqsSec.items.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              {faqsSec.badge && <span className="text-[#004ac6] font-bold text-xs">{faqsSec.badge}</span>}
              <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mt-1">
                {faqsSec.title}
              </h2>
            </div>

            <div className="space-y-3">
              {faqsSec.items.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.id || index}
                    className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-right font-bold text-xs sm:text-sm text-[#191c1e] cursor-pointer hover:bg-[#f7f9fb]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#004ac6] text-base">help_outline</span>
                        <span>{faq.q}</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-[#004ac6] text-lg transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-[#565e74] border-t border-[#f2f4f6] leading-relaxed text-justify">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= 6. EMERGENCY CALLOUT BANNER ================= */}
      {ctaSec.enabled !== false && (
        <section className="py-8 bg-gradient-to-l from-[#004ac6] to-[#2563eb] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-right">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">support_agent</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold">{ctaSec.title}</h3>
                  <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                    {ctaSec.description}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${ctaSec.phone || clinicInfo?.phone2 || CLINIC_INFO.phone2}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#004ac6] px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm hover:bg-[#f2f4f6] transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>{ctaSec.buttonText || 'تماس مستقیم'}: {ctaSec.phoneDisplay || clinicInfo?.phoneDisplay2 || CLINIC_INFO.phoneDisplay2}</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
