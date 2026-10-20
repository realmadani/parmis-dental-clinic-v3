import React, { useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext.tsx';
import {
  BLOG_CATEGORIES,
  TRENDING_TAGS,
  QUICK_HEALTH_TIPS,
  ArticleItem,
  CLINIC_INFO,
} from '../data/clinicData.ts';
import { MediaPreview } from '../utils/mediaUtils.tsx';

interface BlogPageProps {
  onOpenBooking: (preselectedService?: string) => void;
  onNavigateHome: () => void;
  onSelectArticle?: (articleId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onOpenBooking,
  onNavigateHome,
  onSelectArticle,
}) => {
  const { articles, clinicInfo, blogCategories, editorPick, siteImages, comments } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSort, setActiveSort] = useState<'newest' | 'popular' | 'recommended'>('newest');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const getArticleCommentsCount = (art: ArticleItem) => {
    return (comments || []).filter(
      (c: any) =>
        (c.articleId === art.id || c.articleId === art.slug) &&
        c.status === 'approved'
    ).length;
  };
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleShare = (article: ArticleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('لینک مقاله در حافظه کپی شد');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterPhone.trim() || newsletterPhone.length < 10) {
      showToast('لطفاً شماره موبایل معتبر وارد فرمایید');
      return;
    }
    setNewsletterSuccess(true);
    showToast('شماره شما با موفقیت در باشگاه مراجعین پارمیس ثبت گردید');
  };

  // Find featured article (usually the first one marked featured, or the first in list)
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  // Filtered and sorted non-featured articles (and include all matching when searching)
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // If no query and category is all, don't show the featured article in the bottom grid if it's already shown in hero
      const matchesCategory =
        selectedCategory === 'all' ||
        article.categorySlug === selectedCategory ||
        article.category.includes(selectedCategory);

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim().replace(/^#/, '');
      const inTitle = article.title.toLowerCase().includes(q);
      const inSummary = article.summary.toLowerCase().includes(q);
      const inContent = article.content.some((p) => p.toLowerCase().includes(q));
      const inTags = article.tags?.some((t) => t.toLowerCase().includes(q));

      return inTitle || inSummary || inContent || inTags;
    });
  }, [selectedCategory, searchQuery]);

  // Exclude featured article from standard grid if we are showing it at the top and no active search query, and sort by activeSort
  const gridArticles = useMemo(() => {
    let list = (searchQuery.trim() || selectedCategory !== 'all')
      ? filteredArticles
      : filteredArticles.filter((a) => a.id !== featuredArticle?.id);

    if (activeSort === 'popular') {
      return [...list].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
    }
    if (activeSort === 'recommended') {
      return [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [filteredArticles, searchQuery, selectedCategory, featuredArticle, activeSort]);

  return (
    <div className="w-full bg-[#f7f9fb] text-[#191c1e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191c1e] text-white px-5 py-3 rounded-full shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/10 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. HERO & SEARCH SECTION ================= */}
      <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#f2f4f6] via-[#f7f9fb] to-[#f7f9fb] border-b border-[#c3c6d7]/20">
        {/* Background atmospheric decorative glows */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#dbe1ff]/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 left-10 w-72 h-72 bg-[#dae2fd]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-right sm:text-center">
          {/* Eyebrow Badge */}
          <div className="flex sm:justify-center mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dae2fd]/70 text-[#004ac6] text-xs font-semibold border border-[#004ac6]/10 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
              <span>دانشنامه و پایگاه دانش دندان‌پزشکی پارمیس • پاکدشت (مجتمع پزشکی راستین)</span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="max-w-3xl mx-auto mb-8 sm:mb-10 text-right sm:text-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#191c1e] mb-3 sm:mb-4 tracking-tight leading-[1.3]">
              مجله تخصصی سلامت دهان، دندان و زیبایی لبخند
            </h1>
            <p className="text-sm sm:text-base text-[#565e74] leading-relaxed">
              راهنماها، مقالات علمی به زبان ساده و نکات مراقبتی تالیف و بازبینی شده توسط{' '}
              <strong className="text-[#004ac6] font-bold">دکتر انوشیروان شمس پور</strong> جهت
              ارتقای آگاهی سلامت همشهریان در پاکدشت
            </p>
          </div>

          {/* Interactive Search Bar Component */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-md border border-[#c3c6d7]/30 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center flex-1 w-full px-3 gap-2.5">
                <span className="material-symbols-outlined text-[#737686] text-2xl shrink-0">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در مقالات (مثال: هزینه ایمپلنت، مراقبت بعد کشیدن، لمینت...)"
                  className="w-full bg-transparent border-0 focus:ring-0 text-sm sm:text-base text-[#191c1e] placeholder:text-[#737686] p-0 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full hover:bg-[#eceef0] text-[#737686]"
                    title="پاک کردن"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>

              <div className="flex items-center w-full sm:w-auto gap-2 border-t sm:border-t-0 sm:border-r border-[#c3c6d7]/30 pt-2 sm:pt-0 pr-0 sm:pr-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="انتخاب دسته‌بندی مقالات"
                  className="bg-[#f2f4f6] text-[#565e74] text-xs font-bold rounded-full border-0 focus:ring-0 py-2.5 px-3.5 cursor-pointer outline-none"
                >
                  <option value="all">تمام دسته‌ها</option>
                  {blogCategories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-xs sm:text-sm font-bold hover:bg-[#2563eb] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>جستجو</span>
                  <span className="material-symbols-outlined text-sm rotate-180">arrow_back</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trending Tags / Quick Hash Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto text-xs">
            <span className="text-[#565e74] flex items-center gap-1 font-semibold ml-2">
              <span className="material-symbols-outlined text-base text-[#004ac6]">
                trending_up
              </span>
              موضوعات پرجستجو:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className={`px-3 py-1 rounded-full transition-all border ${
                  searchQuery === tag
                    ? 'bg-[#004ac6] text-white border-[#004ac6] font-bold shadow-xs'
                    : 'bg-white text-[#565e74] hover:text-[#004ac6] hover:bg-[#dbe1ff]/30 border-[#c3c6d7]/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. CATEGORY PILLS FILTER BAR (STICKY) ================= */}
      <section className="border-b border-[#c3c6d7]/30 bg-white/95 sticky top-[56px] sm:top-[64px] z-30 backdrop-blur-md shadow-2xs py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
            {blogCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#004ac6] text-white font-bold shadow-xs scale-100'
                      : 'bg-[#f2f4f6] text-[#565e74] hover:text-[#004ac6] hover:bg-[#dbe1ff]/40 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{cat.icon || 'article'}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURED ARTICLE HERO CARD ================= */}
      {!searchQuery && selectedCategory === 'all' && featuredArticle && (
        <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-[#c3c6d7]/30 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl text-right">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image Column */}
              <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] overflow-hidden group">
                <MediaPreview
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  controls={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e]/60 via-transparent to-transparent lg:hidden" />

                {/* Floating Badge Over Image */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[#004ac6] text-xs font-bold shadow-md border border-[#004ac6]/10">
                  <span className="material-symbols-fill material-symbols-outlined text-sm text-amber-500">
                    star
                  </span>
                  <span>{editorPick?.badgeText || 'مقاله منتخب سردبیر / توصیه دکتر شمس پور'}</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-[#191c1e]/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1 lg:hidden">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Meta Tags Header */}
                  <div className="flex flex-wrap items-center gap-3 text-[#565e74] text-xs font-semibold mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#dae2fd] text-[#00174b] font-bold">
                      {featuredArticle.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>{featuredArticle.readTime}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#c3c6d7]" />
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_month</span>
                      <span>{featuredArticle.date}</span>
                    </span>
                    {(featuredArticle.views !== undefined && featuredArticle.views > 0) && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#c3c6d7]" />
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">visibility</span>
                          <span>{featuredArticle.views.toLocaleString('fa-IR')} بازدید</span>
                        </span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-[#c3c6d7]" />
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
                      <span>{getArticleCommentsCount(featuredArticle).toLocaleString('fa-IR')} نظر</span>
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2
                    onClick={() => setActiveArticle(featuredArticle)}
                    className="text-xl sm:text-2xl font-bold text-[#191c1e] mb-3 leading-snug hover:text-[#004ac6] transition-colors cursor-pointer"
                  >
                    {featuredArticle.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-[#565e74] leading-relaxed mb-6">
                    {featuredArticle.summary}
                  </p>

                  {/* Author Accreditation Micro-card */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f4f6] border border-[#c3c6d7]/30 mb-6">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0 bg-[#e6e8ea]">
                      <img
                        src={
                          editorPick?.avatarUrl ||
                          siteImages?.editorPickDoctorAvatar?.url ||
                          siteImages?.doctorProfileImage?.url ||
                          clinicInfo.doctorImage ||
                          CLINIC_INFO.doctorImage
                        }
                        alt={editorPick?.doctorName || featuredArticle.author || clinicInfo.doctorName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-[#191c1e]">
                        {editorPick?.doctorName || featuredArticle.author || clinicInfo.doctorName}
                      </span>
                      <span className="text-[11px] text-[#565e74]">
                        {editorPick?.doctorRole || featuredArticle.authorRole || 'جراح و دندانپزشک • سرپرست درمان کلینیک پارمیس'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-[#c3c6d7]/30">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectArticle) {
                        onSelectArticle(featuredArticle.id);
                      } else {
                        setActiveArticle(featuredArticle);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-xs sm:text-sm font-bold hover:bg-[#2563eb] transition-all group active:scale-95 shadow-sm cursor-pointer"
                  >
                    <span>مطالعه کامل مقاله</span>
                    <span className="material-symbols-outlined text-base rotate-180 group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[#565e74]">
                    <button
                      type="button"
                      onClick={(e) => handleShare(featuredArticle, e)}
                      className="p-2 rounded-full hover:bg-[#eceef0] transition-colors"
                      title="اشتراک‌گذاری"
                      aria-label="اشتراک‌گذاری"
                    >
                      <span className="material-symbols-outlined text-xl">share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= 4. ARTICLES GRID SECTION ================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 text-right">
          <div>
            <span className="text-[#004ac6] text-xs sm:text-sm font-bold flex items-center gap-1.5 mb-1.5">
              <span className="material-symbols-outlined text-lg">menu_book</span>
              جدیدترین مقالات و آموزش‌های تخصصی
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#191c1e]">
              راهنماهای مراقبت، بهداشت و سلامت خانواده
            </h2>
            <p className="text-xs sm:text-sm text-[#565e74] mt-1">
              نمایش {gridArticles.length} مقاله بر اساس دسته‌بندی و واژگان جستجوشده
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#565e74] self-start md:self-auto">
            <span>نمایش بر اساس:</span>
            <button
              type="button"
              onClick={() => setActiveSort('newest')}
              className={`font-bold transition-colors ${
                activeSort === 'newest'
                  ? 'text-[#004ac6] underline underline-offset-4'
                  : 'hover:text-[#004ac6]'
              }`}
            >
              جدیدترین‌ها
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveSort('popular')}
              className={`font-bold transition-colors ${
                activeSort === 'popular'
                  ? 'text-[#004ac6] underline underline-offset-4'
                  : 'hover:text-[#004ac6]'
              }`}
            >
              محبوب‌ترین‌ها
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveSort('recommended')}
              className={`font-bold transition-colors ${
                activeSort === 'recommended'
                  ? 'text-[#004ac6] underline underline-offset-4'
                  : 'hover:text-[#004ac6]'
              }`}
            >
              پیشنهاد پزشک
            </button>
          </div>
        </div>

        {/* Empty Search State */}
        {gridArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#c3c6d7]/30 p-8 shadow-xs">
            <span className="material-symbols-outlined text-5xl text-[#737686] mb-3">
              search_off
            </span>
            <h3 className="text-lg font-bold text-[#191c1e] mb-2">مقاله‌ای یافت نشد</h3>
            <p className="text-sm text-[#565e74] mb-4">
              عبارت دیگری را جستجو فرمایید یا دسته‌بندی فیلتر را به «همه مقالات» تغییر دهید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-full bg-[#004ac6] text-white text-xs font-bold shadow-xs hover:bg-[#2563eb]"
            >
              مشاهده همه مقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {gridArticles.map((article) => {
              return (
                <article
                  key={article.id}
                  onClick={() => {
                    if (onSelectArticle) {
                      onSelectArticle(article.id);
                    } else {
                      setActiveArticle(article);
                    }
                  }}
                  className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-xs overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-[#eceef0]">
                      <MediaPreview
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        controls={false}
                      />
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#004ac6] text-[11px] font-bold shadow-xs">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[#565e74] text-xs mb-2.5 flex-wrap">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{article.readTime}</span>
                        {article.date && (
                          <>
                            <span>•</span>
                            <span>{article.date}</span>
                          </>
                        )}
                        {(article.views !== undefined && article.views > 0) && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 font-medium">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>{article.views.toLocaleString('fa-IR')}</span>
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-0.5 font-medium">
                          <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
                          <span>{getArticleCommentsCount(article).toLocaleString('fa-IR')} نظر</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2 leading-snug group-hover:text-[#004ac6] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#565e74] line-clamp-3 leading-relaxed mb-4">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between text-xs">
                    <span className="text-[#565e74] font-medium truncate max-w-[170px]">
                      {article.author || 'دکتر انوشیروان شمس پور'}
                    </span>
                    <span className="text-[#004ac6] font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>ادامه مطلب</span>
                      <span className="material-symbols-outlined text-sm rotate-180">arrow_back</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= 5. QUICK HEALTH TIPS (3 CONCERNS OF PATIENTS) ================= */}
      <section className="py-12 bg-[#f2f4f6]/80 border-y border-[#c3c6d7]/30 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2fd] text-[#004ac6] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-base">tips_and_updates</span>
              <span>دانستنی‌های سریع و کاربردی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1e] mb-2">
              پاسخ به ۳ دغدغه مهم بیماران
            </h2>
            <p className="text-xs sm:text-sm text-[#565e74]">
              راهنماهای کوتاه و کاربردی جهت تصمیم‌گیری آگاهانه درباره سلامت دهان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            {QUICK_HEALTH_TIPS.map((tip) => {
              const isError = tip.badgeType === 'error';
              const isPrimary = tip.badgeType === 'primary';
              return (
                <div
                  key={tip.id}
                  className="bg-white p-6 rounded-3xl shadow-xs border border-[#c3c6d7]/30 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                        isError
                          ? 'bg-rose-100 text-rose-600'
                          : isPrimary
                          ? 'bg-[#dbe1ff] text-[#004ac6]'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{tip.icon}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#191c1e] mb-2 leading-snug">
                      {tip.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed mb-4">
                      {tip.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#c3c6d7]/20">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isError
                          ? 'text-rose-600'
                          : isPrimary
                          ? 'text-[#004ac6]'
                          : 'text-emerald-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isError ? 'warning' : 'verified'}
                      </span>
                      {tip.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 6. SMS HEALTH TIPS & DISCOUNT NEWSLETTER BANNER ================= */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-l from-[#004ac6] to-[#2563eb] text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl text-right">
          {/* Background graphics */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-xs">
                <span className="material-symbols-outlined text-base">mail</span>
                <span>عضویت در باشگاه سلامت و خبرنامه کلینیک پارمیس</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold mb-3 leading-snug">
                نکات سلامتی هفتگی و تخفیف چکاپ دوره‌ای
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                با ثبت شماره تماس خود، جدیدترین مقالات مراقبتی دکتر شمس پور و کد تخفیف ویژه ویزیت و
                عکس‌برداری اولیه را در تلفن همراه خود دریافت نمایید.
              </p>
            </div>

            <div className="lg:col-span-5">
              {newsletterSuccess ? (
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-emerald-300">
                    check_circle
                  </span>
                  <div>
                    <h4 className="text-sm font-bold">عضویت با موفقیت انجام شد</h4>
                    <p className="text-xs text-white/80 mt-0.5">
                      پیامک خوش‌آمدگویی و کد تخفیف برای شماره شما ارسال خواهد شد.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="bg-white p-2 rounded-2xl sm:rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="flex items-center w-full px-3 gap-2">
                    <span className="material-symbols-outlined text-[#737686] text-xl">
                      phone_android
                    </span>
                    <input
                      type="tel"
                      value={newsletterPhone}
                      onChange={(e) => setNewsletterPhone(e.target.value)}
                      placeholder="شماره موبایل (مثال: ۰۹۱۲...)"
                      dir="ltr"
                      required
                      className="w-full bg-transparent border-0 focus:ring-0 text-[#191c1e] text-xs sm:text-sm placeholder:text-[#737686] p-0 text-right outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-xs sm:text-sm font-bold hover:bg-[#2563eb] active:scale-95 transition-all whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    عضویت رایگان
                  </button>
                </form>
              )}
              <span className="block text-center sm:text-right text-[11px] text-white/75 mt-2 pr-2">
                * اطلاعات شما نزد کلینیک محفوظ است و هیچ‌گونه پیامک تبلیغاتی نامربوط ارسال نمی‌شود.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. CLINIC ACCESS & DIRECT APPOINTMENT CTA BANNER ================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-right">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c3c6d7]/30 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#dae2fd] text-[#004ac6] shrink-0 flex items-center justify-center">
              <span className="material-symbols-fill material-symbols-outlined text-3xl">
                pin_drop
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#004ac6]/10 text-[#004ac6] text-xs font-bold">
                  دسترسی آسان در پاکدشت
                </span>
                <span className="text-[#565e74] text-xs">نوبت‌دهی همه روزه عصرها</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#191c1e] mb-1.5">
                نیاز به ویزیت حضوری یا مشاوره درمان دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
                پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم • کلینیک دندان‌پزشکی پارمیس
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#004ac6] text-white text-xs sm:text-sm font-bold hover:bg-[#2563eb] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>تماس مستقیم: {CLINIC_INFO.phoneDisplay}</span>
            </a>
            <a
              href={(clinicInfo as any)?.whatsappUrl || (clinicInfo as any)?.whatsappLink || 'https://wa.me/989215395923'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#004ac6] text-[#004ac6] text-xs sm:text-sm font-bold hover:bg-[#dbe1ff]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>مشاوره و ارسال عکس در واتساپ</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 8. FULL ARTICLE READER MODAL ================= */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#eceef0] mb-4">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-9 h-9 rounded-full bg-[#eceef0] hover:bg-[#c3c6d7] flex items-center justify-center text-[#191c1e] transition-colors cursor-pointer"
                aria-label="بستن پنجره"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              <span className="text-xs font-bold text-[#004ac6] bg-[#dbe1ff] px-3 py-1 rounded-full">
                {activeArticle.category}
              </span>
            </div>

            {/* Article Image / Video */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-[#eceef0]">
              <MediaPreview
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                controls={true}
              />
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-[#565e74] mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{activeArticle.readTime}</span>
              </span>
              {activeArticle.date && (
                <>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </>
              )}
              {(activeArticle.views !== undefined && activeArticle.views > 0) && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 font-medium">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>{activeArticle.views.toLocaleString('fa-IR')}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-0.5 font-medium">
                <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
                <span>{getArticleCommentsCount(activeArticle).toLocaleString('fa-IR')} نظر</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#191c1e] mb-4 leading-snug">
              {activeArticle.title}
            </h3>

            {/* Author Micro Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f4f6] border border-[#c3c6d7]/30 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0 bg-[#e6e8ea]">
                <img
                  src={clinicInfo?.doctorImage || CLINIC_INFO.doctorImage}
                  alt={activeArticle.author || clinicInfo?.doctorName || CLINIC_INFO.doctorName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs sm:text-sm font-bold text-[#191c1e]">
                  {activeArticle.author || clinicInfo?.doctorName || CLINIC_INFO.doctorName}
                </span>
                <span className="text-[11px] text-[#565e74]">
                  {activeArticle.authorRole || 'جراح و دندان‌پزشک کلینیک پارمیس'}
                </span>
              </div>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#565e74] leading-relaxed mb-6">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Clinical Tips Highlight Box */}
            {activeArticle.tips && activeArticle.tips.length > 0 && (
              <div className="bg-[#f2f4f6] p-5 rounded-2xl border border-[#c3c6d7]/30 mb-6">
                <h4 className="text-sm font-bold text-[#004ac6] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span>توصیه‌های کلیدی و مراقبت‌های دندان‌پزشکی:</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#191c1e]">
                  {activeArticle.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#004ac6] font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#eceef0] flex flex-wrap items-center justify-between gap-3">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                onClick={() => setActiveArticle(null)}
                className="bg-[#004ac6] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-[#2563eb] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>تماس تلفنی جهت مشاوره این درمان</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="bg-[#f2f4f6] text-[#191c1e] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-[#e6e8ea] transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
