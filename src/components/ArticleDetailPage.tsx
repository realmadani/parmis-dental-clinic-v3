import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext.tsx';
import { ArticleItem, CLINIC_INFO } from '../data/clinicData.ts';
import { MediaPreview, isVideoUrl } from '../utils/mediaUtils.tsx';

interface ArticleDetailPageProps {
  articleId?: string;
  onNavigateHome: () => void;
  onNavigateBlog: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onSelectArticle: (id: string) => void;
  onOpenBooking: (preselectedService?: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articleId = 'featured-composite-vs-laminate',
  onNavigateHome,
  onNavigateBlog,
  onNavigateAbout,
  onNavigateContact,
  onSelectArticle,
  onOpenBooking,
}) => {
  const {
    articles,
    clinicInfo,
    comments,
    refreshCMS,
    articleDoctorCard,
    articleLatestSection,
    articleRelatedSection,
    articleAuthor,
    articleCtaSection,
    siteImages,
  } = useCMS();
  const CLINIC_INFO = clinicInfo;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTocSection, setActiveTocSection] = useState<string>('introduction');

  // Comment submission form state
  const [commentName, setCommentName] = useState('');
  const [commentPhone, setCommentPhone] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submittedComments, setSubmittedComments] = useState<
    Array<{ id: string; name: string; date: string; text: string; role?: string }>
  >([]);

  // Find the selected article or default to first
  const currentArticle =
    articles.find((a) => a.id === articleId || a.slug === articleId) ||
    articles.find((a) => a.id === 'featured-composite-vs-laminate') ||
    articles[0];

  // Real view counter state
  const [viewsCount, setViewsCount] = useState<number>(() => currentArticle?.views ?? 0);

  useEffect(() => {
    if (currentArticle?.views !== undefined) {
      setViewsCount(currentArticle.views);
    }
  }, [currentArticle?.views]);

  useEffect(() => {
    if (!currentArticle?.id) return;
    const sessionKey = `parmis_viewed_art_${currentArticle.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      fetch(`/api/articles/${currentArticle.id}/view`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.views === 'number') {
            setViewsCount(data.views);
          }
        })
        .catch(() => {});
    }
  }, [currentArticle?.id]);

  const approvedArticleComments = (comments || []).filter(
    (c: any) =>
      (c.articleId === currentArticle.id || c.articleId === currentArticle.slug) &&
      c.status === 'approved'
  );

  const totalCommentsCount = approvedArticleComments.length + submittedComments.length;

  const isCompositeVsLaminate =
    currentArticle.id === 'featured-composite-vs-laminate' ||
    currentArticle.title.includes('کامپوزیت') ||
    currentArticle.categorySlug === 'cosmetic';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('لینک مقاله با موفقیت کپی شد');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: currentArticle.title,
          text: currentArticle.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentMessage.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: currentArticle.id,
          articleTitle: currentArticle.title,
          authorName: commentName.trim(),
          authorPhone: commentPhone.trim(),
          content: commentMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newLocal = {
          id: data.comment?.id || Date.now().toString(),
          name: commentName.trim(),
          date: 'لحظاتی پیش',
          text: commentMessage.trim(),
          role: 'مراجع وبسایت',
        };
        setSubmittedComments((prev) => [newLocal, ...prev]);
        setCommentName('');
        setCommentPhone('');
        setCommentMessage('');
        showToast('دیدگاه و پرسش شما با موفقیت ثبت شد و پس از بررسی و پاسخ پزشک در سایت نمایش داده خواهد شد.');
        if (refreshCMS) {
          refreshCMS();
        }
      } else {
        showToast('خطا در ثبت دیدگاه. لطفاً دوباره تلاش فرمایید.');
      }
    } catch {
      showToast('خطا در برقراری ارتباط با سرور.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveTocSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        currentArticle.introduction ? 'introduction' : '',
        currentArticle.content && currentArticle.content.filter(Boolean).length > 0 ? 'main-content' : '',
        currentArticle.comparisonTable && currentArticle.comparisonTable.rows?.length ? 'comparison-table' : '',
        currentArticle.candidacy ? 'candidacy' : '',
        currentArticle.tips && currentArticle.tips.length > 0 ? 'article-tips' : '',
        currentArticle.faqs && currentArticle.faqs.length > 0 ? 'faq-section' : '',
        currentArticle.showComments !== false ? 'comments-section' : '',
      ].filter(Boolean);
      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTocSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentArticle]);

  // Parse Persian and Gregorian dates to comparable timestamp
  const parseArticleDateToTime = (d?: string, fallbackIndex: number = 0): number => {
    if (!d) return fallbackIndex;
    const clean = d.trim();

    // 1. Try YYYY/MM/DD (Persian or Gregorian) with Persian/English digits
    const slashParts = clean.split(/[/\\-]/).map((p) => {
      const en = p.replace(/[۰-۹]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 1728));
      return parseInt(en, 10);
    });
    if (slashParts.length === 3 && !slashParts.some(isNaN)) {
      const [y, m, day] = slashParts;
      if (y > 1300 && y < 1500) {
        // Persian solar date approximation: y * 365 + m * 30 + day
        return y * 365 + m * 30 + day;
      }
      return new Date(y, m - 1, day).getTime();
    }

    // 2. Try Persian month names e.g. "۲۸ فروردین ۱۴۰۳"
    const persianMonths: Record<string, number> = {
      فروردین: 1,
      اردیبهشت: 2,
      خرداد: 3,
      تیر: 4,
      مرداد: 5,
      شهریور: 6,
      مهر: 7,
      آبان: 8,
      آذر: 9,
      دی: 10,
      بهمن: 11,
      اسفند: 12,
    };

    const tokens = clean.split(/\s+/);
    let foundYear: number | null = null;
    let foundMonth: number | null = null;
    let foundDay: number | null = null;

    for (const token of tokens) {
      const enNum = parseInt(
        token.replace(/[۰-۹]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 1728)),
        10
      );
      if (!isNaN(enNum)) {
        if (enNum > 1300 && enNum < 1500) {
          foundYear = enNum;
        } else if (enNum >= 1 && enNum <= 31 && foundDay === null) {
          foundDay = enNum;
        }
      } else if (persianMonths[token]) {
        foundMonth = persianMonths[token];
      }
    }

    if (foundYear && foundMonth) {
      return foundYear * 365 + foundMonth * 30 + (foundDay || 1);
    }

    return fallbackIndex;
  };

  // Current article tags set
  const currentTags: string[] = (currentArticle?.tags || [])
    .map((t: string) => t.trim().toLowerCase())
    .filter(Boolean);

  // Filter other articles for the related section strictly matching current article's tags
  const relatedCount = articleRelatedSection?.count ?? 3;
  const fallbackToCategory = articleRelatedSection?.fallbackToCategory ?? false;

  const candidateArticles = [...articles].filter((a: ArticleItem) => a.id !== currentArticle.id);

  // 1. Articles that have at least one common tag with the open article
  const tagMatchedArticles = candidateArticles
    .map((art: ArticleItem) => {
      const artTags = (art.tags || []).map((t: string) => t.trim().toLowerCase()).filter(Boolean);
      const matchingTags = artTags.filter((t: string) => currentTags.includes(t));
      return {
        art,
        matchCount: matchingTags.length,
        matchingTags,
      };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => {
      // More shared tags first
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      // Then newest date first
      return parseArticleDateToTime(b.art.date, 0) - parseArticleDateToTime(a.art.date, 0);
    });

  let finalRelatedList: ArticleItem[] = tagMatchedArticles.map((item) => item.art);

  // If user enabled fallbackToCategory and tag matches are less than requested count
  if (fallbackToCategory && finalRelatedList.length < relatedCount) {
    const existingIds = new Set(finalRelatedList.map((a) => a.id));
    const categoryFallbacks = candidateArticles
      .filter((a) => !existingIds.has(a.id) && a.category && currentArticle?.category && a.category === currentArticle.category)
      .sort((a, b) => parseArticleDateToTime(b.date, 0) - parseArticleDateToTime(a.date, 0));
    finalRelatedList = [...finalRelatedList, ...categoryFallbacks];
  }

  const relatedArticles: ArticleItem[] = finalRelatedList.slice(0, relatedCount);

  // Latest articles sorted by date descending (from newest to oldest)
  const latestCount = articleLatestSection?.count ?? 4;
  const latestArticles: ArticleItem[] = [...articles]
    .filter((a: ArticleItem) => a.id !== currentArticle.id)
    .sort((a, b) => {
      const timeB = parseArticleDateToTime(b.date, 0);
      const timeA = parseArticleDateToTime(a.date, 0);
      return timeB - timeA;
    })
    .slice(0, latestCount);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-16 selection:bg-[#dbe1ff] selection:text-[#004ac6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191c1e] text-white px-5 py-3 rounded-full shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/10 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-right dir-rtl">
        {/* 1. BREADCRUMB NAVIGATION */}
        <nav
          aria-label="مسیر راهنما"
          className="flex items-center gap-2 text-xs sm:text-sm text-[#565e74] mb-6 flex-wrap"
        >
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#004ac6] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>صفحه اصلی</span>
          </button>
          <span className="material-symbols-outlined text-xs text-[#c3c6d7]">chevron_left</span>
          <button
            type="button"
            onClick={onNavigateBlog}
            className="hover:text-[#004ac6] transition-colors cursor-pointer font-medium"
          >
            مقالات سلامت دهان
          </button>
          <span className="material-symbols-outlined text-xs text-[#c3c6d7]">chevron_left</span>
          <button
            type="button"
            onClick={onNavigateBlog}
            className="hover:text-[#004ac6] transition-colors cursor-pointer font-medium"
          >
            {currentArticle.category}
          </button>
          <span className="material-symbols-outlined text-xs text-[#c3c6d7]">chevron_left</span>
          <span className="text-[#191c1e] font-semibold truncate max-w-xs sm:max-w-md">
            {currentArticle.title}
          </span>
        </nav>

        {/* 2. ARTICLE HEADER */}
        <header className="mb-6 sm:mb-8">
          {/* Eyebrow Badges */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#dae2fd] text-[#004ac6] text-xs font-bold rounded-full">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>{currentArticle.category}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eceef0] text-[#434655] text-xs font-semibold rounded-full">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>تأییدیه علمی دکتر شمس پور</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[#565e74] text-xs font-medium">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>کلینیک پارمیس، پاکدشت</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#191c1e] leading-snug sm:leading-tight max-w-5xl mb-5">
            {currentArticle.title}
          </h1>

          {/* Meta Bar & Social Sharing Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-[#c3c6d7]/30 text-[#565e74] text-xs sm:text-sm">
            {/* Author & Publication Data */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {articleAuthor?.enabled !== false && (
                <>
                  <div
                    onClick={() => {
                      if (onNavigateAbout) onNavigateAbout();
                    }}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    title="مشاهده پروفایل نویسنده"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0 bg-[#eceef0] shadow-xs group-hover:scale-105 transition-transform">
                      <img
                        src={
                          articleAuthor?.avatarUrl ||
                          siteImages?.doctorProfileImage?.url ||
                          CLINIC_INFO.doctorImage
                        }
                        alt={articleAuthor?.name || CLINIC_INFO.doctorName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[#191c1e] block group-hover:text-[#004ac6] transition-colors">
                        {articleAuthor?.name || currentArticle.author || CLINIC_INFO.doctorName}
                      </span>
                      <span className="text-[11px] text-[#565e74]">
                        {articleAuthor?.role || currentArticle.authorRole || 'جراح و دندان‌پزشک • سرپرست درمان کلینیک'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#c3c6d7] hidden sm:inline">•</span>
                </>
              )}
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                <span>{currentArticle.date || new Date().toLocaleDateString('fa-IR')}</span>
              </div>

              <span className="text-[#c3c6d7] hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="material-symbols-outlined text-base">schedule</span>
                <span>{currentArticle.readTime}</span>
              </div>

              <span className="text-[#c3c6d7] inline">•</span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>{viewsCount.toLocaleString('fa-IR')} بازدید</span>
              </div>

              <span className="text-[#c3c6d7] inline">•</span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
                <span>{totalCommentsCount.toLocaleString('fa-IR')} نظر</span>
              </div>
            </div>

            {/* Social Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  currentArticle.title + ' ' + window.location.href
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full hover:bg-emerald-50 text-[#565e74] hover:text-emerald-600 transition-colors"
                title="اشتراک‌گذاری در واتساپ"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(currentArticle.title)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full hover:bg-sky-50 text-[#565e74] hover:text-sky-600 transition-colors"
                title="اشتراک‌گذاری در تلگرام"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#434655] text-xs font-semibold transition-colors cursor-pointer"
                title="کپی لینک مقاله"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>کپی لینک</span>
              </button>
            </div>
          </div>
        </header>

        {/* 3. HERO ARTICLE IMAGE / VIDEO */}
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-3xl overflow-hidden mb-8 sm:mb-10 shadow-md bg-[#f2f4f6] border border-[#c3c6d7]/30">
          <MediaPreview
            src={
              currentArticle.image ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDMqapcf1kk9tqM74BZqV7k5gViVJ4iQcsyd9UkXWJXXdEZbdFjCw9QGUecA4xedUU7HlNpC9KOj9givjZQ-7ESi1TYN12B9NwrUtvztyMH5K8ceR8RL_2yqmmLrK9Qi-VbNIEpyT1DZDkjIGEgXq9dKSPyytAZDg1ZBz-I5qStNSa6-Nhar3Y6FEjr9BKHtlXBSq82TOPO5ypdP5zi-VtTfnohvIxBrEMHCXv5hk95RWy_V0lM7NTr'
            }
            alt={currentArticle.title}
            className="w-full h-full object-cover"
            controls={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e]/85 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
            <div>
              <span className="inline-block bg-[#004ac6] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-xs">
                {currentArticle.category}
              </span>
              <p className="text-xs sm:text-sm text-slate-100 max-w-2xl leading-relaxed">
                {currentArticle.summary}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-medium self-start sm:self-auto shrink-0">
              <span className="material-symbols-outlined text-sm">
                {isVideoUrl(currentArticle.image) ? 'videocam' : 'photo_camera'}
              </span>
              <span>{isVideoUrl(currentArticle.image) ? 'ویدیوی آرشیوی کلینیک پارمیس' : 'تصویر آرشیوی کلینیک پارمیس'}</span>
            </div>
          </div>
        </div>

        {/* 4. TWO-COLUMN LAYOUT: MAIN CONTENT (8 COLS) + STICKY SIDEBAR (4 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= MAIN CONTENT BODY (8 COLS) ================= */}
          <article className="lg:col-span-8 flex flex-col gap-8">
            {/* 5. KEY TAKEAWAYS (خلاصه اجرایی و نکات کلیدی در یک نگاه) */}
            {currentArticle.executiveSummary && currentArticle.executiveSummary.length > 0 && (
              <section className="bg-white border border-[#004ac6]/20 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#004ac6]" />
                <div className="flex items-center gap-2.5 text-[#004ac6] mb-3">
                  <span className="material-symbols-outlined text-2xl">insights</span>
                  <h2 className="text-base sm:text-xl font-bold text-[#191c1e]">
                    خلاصه اجرایی و نکات کلیدی در یک نگاه
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#565e74] mb-4">
                  اگر زمان محدودی برای مطالعه دارید، مهم‌ترین نکات بالینی این مقاله را در موارد زیر مرور فرمایید:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {currentArticle.executiveSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f2f4f6] border border-[#c3c6d7]/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-lg">
                          {item.icon || 'check_circle'}
                        </span>
                      </div>
                      <div>
                        <strong className="text-xs sm:text-sm font-bold text-[#191c1e] block mb-1">
                          {item.title}
                        </strong>
                        <p className="text-[11px] sm:text-xs text-[#565e74] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* INTRODUCTION */}
            {currentArticle.introduction && (
              <section
                id="introduction"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
                <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#004ac6] rounded-full inline-block" />
                  <span>مقدمه و بررسی تخصصی موضوع</span>
                </h2>
                <div className="text-sm sm:text-base text-[#191c1e] font-medium leading-loose text-justify">
                  <p>{currentArticle.introduction}</p>
                </div>
              </section>
            )}

            {/* MAIN CONTENT BODY */}
            {currentArticle.content && currentArticle.content.filter(Boolean).length > 0 && (
              <section
                id="main-content"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
                <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#004ac6] rounded-full inline-block" />
                  <span>شرح جامع و جزئیات درمان</span>
                </h2>
                <div className="text-sm sm:text-base text-[#565e74] space-y-4 text-justify leading-relaxed">
                  {currentArticle.content.filter(Boolean).map((p, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* 7. DETAILED COMPARISON TABLE (جدول مقایسه‌ای یا فنی جامع) */}
            {currentArticle.comparisonTable && currentArticle.comparisonTable.rows && currentArticle.comparisonTable.rows.length > 0 && (
              <section
                id="comparison-table"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-[#004ac6] rounded-full inline-block" />
                      <span>{currentArticle.comparisonTable.title}</span>
                    </h2>
                    {currentArticle.comparisonTable.subtitle && (
                      <p className="text-xs sm:text-sm text-[#565e74] mt-1">
                        {currentArticle.comparisonTable.subtitle}
                      </p>
                    )}
                  </div>
                  {currentArticle.comparisonTable.badge && (
                    <span className="px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] text-xs font-bold rounded-full">
                      {currentArticle.comparisonTable.badge}
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#c3c6d7]/30">
                  <table className="w-full text-right border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#f2f4f6] text-[#191c1e] border-b border-[#c3c6d7]/30">
                        <th className="p-3.5 font-bold">معیار بالینی / پارامتر</th>
                        <th className="p-3.5 font-bold text-[#004ac6]">
                          {currentArticle.comparisonTable.col1Header}
                        </th>
                        <th className="p-3.5 font-bold text-[#00569c]">
                          {currentArticle.comparisonTable.col2Header}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c3c6d7]/20 text-[#434655]">
                      {currentArticle.comparisonTable.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={`hover:bg-[#f7f9fb] transition-colors ${
                            rIdx % 2 === 1 ? 'bg-[#fdfdfe]' : ''
                          }`}
                        >
                          <td className="p-3.5 font-bold text-[#191c1e]">{row.criterion}</td>
                          <td className="p-3.5 font-semibold text-[#004ac6]">{row.col1}</td>
                          <td className="p-3.5">{row.col2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 8. DOCTOR'S SPECIAL QUOTE CALLOUT BOX */}
            {currentArticle.doctorQuote && currentArticle.doctorQuote.quote && (
              <section className="bg-gradient-to-l from-[#004ac6]/10 via-[#004ac6]/5 to-white border-r-4 border-[#004ac6] rounded-3xl p-6 sm:p-7 relative shadow-xs">
                <span className="material-symbols-outlined text-[#004ac6]/20 text-7xl absolute left-4 bottom-2 pointer-events-none">
                  format_quote
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#004ac6] text-2xl">medical_services</span>
                  <span className="text-sm font-bold text-[#004ac6]">
                    {currentArticle.doctorQuote.sectionTitle || `دیدگاه بالینی ${currentArticle.doctorQuote.doctorName || CLINIC_INFO.doctorName}`}
                  </span>
                </div>
                <blockquote className="text-sm sm:text-base text-[#191c1e] font-semibold leading-relaxed mb-4 text-justify">
                  «{currentArticle.doctorQuote.quote}»
                </blockquote>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#565e74] gap-2">
                  <span>{currentArticle.doctorQuote.doctorRole || clinicInfo?.doctorRole || 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)'}</span>
                  <span className="bg-white px-3 py-1 rounded-full border border-[#c3c6d7]/30 text-[#004ac6] font-bold">
                    {currentArticle.doctorQuote.medicalCouncilCode || (clinicInfo?.medicalCouncilCode ? `نظام پزشکی: ${clinicInfo.medicalCouncilCode} (ثبت رسمی)` : 'نظام پزشکی: ۱۱۱۹۳۵ (ثبت رسمی)')}
                  </span>
                </div>
              </section>
            )}



            {/* 10. CANDIDACY: WHO IS SUITABLE FOR WHAT? */}
            {currentArticle.candidacy && (
              <section
                id="candidacy"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
                <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#004ac6] rounded-full inline-block" />
                  <span>{currentArticle.candidacy.title || 'ارزیابی کاندیداهای درمان و روش‌های مناسب'}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Group 1 */}
                  {currentArticle.candidacy.option1 && (
                    <div className="p-5 rounded-2xl bg-[#f2f4f6] border border-[#004ac6]/20">
                      <div className="flex items-center gap-2 text-[#004ac6] font-bold text-sm sm:text-base mb-3">
                        <span className="material-symbols-outlined text-xl">person_check</span>
                        <span>{currentArticle.candidacy.option1.title}</span>
                      </div>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-[#565e74]">
                        {(currentArticle.candidacy.option1.items || []).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[#004ac6] text-base shrink-0 mt-0.5">
                              done
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Group 2 */}
                  {currentArticle.candidacy.option2 && (
                    <div className="p-5 rounded-2xl bg-[#f2f4f6] border border-[#00569c]/20">
                      <div className="flex items-center gap-2 text-[#00569c] font-bold text-sm sm:text-base mb-3">
                        <span className="material-symbols-outlined text-xl">verified_user</span>
                        <span>{currentArticle.candidacy.option2.title}</span>
                      </div>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-[#565e74]">
                        {(currentArticle.candidacy.option2.items || []).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[#00569c] text-base shrink-0 mt-0.5">
                              done
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* GOLDEN TIPS (توصیه‌های طلایی و مراقبت‌های بالینی) */}
            {currentArticle.tips && currentArticle.tips.length > 0 && (
              <section
                id="article-tips"
                className="bg-[#f0f4ff] border border-[#004ac6]/20 rounded-3xl p-5 sm:p-7 shadow-xs"
              >
                <div className="flex items-center gap-2.5 text-[#004ac6] mb-4">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                  <h2 className="text-base sm:text-xl font-bold text-[#191c1e]">
                    {currentArticle.tipsTitle || 'توصیه‌های طلایی و مراقبت‌های بالینی پزشک'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {currentArticle.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-[#c3c6d7]/20 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 11. FAQ ACCORDION SECTION */}
            {currentArticle.faqs && currentArticle.faqs.length > 0 && (
              <section
                id="faq-section"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
                <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#004ac6] rounded-full inline-block" />
                  <span>سوالات متداول مراجعین درباره این موضوع</span>
                </h2>

                <div className="space-y-3">
                  {currentArticle.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#f2f4f6] rounded-2xl border border-[#c3c6d7]/30 transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between cursor-pointer font-bold text-[#191c1e] text-xs sm:text-sm text-right"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#004ac6] text-lg">
                            help_outline
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-[#565e74] transition-transform ${
                            openFaqIndex === idx ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {openFaqIndex === idx && (
                        <div className="pt-3 text-xs sm:text-sm text-[#565e74] leading-relaxed border-t border-[#c3c6d7]/20 mt-3 text-justify">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 12. ARTICLE TAGS */}
            {Array.isArray(currentArticle.tags) && currentArticle.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs sm:text-sm text-[#565e74] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">sell</span>
                  <span>برچسب‌ها:</span>
                </span>
                {currentArticle.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={onNavigateBlog}
                    className="px-3 py-1 bg-[#eceef0] hover:bg-[#dbe1ff] hover:text-[#004ac6] transition-colors text-xs text-[#434655] rounded-full border border-[#c3c6d7]/20 cursor-pointer"
                  >
                    #{tag.replace(/^#/, '')}
                  </button>
                ))}
              </div>
            )}

            {/* 13. COMMENTS & USER QUESTIONS SECTION */}
            {currentArticle.showComments !== false && (
              <section
                id="comments-section"
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-xs border border-[#c3c6d7]/30"
              >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004ac6] text-2xl">forum</span>
                  <span>دیدگاه‌ها و پرسش‌های بیماران ({totalCommentsCount.toLocaleString('fa-IR')} نظر)</span>
                </h2>
                <span className="text-xs text-[#004ac6] font-bold bg-[#dbe1ff]/60 px-3 py-1 rounded-full">
                  پاسخ‌گویی مستقیم توسط دکتر شمس پور
                </span>
              </div>

              {/* Question Submission Form */}
              <form
                onSubmit={handleCommentSubmit}
                className="bg-[#f2f4f6] p-4 sm:p-5 rounded-2xl border border-[#c3c6d7]/30 mb-8"
              >
                <h3 className="font-bold text-[#191c1e] text-xs sm:text-sm mb-1.5">
                  طرح سوال از دکتر انوشیروان شمس پور درباره طرح لبخند
                </h3>
                <p className="text-xs text-[#565e74] mb-4">
                  می‌توانید شرایط دندانی خود را بنویسید تا روش درمانی مناسب به شما پیشنهاد شود.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full bg-white border border-[#c3c6d7]/40 rounded-full px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#004ac6]"
                    placeholder="نام و نام خانوادگی *"
                    required
                    type="text"
                  />
                  <input
                    value={commentPhone}
                    onChange={(e) => setCommentPhone(e.target.value)}
                    className="w-full bg-white border border-[#c3c6d7]/40 rounded-full px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#004ac6] text-right"
                    dir="ltr"
                    placeholder="شماره تماس (اختیاری جهت هماهنگی)"
                    type="tel"
                  />
                </div>
                <textarea
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  className="w-full bg-white border border-[#c3c6d7]/40 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm focus:outline-none focus:border-[#004ac6] mb-3"
                  placeholder="متن پرسش یا شرح وضعیت دندان‌هایتان... *"
                  required
                  rows={3}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-[#565e74] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>شماره تماس شما نمایش داده نخواهد شد.</span>
                  </span>
                  <button
                    disabled={isSubmittingComment}
                    className="w-full sm:w-auto bg-[#004ac6] hover:bg-[#2563eb] disabled:opacity-50 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    type="submit"
                  >
                    {isSubmittingComment ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                        <span>در حال ارسال...</span>
                      </>
                    ) : (
                      <span>ارسال دیدگاه و سوال</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Newly submitted comments in this session */}
              {submittedComments.map((c) => (
                <div key={c.id} className="border-b border-[#c3c6d7]/20 pb-5 mb-5 animate-fadeIn bg-blue-50/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#004ac6] font-bold flex items-center justify-center text-xs">
                        {c.name.slice(0, 1)}
                      </div>
                      <div>
                        <span className="font-bold text-[#191c1e] text-xs sm:text-sm">{c.name}</span>
                        <span className="text-[10px] text-[#565e74] block">{c.date}</span>
                      </div>
                    </div>
                    <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                      در انتظار تایید و پاسخ پزشک
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#434655] pr-10 leading-relaxed">{c.text}</p>
                </div>
              ))}

              {/* Dynamic Approved Comments Thread */}
              {approvedArticleComments.length > 0 ? (
                <div className="space-y-6">
                  {approvedArticleComments.map((c: any) => (
                    <div key={c.id} className="border-b border-[#c3c6d7]/20 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#dae2fd] text-[#004ac6] font-bold flex items-center justify-center text-xs">
                            {c.authorName ? c.authorName.slice(0, 2) : 'کاربر'}
                          </div>
                          <div>
                            <span className="font-bold text-[#191c1e] text-xs sm:text-sm">
                              {c.authorName}
                            </span>
                            <span className="text-[11px] text-[#565e74] block">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fa-IR') : 'به تازگی'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] bg-[#eceef0] px-2.5 py-0.5 rounded-full text-[#565e74] font-medium">
                          پرسش مراجع
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#565e74] pr-11 text-justify mb-3 leading-relaxed">
                        {c.content}
                      </p>

                      {/* Doctor Official Response Card */}
                      {c.doctorReply && (
                        <div className="mr-6 sm:mr-10 bg-[#004ac6]/5 border-r-2 border-[#004ac6] rounded-2xl p-4 mt-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-sm">verified</span>
                            </div>
                            <div>
                              <span className="font-bold text-[#004ac6] text-xs sm:text-sm">
                                پاسخ {c.repliedBy || 'دکتر انوشیروان شمس پور'}
                              </span>
                              <span className="text-[10px] text-[#565e74] mr-2">
                                {c.repliedAt ? new Date(c.repliedAt).toLocaleDateString('fa-IR') : 'جراح و دندان‌پزشک'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-[#434655] leading-relaxed text-justify">
                            {c.doctorReply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : submittedComments.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#f8fafc] rounded-2xl border border-dashed border-[#c3c6d7]/60">
                  <span className="material-symbols-outlined text-3xl text-[#004ac6]/60 mb-2 block">forum</span>
                  <p className="text-xs sm:text-sm text-[#565e74] font-medium">
                    هنوز دیدگاهی برای این مقاله ثبت نشده است. اولین نفری باشید که دیدگاه یا پرسش خود را ثبت می‌کنید.
                  </p>
                </div>
              ) : null}
            </section>
            )}
          </article>

          {/* ================= 6. STICKY SIDEBAR (4 COLS) ================= */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* A. Table of Contents (فهرست عناوین با نشانگر) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-[#c3c6d7]/30">
              <div className="flex items-center gap-2 text-[#004ac6] font-bold text-base mb-4 pb-2 border-b border-[#c3c6d7]/20">
                <span className="material-symbols-outlined">format_list_numbered_rtl</span>
                <h3>فهرست مطالب این مقاله</h3>
              </div>
              <nav className="space-y-1.5 text-xs sm:text-sm">
                {currentArticle.introduction && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('introduction')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'introduction'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'introduction' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>مقدمه و بررسی تخصصی موضوع</span>
                  </button>
                )}

                {currentArticle.content && currentArticle.content.filter(Boolean).length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('main-content')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'main-content'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'main-content' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>شرح جامع و جزئیات درمان</span>
                  </button>
                )}

                {currentArticle.comparisonTable && currentArticle.comparisonTable.rows && currentArticle.comparisonTable.rows.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('comparison-table')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'comparison-table'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'comparison-table' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>{currentArticle.comparisonTable.title || 'جدول ارزیابی و مقایسه'}</span>
                  </button>
                )}



                {currentArticle.candidacy && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('candidacy')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'candidacy'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'candidacy' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>{currentArticle.candidacy.title || 'شما کاندید کدام روش هستید؟'}</span>
                  </button>
                )}

                {currentArticle.tips && currentArticle.tips.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('article-tips')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'article-tips'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'article-tips' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>توصیه‌های طلایی و مراقبت‌های پزشک</span>
                  </button>
                )}

                {currentArticle.faqs && currentArticle.faqs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('faq-section')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'faq-section'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'faq-section' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>پاسخ به سوالات متداول مراجعین</span>
                  </button>
                )}

                {currentArticle.showComments !== false && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('comments-section')}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl transition-colors text-right cursor-pointer ${
                      activeTocSection === 'comments-section'
                        ? 'bg-[#004ac6]/10 text-[#004ac6] font-bold'
                        : 'hover:bg-[#f2f4f6] text-[#565e74]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeTocSection === 'comments-section' ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                      }`}
                    />
                    <span>دیدگاه‌ها و پرسش و پاسخ</span>
                  </button>
                )}
              </nav>
            </div>

            {/* B. Quick Appointment Booking Card (پاکدشت و تلفن مستقیم) */}
            <div className="bg-gradient-to-br from-[#004ac6] to-[#2563eb] text-white p-6 rounded-3xl shadow-md relative overflow-hidden text-right">
              <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                <span className="text-[11px] font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  نوبت‌دهی آنلاین
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">
                مشاوره حضوری طرح لبخند با دکتر شمس پور
              </h3>
              <p className="text-xs text-blue-100 mb-5 leading-relaxed">
                معاینه و آنالیز رایگان قوس لبخند در کلینیک پارمیس (پاکدشت، مجتمع پزشکی راستین).
              </p>
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="w-full bg-white text-[#004ac6] hover:bg-blue-50 py-3 rounded-full text-center font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] mb-3 text-xs sm:text-sm"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>تماس مستقیم: {CLINIC_INFO.phoneCompact}</span>
              </a>
              <div className="flex items-center justify-center gap-1.5 text-blue-100 text-xs text-center">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>پاسخگویی همه‌روزه از ساعت ۱۶ الی ۲۱</span>
              </div>
            </div>

            {/* C. Author Doctor Profile Card */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-[#c3c6d7]/30 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#dae2fd] shadow-md bg-[#eceef0]">
                  <img
                    src={
                      articleDoctorCard?.avatarUrl ||
                      siteImages?.doctorProfileImage?.url ||
                      CLINIC_INFO.doctorImage
                    }
                    alt={articleDoctorCard?.doctorName || CLINIC_INFO.doctorName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute bottom-0 right-1 bg-[#004ac6] text-white p-1 rounded-full text-xs flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-sm">verified</span>
                </span>
              </div>
              <h4 className="font-bold text-[#191c1e] text-base mb-1">
                {articleDoctorCard?.doctorName || CLINIC_INFO.doctorName}
              </h4>
              <p className="text-[#004ac6] text-xs font-bold mb-3">
                {articleDoctorCard?.doctorRole || CLINIC_INFO.doctorRole}
              </p>
              <p className="text-xs text-[#565e74] leading-relaxed mb-4 text-justify">
                {articleDoctorCard?.bio ||
                  'دارای بورد تخصصی و سال‌ها تجربه در ارائه درمان‌های پیشرفته ایمپلنت، اصلاح لبخند دیجیتال و پروتزهای دندانی در شهرستان پاکدشت.'}
              </p>
              <div className="w-full bg-[#f2f4f6] rounded-2xl p-3 flex justify-around text-center mb-4 border border-[#c3c6d7]/30">
                <div>
                  <span className="block font-bold text-[#191c1e] text-sm">
                    {articleDoctorCard?.experienceText || '+۱۴'}
                  </span>
                  <span className="text-[11px] text-[#565e74]">
                    {articleDoctorCard?.experienceLabel || 'سال تجربه'}
                  </span>
                </div>
                <div className="border-r border-[#c3c6d7]/30" />
                <div>
                  <span className="block font-bold text-[#191c1e] text-sm">
                    {articleDoctorCard?.successCountText || '+۳,۵۰۰'}
                  </span>
                  <span className="text-[11px] text-[#565e74]">
                    {articleDoctorCard?.successCountLabel || 'لبخند موفق'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateAbout) {
                    onNavigateAbout();
                  } else {
                    onNavigateHome();
                  }
                }}
                className="w-full py-2.5 rounded-full border border-[#004ac6] text-[#004ac6] hover:bg-[#004ac6]/5 text-xs font-bold transition-colors cursor-pointer"
              >
                {articleDoctorCard?.buttonText || 'مشاهده رزومه و سوابق پزشک'}
              </button>
            </div>

            {/* D. Latest Articles in Clinic */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-[#c3c6d7]/30">
              <h3 className="font-bold text-[#191c1e] text-sm sm:text-base mb-4 pb-2 border-b border-[#c3c6d7]/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ac6]">schedule</span>
                <span>{articleLatestSection?.title || 'جدیدترین مقالات کلینیک'}</span>
              </h3>
              <div className="space-y-4">
                {latestArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#eceef0] overflow-hidden shrink-0">
                      <MediaPreview
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        controls={false}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="text-xs font-bold text-[#191c1e] group-hover:text-[#004ac6] transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#565e74] mt-1 flex-wrap">
                        {art.date && (
                          <span className="text-[#004ac6] font-medium">{art.date}</span>
                        )}
                        {articleLatestSection?.showReadTime !== false && art.readTime && (
                          <>
                            {art.date && <span>•</span>}
                            <span>{art.readTime}</span>
                          </>
                        )}
                        {articleLatestSection?.showViews !== false && (art.views !== undefined && art.views > 0) && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-500 font-medium">
                              <span className="material-symbols-outlined text-[12px]">visibility</span>
                              <span>{art.views.toLocaleString('fa-IR')}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 14. RELATED ARTICLES (کارت‌های استاندارد بر اساس برچسب‌ها) */}
        <section className="mt-14 sm:mt-16 pt-10 border-t border-[#c3c6d7]/30">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-[#004ac6] text-xs font-bold block mb-1">
                {articleRelatedSection?.badgeText || 'بیشتر بخوانید'}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-[#191c1e]">
                {articleRelatedSection?.title || 'مقالات مرتبط با این موضوع'}
              </h2>
              {articleRelatedSection?.subtitle && (
                <p className="text-xs text-[#565e74] mt-1">
                  {articleRelatedSection.subtitle}
                </p>
              )}
            </div>
            {articleRelatedSection?.buttonText && (
              <button
                type="button"
                onClick={onNavigateBlog}
                className="text-[#004ac6] font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{articleRelatedSection.buttonText}</span>
                <span className="material-symbols-outlined text-base rotate-180">arrow_back</span>
              </button>
            )}
          </div>

          {relatedArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 text-center shadow-xs">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 block">
                label_off
              </span>
              <p className="text-sm font-semibold text-slate-600 mb-4">
                {articleRelatedSection?.emptyStateMessage ||
                  'در حال حاضر مقاله دیگری با این برچسب منتشر نشده است.'}
              </p>
              <button
                type="button"
                onClick={onNavigateBlog}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004ac6] text-white text-xs font-bold hover:bg-[#003ba0] transition-colors"
              >
                <span>مشاهده وبلاگ و سایر مقالات</span>
                <span className="material-symbols-outlined text-sm rotate-180">arrow_back</span>
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${relatedArticles.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : relatedArticles.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'} gap-6`}>
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectArticle(rel.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#c3c6d7]/30 flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="relative h-48 bg-[#eceef0] overflow-hidden">
                    <MediaPreview
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      controls={false}
                    />
                    {articleRelatedSection?.showCategoryBadge !== false && (
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#004ac6] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                        {rel.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {(articleRelatedSection?.showDate !== false || articleRelatedSection?.showReadTime !== false) && (
                        <span className="text-[11px] text-[#565e74] block mb-1.5 flex-wrap gap-1">
                          {articleRelatedSection?.showDate !== false && rel.date && (
                            <span>{rel.date}</span>
                          )}
                          {articleRelatedSection?.showDate !== false && rel.date && articleRelatedSection?.showReadTime !== false && (
                            <span> • </span>
                          )}
                          {articleRelatedSection?.showReadTime !== false && (
                            <span>زمان: {rel.readTime}</span>
                          )}
                        </span>
                      )}
                      <h3 className="font-bold text-[#191c1e] text-sm group-hover:text-[#004ac6] transition-colors mb-2 leading-snug line-clamp-2">
                        {rel.title}
                      </h3>
                      {articleRelatedSection?.showSummary !== false && (
                        <p className="text-xs text-[#565e74] line-clamp-2 leading-relaxed">
                          {rel.summary}
                        </p>
                      )}
                    </div>
                    {articleRelatedSection?.showCardButton !== false && (
                      <div className="mt-4 pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between text-xs text-[#004ac6] font-bold">
                        <span>{articleRelatedSection?.cardButtonText || 'مطالعه مقاله'}</span>
                        <span className="material-symbols-outlined text-sm rotate-180">arrow_back</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 15. CLINIC VISIT CALL TO ACTION BANNER (PAKDASHT) */}
        {articleCtaSection?.enabled !== false && (
          <section className="mt-14 sm:mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-[#c3c6d7]/30 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-right">
              {articleCtaSection?.badgeText && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dae2fd] text-[#004ac6] rounded-full text-xs font-bold mb-3">
                  <span className="material-symbols-outlined text-sm">pin_drop</span>
                  <span>{articleCtaSection.badgeText}</span>
                </span>
              )}
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e] mb-3">
                {articleCtaSection?.title || 'آماده لبخندی بی‌نقص و مطمئن هستید؟'}
              </h2>
              <p className="text-xs sm:text-base text-[#565e74] leading-relaxed mb-4">
                {articleCtaSection?.description ||
                  'برای معاینه بالینی، ارزیابی ضخامت مینای دندان و دریافت برآورد شفاف هزینه‌ها، همین امروز با کلینیک پارمیس (دکتر انوشیروان شمس پور) تماس بگیرید یا نوبت حضوری خود را در پاکدشت هماهنگ نمایید.'}
              </p>
              {(articleCtaSection?.features || [
                'تجهیزات دیجیتال مدرن',
                'متریال درجه یک اصل سوئیس و ژاپن',
                'طرف قرارداد بیمه‌ها',
              ]).length > 0 && (
                <div className="flex items-center gap-4 text-xs text-[#434655] flex-wrap">
                  {(articleCtaSection?.features || [
                    'تجهیزات دیجیتال مدرن',
                    'متریال درجه یک اصل سوئیس و ژاپن',
                    'طرف قرارداد بیمه‌ها',
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#004ac6] text-base">verified</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href={`tel:${articleCtaSection?.phone || CLINIC_INFO.phone2}`}
                className="bg-[#004ac6] text-white hover:bg-[#2563eb] transition-all px-8 py-3.5 rounded-full text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>{articleCtaSection?.phoneText || `تماس با مطب: ${CLINIC_INFO.phoneCompact2}`}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateContact) {
                    onNavigateContact();
                  } else {
                    onNavigateHome();
                  }
                }}
                className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] transition-colors px-8 py-3.5 rounded-full text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#c3c6d7]/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">directions</span>
                <span>{articleCtaSection?.navButtonText || 'مسیریابی و تماس با ما'}</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
