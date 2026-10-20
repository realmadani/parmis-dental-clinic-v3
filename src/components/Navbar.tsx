import React, { useState, useRef, useEffect } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { useCMS, HeaderMenuItem } from '../context/CMSContext.tsx';

interface NavbarProps {
  activePage: 'home' | 'services' | 'about' | 'blog' | 'article' | 'gallery' | 'contact';
  onSelectPage: (page: 'home' | 'services' | 'about' | 'blog' | 'article' | 'gallery' | 'contact') => void;
  onOpenBooking?: (preselectedService?: string) => void;
  onOpenCostCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  onOpenBooking,
  onOpenCostCalculator,
}) => {
  const { siteImages, clinicInfo, headerSettings } = useCMS();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fallbacks for header settings
  const announcementSettings = headerSettings?.announcement;
  const brandSettings = headerSettings?.brand;
  const contactSettings = headerSettings?.contact;
  const navSettings = headerSettings?.navigation;

  // Active navigation items sorted by order
  const activeNavItems = (navSettings?.items || [])
    .filter((item) => item.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Coordinates of the hamburger button / touch point relative to the right-aligned drawer
  const [dropOrigin, setDropOrigin] = useState<{ x: string; y: string }>({
    x: 'calc(100% - 28px)',
    y: '28px',
  });
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const computeHamburgerOrigin = (clientX?: number, clientY?: number) => {
    const drawerWidth = drawerRef.current?.offsetWidth || Math.min(320, window.innerWidth * 0.85);
    const drawerLeft = window.innerWidth - drawerWidth;

    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      const centerX = clientX ?? rect.left + rect.width / 2;
      const centerY = clientY ?? rect.top + rect.height / 2;
      const localX = Math.max(0, Math.min(drawerWidth, centerX - drawerLeft));
      const localY = Math.max(0, centerY);
      setDropOrigin({ x: `${Math.round(localX)}px`, y: `${Math.round(localY)}px` });
    }
  };

  const handleOpenDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    computeHamburgerOrigin(
      e.clientX || undefined,
      e.clientY || undefined
    );
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    computeHamburgerOrigin();
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleNavClick = (page: 'home' | 'services' | 'about' | 'blog' | 'article' | 'gallery' | 'contact', hash?: string) => {
    handleCloseDrawer();
    onSelectPage(page);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuItemClick = (item: HeaderMenuItem) => {
    handleCloseDrawer();
    if (item.page === 'custom') {
      if (item.url) {
        if (item.url.startsWith('#')) {
          const el = document.querySelector(item.url);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
          window.open(item.url, '_blank');
        } else {
          window.location.href = item.url;
        }
      }
    } else {
      onSelectPage(item.page);
      if (item.url && item.url.startsWith('#')) {
        setTimeout(() => {
          const el = document.querySelector(item.url!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleCallActionClick = () => {
    if (contactSettings?.actionType === 'direct_phone') {
      window.location.href = `tel:${contactSettings.phone || CLINIC_INFO.phone}`;
    } else if (contactSettings?.actionType === 'open_booking' && onOpenBooking) {
      onOpenBooking();
    } else {
      onSelectPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isItemActive = (item: HeaderMenuItem) => {
    if (item.page === 'blog') return activePage === 'blog' || activePage === 'article';
    return activePage === item.page;
  };

  const getPageIcon = (page: string) => {
    switch (page) {
      case 'home':
        return 'home';
      case 'services':
        return 'medical_services';
      case 'gallery':
        return 'auto_fix_high';
      case 'about':
        return 'badge';
      case 'blog':
        return 'menu_book';
      case 'contact':
        return 'location_on';
      default:
        return 'link';
    }
  };

  const logoSrc = brandSettings?.logoUrl || siteImages.headerLogo?.url || clinicInfo.doctorImage || CLINIC_INFO.doctorImage;
  const headerTitle = brandSettings?.title || 'کلینیک دندانپزشکی پارمیس';
  const headerSubtitle = brandSettings?.subtitle || clinicInfo.doctorTitleBrand || CLINIC_INFO.doctorTitleBrand;

  return (
    <>
      {/* Top Announcement Bar (if enabled by admin) */}
      {announcementSettings?.enabled && (
        <div className="bg-[#004ac6] text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 transition-all shadow-xs z-50 relative">
          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            {announcementSettings.badge || 'اعلان'}
          </span>
          <span className="truncate max-w-xl">{announcementSettings.text}</span>
          {announcementSettings.buttonText && (
            <button
              onClick={() => {
                if (announcementSettings.buttonLink === 'contact') onSelectPage('contact');
                else if (announcementSettings.buttonLink?.startsWith('tel:')) window.location.href = announcementSettings.buttonLink;
                else if (announcementSettings.buttonLink?.startsWith('#')) {
                  const el = document.querySelector(announcementSettings.buttonLink);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onSelectPage('services');
                }
              }}
              className="underline font-bold hover:text-amber-200 cursor-pointer shrink-0 mr-1"
            >
              {announcementSettings.buttonText}
            </button>
          )}
        </div>
      )}

      {/* Shared Unified Header */}
      <header
        className={`bg-white/95 backdrop-blur-md text-[#004ac6] z-50 shadow-xs border-b border-[#c3c6d7]/30 transition-all ${
          navSettings?.sticky !== false ? 'sticky top-0' : 'relative'
        }`}
      >
        {/* ================= MOBILE HEADER (< md) ================= */}
        <div className="flex md:hidden items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 w-full max-w-full overflow-hidden">
          {/* Right: Drawer Toggle & Brand Identity */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              ref={menuBtnRef}
              type="button"
              onClick={handleOpenDrawer}
              aria-label="منوی سایت"
              className="p-2 -mr-1.5 rounded-full text-[#191c1e] hover:bg-[#e6e8ea] active:scale-90 transition-transform duration-200 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 cursor-pointer min-w-0 flex-1"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0 shadow-xs bg-[#eceef0]">
                <img
                  src={logoSrc}
                  alt={brandSettings?.logoAlt || headerTitle}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-right min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-bold text-[#004ac6] leading-tight truncate">
                  {headerTitle}
                </span>
                <span className="text-[10px] text-[#565e74] font-semibold truncate">
                  {headerSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Call Action for Mobile */}
          {contactSettings?.showCallIcon !== false && (
            <button
              type="button"
              onClick={handleCallActionClick}
              title="تماس و رزرو نوبت"
              className="w-9 h-9 rounded-full bg-[#004ac6] hover:bg-[#2563eb] text-white flex items-center justify-center shadow-xs active:scale-90 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-fill material-symbols-outlined text-[18px]">call</span>
            </button>
          )}
        </div>

        {/* ================= DESKTOP HEADER (>= md) ================= */}
        <div className="hidden md:flex w-full max-w-7xl mx-auto px-6 items-center justify-between py-3">
          {/* Brand Logo & Subtitle */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-right flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#004ac6] group-hover:scale-105 transition-transform shrink-0 shadow-xs bg-[#eceef0]">
              <img
                src={logoSrc}
                alt={brandSettings?.logoAlt || headerTitle}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-base font-extrabold text-[#004ac6] tracking-tight">
                {headerTitle}
              </span>
              <span className="text-xs text-[#565e74] font-semibold">
                {headerSubtitle}
              </span>
            </div>
          </button>

          {/* Dynamic Desktop Navigation Links */}
          <nav className="flex items-center gap-4 lg:gap-5">
            {activeNavItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuItemClick(item)}
                  className={`text-sm transition-colors cursor-pointer pb-1 ${
                    active
                      ? 'text-[#004ac6] font-bold border-b-2 border-[#004ac6]'
                      : 'text-[#565e74] hover:text-[#004ac6] font-semibold'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Trailing Action Button */}
          <div className="flex items-center gap-3">
            {contactSettings?.showPhoneButton && (
              <a
                href={`tel:${contactSettings.phone || CLINIC_INFO.phone}`}
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-bold hover:bg-[#004ac6]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>{contactSettings.phoneDisplay || CLINIC_INFO.phoneDisplay}</span>
              </a>
            )}

            {contactSettings?.showCallIcon !== false && (
              <button
                type="button"
                onClick={handleCallActionClick}
                title={contactSettings?.phoneButtonText || 'تماس و مسیریابی'}
                aria-label="تماس با ما و مسیریابی"
                className="w-10 h-10 rounded-full bg-[#004ac6] hover:bg-[#2563eb] text-white flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-fill material-symbols-outlined text-[20px]">
                  call
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      <div
        aria-hidden={!isDrawerOpen}
        className={`fixed inset-0 z-50 md:hidden overflow-hidden ${
          isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Smooth Backdrop Overlay */}
        <div
          onClick={handleCloseDrawer}
          className={`fixed inset-0 bg-[#2d3133]/50 backdrop-blur-xs transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Water Droplet Expanding/Collapsing Drawer Panel */}
        <aside
          ref={drawerRef}
          style={{
            clipPath: isDrawerOpen
              ? `circle(150% at ${dropOrigin.x} ${dropOrigin.y})`
              : `circle(0px at ${dropOrigin.x} ${dropOrigin.y})`,
            WebkitClipPath: isDrawerOpen
              ? `circle(150% at ${dropOrigin.x} ${dropOrigin.y})`
              : `circle(0px at ${dropOrigin.x} ${dropOrigin.y})`,
            transition:
              'clip-path 560ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-clip-path 560ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'clip-path',
          }}
          className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] z-50 bg-white rounded-l-2xl shadow-2xl flex flex-col h-full p-4 sm:p-5 overflow-y-auto overflow-x-hidden overscroll-contain transform-gpu box-border"
        >
          {/* Inner Content */}
          <div
            className={`relative z-10 flex flex-col h-full w-full min-w-0 overflow-x-hidden transition-all duration-400 ease-out ${
              isDrawerOpen
                ? 'opacity-100 translate-y-0 scale-100 delay-75'
                : 'opacity-0 -translate-y-2 scale-[0.97]'
            }`}
          >
            {/* Header of Drawer */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#c3c6d7]/20 w-full min-w-0">
              <div className="flex items-center gap-2.5 text-right min-w-0 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0 shadow-xs bg-[#eceef0]">
                  <img
                    src={logoSrc}
                    alt={brandSettings?.logoAlt || headerTitle}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#004ac6] truncate">
                    {headerTitle}
                  </h3>
                  <p className="text-xs text-[#565e74] font-semibold truncate">
                    {headerSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="p-2 rounded-full hover:bg-[#eceef0] text-[#434655] active:scale-90 transition-transform duration-200 cursor-pointer shrink-0"
                aria-label="بستن منو"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Dynamic Navigation Drawer Links */}
            <nav className="flex-1 py-4 space-y-1.5 text-right w-full min-w-0">
              {activeNavItems.map((item) => {
                const active = isItemActive(item);
                const iconName = getPageIcon(item.page);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleMenuItemClick(item)}
                    className={`w-full flex items-center gap-3 rounded-full px-4 py-3 active:scale-[0.98] transition-all cursor-pointer min-w-0 ${
                      active
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'text-[#434655] hover:bg-[#f2f4f6] font-semibold'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined shrink-0 ${
                        active ? 'material-symbols-fill' : ''
                      }`}
                    >
                      {iconName}
                    </span>
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer Quick Dial */}
            <div className="pt-4 border-t border-[#c3c6d7]/20 w-full min-w-0">
              <a
                href={`tel:${contactSettings?.phone || CLINIC_INFO.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-[#004ac6] text-white rounded-full text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-transform truncate"
              >
                <span className="material-symbols-outlined shrink-0 text-[18px]">call</span>
                <span className="truncate">
                  تماس مستقیم: {contactSettings?.phoneDisplay || CLINIC_INFO.phoneCompact}
                </span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
