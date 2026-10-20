import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ValueProps } from './components/ValueProps.tsx';
import { AdvancedCare } from './components/AdvancedCare.tsx';
import { SmileTransformations } from './components/SmileTransformations.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { CostCalculatorSection } from './components/CostCalculatorSection.tsx';
import { DoctorSection } from './components/DoctorSection.tsx';
import { ArticlesSection } from './components/ArticlesSection.tsx';
import { FaqAndContact } from './components/FaqAndContact.tsx';
import { CtaBanner } from './components/CtaBanner.tsx';
import { Footer } from './components/Footer.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { AiAssistantModal } from './components/AiAssistantModal.tsx';
import { AiChatFloatingButton } from './components/AiChatFloatingButton.tsx';
import { DentalMotionGuide, DentalEyeGuideDivider } from './components/DentalMotionGuide.tsx';
import { useCMS } from './context/CMSContext.tsx';
import { CLINIC_INFO } from './data/clinicData.ts';

// Lazy load non-critical and heavy subpages to drastically reduce initial bundle size and boost Core Web Vitals (LCP & FCP)
const AdminPanel = lazy(() => import('./components/AdminPanel.tsx').then((m) => ({ default: m.AdminPanel })));
const ServicesPage = lazy(() => import('./components/ServicesPage.tsx').then((m) => ({ default: m.ServicesPage })));
const AboutPage = lazy(() => import('./components/AboutPage.tsx').then((m) => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('./components/BlogPage.tsx').then((m) => ({ default: m.BlogPage })));
const ArticleDetailPage = lazy(() => import('./components/ArticleDetailPage.tsx').then((m) => ({ default: m.ArticleDetailPage })));
const SmileGalleryPage = lazy(() => import('./components/SmileGalleryPage.tsx').then((m) => ({ default: m.SmileGalleryPage })));
const ContactPage = lazy(() => import('./components/ContactPage.tsx').then((m) => ({ default: m.ContactPage })));

// Loading spinner fallback for lazy components
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3" dir="rtl">
    <div className="w-10 h-10 border-4 border-[#004ac6]/20 border-t-[#004ac6] rounded-full animate-spin"></div>
    <span className="text-xs font-semibold text-slate-500">در حال بارگذاری محتوا...</span>
  </div>
);

type ActivePage = 'home' | 'services' | 'about' | 'blog' | 'article' | 'gallery' | 'contact' | 'admin';

const getPageFromUrl = (): { page: ActivePage; articleId?: string } => {
  if (typeof window === 'undefined') return { page: 'home' };
  const pathname = window.location.pathname;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return { page: 'admin' };
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');
  const validPages: ActivePage[] = ['home', 'services', 'about', 'blog', 'article', 'gallery', 'contact', 'admin'];
  const page = (pageParam && validPages.includes(pageParam as ActivePage)) ? (pageParam as ActivePage) : 'home';
  const articleId = params.get('id') || params.get('articleId') || undefined;
  return { page, articleId };
};

const buildPageUrl = (page: ActivePage, articleId?: string): string => {
  const url = new URL(window.location.href);
  url.hash = ''; // Clear hash anchor on page navigation
  if (page === 'services') {
    url.searchParams.set('page', 'services');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'about') {
    url.searchParams.set('page', 'about');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'blog') {
    url.searchParams.set('page', 'blog');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'article') {
    url.searchParams.set('page', 'article');
    if (articleId) url.searchParams.set('id', articleId);
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'gallery') {
    url.searchParams.set('page', 'gallery');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'contact') {
    url.searchParams.set('page', 'contact');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  } else if (page === 'admin') {
    url.searchParams.set('page', 'admin');
    url.searchParams.delete('id');
    const savedTab = localStorage.getItem('parmis_admin_active_tab');
    if (savedTab && !url.searchParams.has('tab')) {
      url.searchParams.set('tab', savedTab);
    }
  } else {
    url.searchParams.delete('page');
    url.searchParams.delete('id');
    url.searchParams.delete('tab');
    url.searchParams.delete('filter');
  }
  return url.toString();
};

export default function App() {
  const { articles, clinicInfo, siteSettings, refreshCMS, homeSettings } = useCMS();
  const [activePage, setActivePage] = useState<ActivePage>(() => getPageFromUrl().page);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    () => getPageFromUrl().articleId || 'featured-composite-vs-laminate'
  );
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Centralized Navigation with Browser History (PushState)
  const navigateTo = (page: ActivePage, articleId?: string, isReplace = false) => {
    const artId = articleId || selectedArticleId;
    const targetUrl = buildPageUrl(page, page === 'article' ? artId : undefined);
    const currentUrl = window.location.href;

    if (targetUrl !== currentUrl) {
      if (isReplace) {
        window.history.replaceState({ page, articleId: artId }, '', targetUrl);
      } else {
        window.history.pushState({ page, articleId: artId }, '', targetUrl);
      }
    }

    setActivePage(page);
    if (articleId) {
      setSelectedArticleId(articleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser Back / Forward Button Handler (PopState)
  useEffect(() => {
    // Set initial state on current entry so back/forward knows initial state
    const initial = getPageFromUrl();
    window.history.replaceState(
      { page: initial.page, articleId: initial.articleId || selectedArticleId },
      '',
      window.location.href
    );

    const handlePopState = () => {
      const { page, articleId } = getPageFromUrl();
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      setActivePage(page);
      if (articleId) {
        setSelectedArticleId(articleId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure latest CMS data is refreshed whenever navigating between pages
  useEffect(() => {
    refreshCMS();
  }, [activePage]);

  // Dynamic Client-Side Technical SEO
  useEffect(() => {
    let pageTitle = siteSettings?.title || 'کلینیک دندان‌پزشکی پارمیس | دکتر انوشیروان شمس پور';
    let metaDesc = siteSettings?.metaDescription || 'کلینیک دندان‌پزشکی پارمیس در پاکدشت با مدیریت دکتر انوشیروان شمس پور؛ ارائه دهنده خدمات تخصصی ایمپلنت، کامپوزیت و لمینت.';

    if (activePage === 'services') {
      pageTitle = `خدمات تخصصی دندان‌پزشکی | ${clinicInfo.name}`;
      metaDesc = 'ارائه کلیه خدمات تخصصی ایمپلنت دیجیتال، کامپوزیت ونیر، لمینت سرامیکی و عصب‌کشی در پاکدشت.';
    } else if (activePage === 'about') {
      pageTitle = `درباره کلینیک و ${clinicInfo.doctorName} | ${clinicInfo.name}`;
      metaDesc = 'آشنایی با دکتر انوشیروان شمس پور، سوابق بالینی درخشان و تجهیزات استریلیزاسیون پیشرفته کلینیک پارمیس.';
    } else if (activePage === 'gallery') {
      pageTitle = `گالری لبخند و نمونه درمان‌های قبل و بعد | ${clinicInfo.name}`;
      metaDesc = 'مشاهده تصاویر قبل و بعد درمان‌های زیبایی، اصلاح طرح لبخند و کامپوزیت در کلینیک پارمیس.';
    } else if (activePage === 'blog') {
      pageTitle = `مجله سلامت و مقالات دندان‌پزشکی | ${clinicInfo.name}`;
      metaDesc = 'آرشیو مقالات علمی، آموزش بهداشت دهان و دندان و راهنمای جامع مراقبت‌های دندانپزشکی.';
    } else if (activePage === 'article') {
      const currentArt = articles.find((a: any) => a.id === selectedArticleId || a.slug === selectedArticleId);
      if (currentArt) {
        pageTitle = currentArt.metaTitle || `${currentArt.title} | ${clinicInfo.name}`;
        metaDesc = currentArt.metaDescription || currentArt.summary || currentArt.mobileSummary || metaDesc;
      }
    } else if (activePage === 'contact') {
      pageTitle = `تماس با ما، نشانی و ساعات کاری | ${clinicInfo.name}`;
      metaDesc = 'آدرس کلینیک در مجتمع راستین پاکدشت، ساعات کاری روزانه و شماره تماس جهت مشاوره و نوبت‌دهی.';
    } else if (activePage === 'admin') {
      pageTitle = `پنل مدیریت محتوا | ${clinicInfo.name}`;
    }

    document.title = pageTitle;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', metaDesc);
  }, [activePage, selectedArticleId, articles, clinicInfo, siteSettings]);

  const handleOpenBooking = (serviceId?: string) => {
    setBookingServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleSelectArticle = (artId: string) => {
    navigateTo('article', artId);
  };

  if (activePage === 'admin') {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminPanel
          onNavigateHome={() => navigateTo('home')}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans selection:bg-[#dbe1ff] selection:text-[#004ac6]">
      {/* Interactive Scroll-Linked Dental Eye-Guide & Progress System */}
      <DentalMotionGuide activePage={activePage} />

      {/* Top Header / App Bar */}
      <Navbar
        activePage={activePage}
        onSelectPage={(page) => navigateTo(page)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenCostCalculator={() => setIsCostModalOpen(true)}
      />

      {/* Dynamic Subpages (Lazy Loaded with Suspense for Maximum Performance & Instant LCP) */}
      <Suspense fallback={<PageLoader />}>
        {activePage === 'home' ? (
        <main className="flex-grow">
          {(() => {
            const motionDividers = (homeSettings?.motionGuides as any)?.dividers || {};
            return (
              <>
                {/* 1. Hero Section */}
                {homeSettings?.hero?.enabled !== false && (
                  <Hero
                    onOpenBooking={() => handleOpenBooking()}
                    onNavigateServices={() => navigateTo('services')}
                  />
                )}

                {/* 2. Quick Value Propositions Bar */}
                {homeSettings?.valueProps?.enabled !== false && <ValueProps />}

                {homeSettings?.motionGuides?.enabled !== false && homeSettings?.advancedCare?.enabled !== false && (
                  <DentalEyeGuideDivider
                    label={motionDividers.advancedCare?.label || 'تکنولوژی و تجهیزات استریل'}
                    icon={motionDividers.advancedCare?.icon || 'biotech'}
                  />
                )}

                {/* 3. Advanced Care & Technologies */}
                {homeSettings?.advancedCare?.enabled !== false && (
                  <AdvancedCare onOpenBooking={() => handleOpenBooking()} />
                )}

                {homeSettings?.motionGuides?.enabled !== false && homeSettings?.transformations?.enabled !== false && (
                  <DentalEyeGuideDivider
                    label={motionDividers.transformations?.label || 'نمونه درمان‌های قبل و بعد'}
                    icon={motionDividers.transformations?.icon || 'auto_awesome'}
                  />
                )}

                {/* 4. Smile Transformations (Before / After) */}
                {homeSettings?.transformations?.enabled !== false && (
                  <SmileTransformations
                    onOpenBooking={() => handleOpenBooking('cosmetic-composite')}
                    onNavigateGallery={() => navigateTo('gallery')}
                  />
                )}

                {homeSettings?.motionGuides?.enabled !== false && homeSettings?.services?.enabled !== false && (
                  <DentalEyeGuideDivider
                    label={motionDividers.services?.label || 'خدمات تخصصی دندان‌پزشکی'}
                    icon={motionDividers.services?.icon || 'dentistry'}
                  />
                )}

                {/* 5. Complete Services Grid */}
                {homeSettings?.services?.enabled !== false && (
                  <ServicesSection onOpenBooking={(sId) => handleOpenBooking(sId)} />
                )}

                {homeSettings?.motionGuides?.enabled !== false && homeSettings?.doctor?.enabled !== false && (
                  <DentalEyeGuideDivider
                    label={motionDividers.doctor?.label || 'آشنایی با دکتر انوشیروان شمس پور'}
                    icon={motionDividers.doctor?.icon || 'verified_user'}
                  />
                )}

                {/* 6. Doctor & Clinic Introduction */}
                {homeSettings?.doctor?.enabled !== false && (
                  <DoctorSection onOpenBooking={() => handleOpenBooking()} />
                )}

                {homeSettings?.motionGuides?.enabled !== false && homeSettings?.articles?.enabled !== false && (
                  <DentalEyeGuideDivider
                    label={motionDividers.articles?.label || 'مجله آموزشی سلامت دهان'}
                    icon={motionDividers.articles?.icon || 'menu_book'}
                  />
                )}

                {/* 7. Educational Articles / Oral Health Blog */}
                {homeSettings?.articles?.enabled !== false && (
                  <ArticlesSection
                    onNavigateBlog={() => navigateTo('blog')}
                    onSelectArticle={handleSelectArticle}
                    onOpenBooking={(sId) => handleOpenBooking(sId)}
                  />
                )}

                {homeSettings?.motionGuides?.enabled !== false &&
                  (homeSettings?.faqAndContact?.faqEnabled !== false || homeSettings?.faqAndContact?.contactEnabled !== false) && (
                    <DentalEyeGuideDivider
                      label={motionDividers.faq?.label || 'پرسش‌های متداول و آدرس مطب'}
                      icon={motionDividers.faq?.icon || 'location_on'}
                    />
                  )}
              </>
            );
          })()}

          {/* 8 & 9. FAQs & Clinic Location / Routing */}
          {(homeSettings?.faqAndContact?.faqEnabled !== false || homeSettings?.faqAndContact?.contactEnabled !== false) && (
            <FaqAndContact />
          )}

          {/* 10. Call to Action Banner */}
          {homeSettings?.cta?.enabled !== false && (
            <CtaBanner onOpenBooking={() => handleOpenBooking()} />
          )}
        </main>
      ) : activePage === 'services' ? (
        <main className="flex-grow">
          <ServicesPage
            onOpenBooking={(sId) => handleOpenBooking(sId)}
            onNavigateHome={() => navigateTo('home')}
          />
        </main>
      ) : activePage === 'about' ? (
        <main className="flex-grow">
          <AboutPage
            onOpenBooking={(sId) => handleOpenBooking(sId)}
            onNavigateServices={() => navigateTo('services')}
          />
        </main>
      ) : activePage === 'article' ? (
        <main className="flex-grow">
          <ArticleDetailPage
            articleId={selectedArticleId}
            onNavigateHome={() => navigateTo('home')}
            onNavigateBlog={() => navigateTo('blog')}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateContact={() => navigateTo('contact')}
            onSelectArticle={handleSelectArticle}
            onOpenBooking={(sId) => handleOpenBooking(sId)}
          />
        </main>
      ) : activePage === 'gallery' ? (
        <main className="flex-grow">
          <SmileGalleryPage
            onOpenBooking={(sId) => handleOpenBooking(sId)}
            onNavigateHome={() => navigateTo('home')}
            onNavigateServices={() => navigateTo('services')}
            onNavigateBlog={() => navigateTo('blog')}
          />
        </main>
      ) : activePage === 'contact' ? (
        <main className="flex-grow">
          <ContactPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateServices={() => navigateTo('services')}
            onNavigateGallery={() => navigateTo('gallery')}
            onNavigateBlog={() => navigateTo('blog')}
          />
        </main>
      ) : (
        <main className="flex-grow">
          <BlogPage
            onOpenBooking={() => handleOpenBooking()}
            onNavigateHome={() => navigateTo('home')}
            onSelectArticle={handleSelectArticle}
          />
        </main>
      )}
      </Suspense>

      {/* Footer */}
      <Footer onSelectPage={(page) => navigateTo(page)} />

      {/* Interactive Treatment Cost Estimator Modal */}
      <CostCalculatorSection
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Online Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedServiceId={bookingServiceId}
      />

      {/* Floating AI Robot Chat Button */}
      <AiChatFloatingButton
        isOpen={isAiChatOpen}
        onClick={() => setIsAiChatOpen(true)}
      />

      {/* Intelligent AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onNavigatePage={(page) => navigateTo(page)}
        onOpenBooking={(serviceId) => handleOpenBooking(serviceId)}
        onOpenCostCalculator={() => setIsCostModalOpen(true)}
      />
    </div>
  );
}
