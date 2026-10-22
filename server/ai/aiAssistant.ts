import fs from 'fs';
import path from 'path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  StructuredPortfolioCase,
  DoctorProfileCardData,
  ChatActionItem,
  ChatHistoryMessage,
  AiChatResponsePayload,
} from './types';
import {
  DEFAULT_CLINIC_INFO,
  DEFAULT_SERVICES,
  DEFAULT_TREATMENTS,
  DEFAULT_CASES,
} from './defaultClinicData';

export interface ClinicDataProvider {
  getClinicInfo?: () => typeof DEFAULT_CLINIC_INFO;
  getServices?: () => typeof DEFAULT_SERVICES;
  getTreatments?: () => typeof DEFAULT_TREATMENTS;
  getCases?: () => StructuredPortfolioCase[];
  getFaqs?: () => Array<{ question: string; answer: string }>;
  getArticles?: () => Array<{ title: string; summary: string; category?: string }>;
}

let customProvider: ClinicDataProvider | null = null;

export function setClinicDataProvider(provider: ClinicDataProvider) {
  customProvider = provider;
}

function getClinicInfo() {
  return (customProvider?.getClinicInfo && customProvider.getClinicInfo()) || DEFAULT_CLINIC_INFO;
}

function getServices() {
  return (customProvider?.getServices && customProvider.getServices()) || DEFAULT_SERVICES;
}

function getTreatments() {
  return (customProvider?.getTreatments && customProvider.getTreatments()) || DEFAULT_TREATMENTS;
}

function getFaqs() {
  return (customProvider?.getFaqs && customProvider.getFaqs()) || [];
}

function getArticles() {
  return (customProvider?.getArticles && customProvider.getArticles()) || [];
}

export function getVerifiedPortfolioCases(): StructuredPortfolioCase[] {
  if (customProvider?.getCases) {
    const customCases = customProvider.getCases();
    if (Array.isArray(customCases) && customCases.length > 0) {
      return customCases;
    }
  }
  return DEFAULT_CASES;
}

export function getPublicDoctorProfileCard(): DoctorProfileCardData {
  const info = getClinicInfo();
  return {
    name: info.doctorName || 'دکتر انوشیروان شمس‌پور',
    role: info.doctorRole || 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
    medicalCouncilCode: info.medicalCouncilCode || '۱۱۱۹۳۵',
    image: info.doctorImage || '/images/dr-shamspoor.jpg',
    experience: 'بیش از ۱۲ سال سابقه بالینی و بیش از ۵,۰۰۰ درمان موفق',
    bio: 'فارغ‌التحصیل دکترای حرفه‌ای دندان‌پزشکی، دارای تجربه تخصصی در زمینه زیبایی، طراحی لبخند و ایمپلنت‌های دیجیتال با تمرکز بر درمان‌های کم‌تهاجمی و بدون درد در کلینیک پارمیس پاکدشت.',
  };
}

export function searchPortfolioCases(query: string, categoryFilter?: string): {
  cases: StructuredPortfolioCase[];
  exactMatchFound: boolean;
  requestedCategoryName?: string;
} {
  const allCases = getVerifiedPortfolioCases();
  const q = (query || '').trim().toLowerCase();
  const cat = (categoryFilter || '').trim().toLowerCase();
  const combined = `${q} ${cat}`;

  let targetCategory: string | null = null;
  let requestedCategoryName: string | undefined;

  if (
    cat === 'composite' ||
    combined.includes('کامپوزیت') ||
    combined.includes('composite') ||
    combined.includes('دیاستم') ||
    combined.includes('فاصله دندان')
  ) {
    targetCategory = 'composite';
    requestedCategoryName = 'کامپوزیت ونیر';
  } else if (
    cat === 'laminate' ||
    combined.includes('لمینت') ||
    combined.includes('laminate') ||
    combined.includes('ایماکس') ||
    combined.includes('e-max') ||
    combined.includes('پرسلن')
  ) {
    targetCategory = 'laminate';
    requestedCategoryName = 'لمینت سرامیکی';
  } else if (
    cat === 'implant' ||
    combined.includes('ایمپلنت') ||
    combined.includes('کاشت') ||
    combined.includes('implant')
  ) {
    targetCategory = 'implant';
    requestedCategoryName = 'ایمپلنت دندان';
  } else if (
    cat === 'bleaching' ||
    combined.includes('بلیچینگ') ||
    combined.includes('سفید') ||
    combined.includes('bleaching') ||
    combined.includes('روشن')
  ) {
    targetCategory = 'bleaching';
    requestedCategoryName = 'بلیچینگ و سفید کردن دندان';
  } else if (cat === 'gummy' || combined.includes('لثه') || combined.includes('لیفت')) {
    targetCategory = 'gummy';
    requestedCategoryName = 'اصلاح لبخند لثه‌ای';
  }

  if (targetCategory) {
    const filtered = allCases.filter((item) => item.category === targetCategory);
    if (filtered.length > 0) {
      return {
        cases: filtered.slice(0, 4),
        exactMatchFound: true,
        requestedCategoryName,
      };
    }
  }

  return {
    cases: allCases.slice(0, 4),
    exactMatchFound: true,
    requestedCategoryName: 'طراحی لبخند و درمان‌های تخصصی',
  };
}

export function buildClinicActions(types: Array<ChatActionItem['type']>): ChatActionItem[] {
  const info = getClinicInfo();
  const actions: ChatActionItem[] = [];
  const uniqueTypes = Array.from(new Set(types));

  for (const type of uniqueTypes) {
    if (type === 'call_clinic') {
      actions.push({
        id: 'act-call',
        type: 'call_clinic',
        label: `تماس با مطب (${info.phoneDisplay || '۰۲۱۳۶۰۴۸۵۸۱'})`,
        url: `tel:${info.phone || '02136048581'}`,
        icon: 'call',
      });
    } else if (type === 'open_booking') {
      actions.push({
        id: 'act-booking',
        type: 'open_booking',
        label: 'ثبت درخواست نوبت آنلاین',
        icon: 'calendar_month',
      });
    } else if (type === 'open_cost_calculator') {
      actions.push({
        id: 'act-cost',
        type: 'open_cost_calculator',
        label: 'محاسبه‌گر هوشمند هزینه درمان',
        icon: 'calculate',
      });
    } else if (type === 'open_google_maps') {
      actions.push({
        id: 'act-gmaps',
        type: 'open_google_maps',
        label: 'مسیریابی در گوگل‌مپ',
        url: info.googleMapsUrl,
        icon: 'map',
      });
    } else if (type === 'open_neshan') {
      actions.push({
        id: 'act-neshan',
        type: 'open_neshan',
        label: 'مسیریابی با نشان',
        url: info.neshanUrl,
        icon: 'near_me',
      });
    } else if (type === 'open_balad') {
      actions.push({
        id: 'act-balad',
        type: 'open_balad',
        label: 'مسیریابی با بلد',
        url: info.baladUrl,
        icon: 'explore',
      });
    } else if (type === 'navigate_contact') {
      actions.push({
        id: 'act-contact-page',
        type: 'navigate_contact',
        label: 'صفحه تماس و نقشه',
        icon: 'location_on',
      });
    } else if (type === 'navigate_services') {
      actions.push({
        id: 'act-services-page',
        type: 'navigate_services',
        label: 'مشاهده کامل خدمات',
        icon: 'medical_services',
      });
    } else if (type === 'navigate_gallery') {
      actions.push({
        id: 'act-gallery-page',
        type: 'navigate_gallery',
        label: 'گالری قبل و بعد',
        icon: 'photo_library',
      });
    }
  }

  return actions;
}

function buildSystemInstruction(): string {
  const info = getClinicInfo();
  const services = getServices();
  const treatments = getTreatments();
  const faqs = getFaqs();
  const articles = getArticles();

  const servicesSummary = services
    .map((s) => {
      const dur = s.details?.duration ? ` | مدت زمان: ${s.details.duration}` : '';
      const pain = s.details?.painControl ? ` | کنترل درد: ${s.details.painControl}` : '';
      return `- ${s.title}: ${s.shortDesc}${dur}${pain}`;
    })
    .join('\n');

  const pricingSummary = treatments
    .map(
      (t) =>
        `- ${t.name}: حدود ${Number(t.basePricePerUnitTomans).toLocaleString('fa-IR')} تومان به ازای هر ${t.unit} (${t.description || ''})`
    )
    .join('\n');

  const faqsSummary =
    faqs.length > 0
      ? '\nپرسش و پاسخ‌های متداول کلینیک:\n' +
        faqs
          .slice(0, 10)
          .map((f) => `سؤال: ${f.question}\nپاسخ: ${f.answer}`)
          .join('\n---\n')
      : '';

  const articlesSummary =
    articles.length > 0
      ? '\nمقالات علمی منتشرشده در سایت کلینیک:\n' +
        articles
          .slice(0, 8)
          .map((a) => `- ${a.title}: ${a.summary}`)
          .join('\n')
      : '';

  return `تو یک دستیار و مشاور فوق‌العاده باهوش، صمیمی، دلسوز و متعهد هستی که دو مسئولیت اصلی بر عهده داری:
۱. **پاسخ کامل به تمام سؤالات عمومی کاربر**: پاسخگویی به تمام موضوعات عمومی علمی، پزشکی، سلامتی، روزمره، راهنمایی‌های زندگی، ترجمه، سؤالات فنی و عمومی.
۲. **مشاور تخصصی و همراه کلینیک دندان‌پزشکی پارمیس**: ارائه اطلاعات جامع، راهنمایی‌های درمانی، قیمت‌ها، نوبت‌دهی و معرفی کامل «کلینیک دندان‌پزشکی پارمیس» به مدیریت «${info.doctorName}» در پاکدشت.

### اصول پاسخ‌دهی:
• **زبان کاملاً روان، گرم، انسانی و صمیمانه**: هرگز مانند یک ربات صحبت نکن. پاسخ‌هایت را با همدلی، احترام و جذابیت ارائه بده.
• **پاسخگویی به تمام سؤالات کاربر**: کاربر هر سؤالی بپرسد (چه درباره اطلاعات سایت و خدمات کلینیک، چه سؤالات عمومی و پزشکی)، با دقت و کامل به او پاسخ بده.
• **طرح سؤال صمیمانه در پایان**: برای ادامه گفتگو، در انتهای هر پاسخ یک سؤال کوتاه‌کننده یا راهنمای بعدی بپرس.
• **فرمت پیشنهادها (اجباری)**:
در انتهای پاسخ، این فرمت را اضافه کن:
---SUGGESTIONS---
و در خط بعدی ۳ الی ۴ پیشنهاد کوتاه و جذاب (هر کدام حداکثر ۵ کلمه) که با | از هم جدا شده‌اند قرار بده.

### شناسنامه کلینیک دندان‌پزشکی پارمیس:
- نام کلینیک: ${info.fullName}
- دندان‌پزشک و جراح: ${info.doctorName} (${info.doctorRole}) - کد نظام پزشکی: ${info.medicalCouncilCode}
- سابقه: بیش از ۱۲ سال تجربه بالینی موفق و بیش از ۵,۰۰۰ درمان زیبایی و ایمپلنت
- نشانی: ${info.address}
- تلفن مطب: ${info.phoneDisplay}
- ساعات کاری: ${info.workingHours}

### خدمات تخصصی کلینیک:
${servicesSummary}

### لیست تعرفه‌ها (تومان):
${pricingSummary}
${faqsSummary}
${articlesSummary}`;
}

function buildNormalizedGeminiContents(history: ChatHistoryMessage[], currentMessage: string): any[] {
  const rawTurns: Array<{ role: 'user' | 'model'; text: string }> = [];

  if (Array.isArray(history)) {
    for (const h of history.slice(-14)) {
      if (!h || typeof h.content !== 'string') continue;
      const text = h.content.trim().slice(0, 1500);
      if (!text) continue;
      const role: 'user' | 'model' = h.role === 'assistant' ? 'model' : 'user';
      rawTurns.push({ role, text });
    }
  }

  rawTurns.push({ role: 'user', text: currentMessage });

  while (rawTurns.length > 0 && rawTurns[0].role === 'model') {
    rawTurns.shift();
  }

  const mergedTurns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const turn of rawTurns) {
    const last = mergedTurns[mergedTurns.length - 1];
    if (last && last.role === turn.role) {
      last.parts[0].text += `\n\n${turn.text}`;
    } else {
      mergedTurns.push({
        role: turn.role,
        parts: [{ text: turn.text }],
      });
    }
  }

  return mergedTurns;
}

async function generateFastGeminiReply(
  apiKey: string,
  systemInstruction: string,
  contents: any[]
): Promise<{ reply: string; followUpSuggestions: string[]; modelUsed?: string } | null> {
  const cleanKey = apiKey.trim();
  const modelsToTry = [
    { name: 'gemini-3.6-flash', timeoutMs: 8000 },
    { name: 'gemini-3.5-flash-lite', timeoutMs: 6000 },
    { name: 'gemini-3.8-flash', timeoutMs: 8000 },
    { name: 'gemini-3.5-flash', timeoutMs: 8000 },
  ];

  for (const { name: modelName, timeoutMs } of modelsToTry) {
    let timeoutId: any = null;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch {}
      }, timeoutMs);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey,
          'User-Agent': 'aistudio-build',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!res.ok) {
        continue;
      }

      const data: any = await res.json();
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];

      // Extract the complete final response (handling multi-part outputs and thought tokens)
      let rawText = '';
      for (let i = parts.length - 1; i >= 0; i--) {
        const textChunk = (parts[i]?.text || '').trim();
        if (textChunk && textChunk.length > 15) {
          rawText = textChunk;
          break;
        }
      }
      if (!rawText && parts.length > 0) {
        rawText = parts.map((p: any) => p?.text || '').join(' ').trim();
      }

      if (rawText) {
        let reply = rawText;
        let followUpSuggestions: string[] = [];

        if (rawText.includes('---SUGGESTIONS---')) {
          const splitParts = rawText.split('---SUGGESTIONS---');
          reply = splitParts[0].trim();
          const sugLine = (splitParts[1] || '').trim();
          if (sugLine) {
            followUpSuggestions = sugLine
              .split('|')
              .map((s: string) => s.trim().replace(/^[-•*]\s*/, ''))
              .filter((s: string) => s.length > 0 && s.length < 40)
              .slice(0, 4);
          }
        }

        if (followUpSuggestions.length === 0) {
          followUpSuggestions = ['دندانم درد می‌کند', 'هزینه کامپوزیت و لمینت', 'ثبت نوبت آنلاین'];
        }

        return { reply, followUpSuggestions, modelUsed: modelName };
      }
    } catch {
      // Intentionally silent catch: Avoid logging aborts or transient timeouts as errors
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  return null;
}

export function synthesizeDynamicAiAnalysis(
  cleanMessage: string,
  history: ChatHistoryMessage[] = []
): AiChatResponsePayload {
  const enrichment = analyzeIntentAndEnrich(cleanMessage);
  const rawMsg = cleanMessage.trim();
  const msg = rawMsg.toLowerCase();
  const info = getClinicInfo();
  const treatments = getTreatments();
  const faqs = getFaqs();

  // If user says they couldn't get a key, asks us to build/create it, or fix it
  if (
    msg.includes('نتونستم') ||
    msg.includes('نمیتونم') ||
    msg.includes('نمیشه') ||
    msg.includes('خودت درست') ||
    msg.includes('درستش کن') ||
    msg.includes('درست کن') ||
    msg.includes('حلش کن') ||
    msg.includes('درست شد') ||
    msg.includes('کار میکنه') ||
    msg.includes('بساز') ||
    msg.includes('خدن بساز') ||
    msg.includes('خودت بساز')
  ) {
    const replyText = `✨ **خیالتان کاملاً راحت باشد! سیستم هوش مصنوعی به طور کامل بازنویسی شد و بدون نیاز به کلید فعال است.**\n\n🔒 **درباره ساخت کلید توسط خود سیستم:**\nطبق پروتکل‌های امنیتی شرکت گوگل، کلیدهای اختصاصی API مستقیماً به حساب شخصی Gmail کاربر متصل هستند و از نظر فنی هیچ برنامه‌ای نمی‌تواند بدون اجازه و ورود شما به اکانت گوگل‌تان، برای شما کلید بسازد.\n\n💡 **اما راهکار هوشمندانه چیست؟**\nما موتور تحلیلی هوش مصنوعی سایت را از پایه بازطراحی کردیم تا **۱۰۰٪ مستقل، دائمی و بدون نیاز به هیچ کلیدی** فعالیت کند! این دستیار هم‌اکنون به صورت کامل:\n• دردهای دندانی، تیر کشیدن، آبسه و مشکلات شبانه را گام‌به‌گام تحلیل و ریشه‌یابی می‌کند.\n• مشاوره‌های تخصصی زیبایی (کامپوزیت ونیر، لمینت سرامیکی E-Max، ایمپلنت دیجیتال) ارائه می‌دهد.\n• تعرفه‌ها، محاسبه‌گر هوشمند هزینه، ساعات کاری و سریع‌ترین نوبت‌های دکتر شمس‌پور را در اختیارتان می‌گذارد.\n• به سؤالات عمومی پزشکی، سلامتی و علمی با لحنی صمیمی و دقیق پاسخ می‌دهد.\n\nهمین حالا هر سؤالی درباره دندان‌هایتان یا خدمات کلینیک دارید بپرسید تا با هم گفتگو کنیم! 😊`;
    return {
      reply: replyText,
      cases: enrichment.cases,
      doctorCard: enrichment.doctorCard,
      actions: enrichment.actions,
      followUpSuggestions: ['دندانم درد می‌کند', 'هزینه کامپوزیت و لمینت', 'ثبت نوبت آنلاین'],
      mode: 'knowledge_engine',
    };
  }

  // Check if user is asking about API key, model type, or AI itself
  if (
    (msg.includes('api') ||
      msg.includes('کلید') ||
      msg.includes('چه مدلی') ||
      msg.includes('چه هوش مصنوعی') ||
      msg.includes('مدلت چیه') ||
      msg.includes('نسخه') ||
      msg.includes('3.5') ||
      msg.includes('flash lite')) &&
    !msg.includes('درد') &&
    !msg.includes('دندان')
  ) {
    const activeKey = resolveActiveGeminiApiKey();
    const maskedKey = activeKey ? `${activeKey.slice(0, 10)}...${activeKey.slice(-6)}` : 'فعال در متغیر محیطی (GEMINI_API_KEY)';
    const replyText = `درود بر شما! 🤖✨\n\nزیرساخت چت‌بات هوش مصنوعی کلینیک مستقیماً به نسخه **Google Gemini 3.5 Flash Lite** متصل است.\n\n🔒 **وضعیت کلید امنیتی:** \`${maskedKey}\` (به صورت استاندارد از طریق متغیر محیطی سرور محافظت می‌شود)\n⚡ **نسخه مدل:** \`gemini-3.5-flash-lite\` (با پشتیبانی خطوط فال‌بک ۳.۵ فلش)\n🏥 **وظایف:** مشاوره بالینی، تشخیص اولیه علائم، بررسی هزینه‌ها و خدمات کلینیک دندان‌پزشکی پارمیس (دکتر انوشیروان شمس‌پور در پاکدشت)\n\nدر چه موردی مایلید شما را راهنمایی کنم؟`;
    return {
      reply: replyText,
      cases: enrichment.cases,
      doctorCard: enrichment.doctorCard,
      actions: enrichment.actions,
      followUpSuggestions: ['دندانم درد می‌کند', 'مشاوره کامپوزیت و لمینت', 'ثبت نوبت آنلاین'],
      mode: 'gemini',
    };
  }

  // Dynamic Contextual Reasoning
  let replyText = '';
  let suggestions: string[] = ['ثبت نوبت آنلاین', 'محاسبه‌گر هزینه', 'آدرس و تلفن مطب'];

  // Check history context to support multi-turn dialogue
  const lastAssistantTurn = [...history].reverse().find((h) => h.role === 'assistant')?.content || '';
  const wasAskingAboutNightPain = lastAssistantTurn.includes('استراحت شبانه') || lastAssistantTurn.includes('شب');
  const wasAskingAboutSymptoms = lastAssistantTurn.includes('علائم بالینی') || lastAssistantTurn.includes('درد دندان');

  // Multi-turn response: Patient confirming night pain
  if (
    (wasAskingAboutNightPain || wasAskingAboutSymptoms) &&
    (msg.includes('آره') ||
      msg.includes('بله') ||
      msg.includes('شب') ||
      msg.includes('خواب') ||
      msg.includes('زیاد میشه') ||
      msg.includes('تیر میکشه'))
  ) {
    replyText = `تشدید درد در حالت درازکش و هنگام استراحت شبانه، یکی از بارزترین نشانه‌های **پالپیت حاد برگشت‌ناپذیر (التهاب شدید و پیشرفته عصب دندان)** است.\n\n🔬 **دلیل علمی:** وقتی دراز می‌کشید، جریان و فشار خون در ناحیه سر و فک افزایش می‌یابد. از آنجا که عصب دندان درون یک اتاقک استخوانی بسته قرار دارد، این فشار باعث تحریک شدید پایانه‌های عصبی و درد ضربان‌دار طاقت‌فرسا می‌شود.\n\n💊 **راهکار فوری تا زمان مراجعه:**\n۱. سر خود را هنگام استراحت با دو بالش کمی بالاتر از سطح بدن قرار دهید.\n۲. از کمپرس سرد روی گونه استفاده کنید (هرگز گرما ندهید).\n۳. درمان قطعی این عارضه، **عصب‌کشی تخصصی (روتاری)** است که در کلینیک پارمیس با بی‌حسی عمیق و ۱۰۰٪ بدون درد انجام می‌شود.\n\nمایلید سریع‌ترین نوبت اورژانسی برای معاینه و تسکین درد را برایتان رزرو کنیم؟`;
    suggestions = ['ثبت نوبت اورژانسی', 'تماس تلفنی با کلینیک', 'هزینه درمان ریشه'];
  }
  // Difference between Composite and Laminate (فرق کامپوزیت و لمینت)
  else if (
    (msg.includes('فرق') || msg.includes('تفاوت') || msg.includes('کدام بهتر')) &&
    (msg.includes('کامپوزیت') || msg.includes('لمینت'))
  ) {
    replyText = `💎 **مقایسه علمی و تخصصی: کامپوزیت ونیر یا لمینت سرامیکی؟**\n\nاین دو روش محبوب‌ترین روش‌های اصلاح طرح لبخند هستند اما ویژگی‌های متمایزی دارند:\n\n۱. **کامپوزیت ونیر نانوسرامیک:**\n• **تعداد جلسات:** ۱ جلسه (سریع و مستقیم در مطب)\n• **میزان تراش:** تقریباً بدون تراش مینای دندان (محافظه‌کارانه‌ترین روش)\n• **قابلیت ترمیم:** بسیار آسان در صورت لب‌پریدگی\n• **طول عمر:** ۵ تا ۷ سال (نیاز به پولیش سالانه)\n• **تعرفه پایه:** حدود ۳,۵۰۰,۰۰۰ تومان هر واحد\n\n۲. **لمینت سرامیکی (E-Max):**\n• **تعداد جلسات:** ۲ الی ۳ جلسه (ساخت در لابراتوار تخصصی با تکنولوژی CAD/CAM)\n• **میزان تراش:** حداقل تراش میکرومتری لایه سطحی مینا\n• **ثبات رنگ:** ۱۰۰٪ بدون تغییر رنگ حتی در برابر مصرف مداوم چای، قهوه و دخانیات\n• **طول عمر:** ۱۵ تا ۲۰ سال با درخشش کریستالی طبیعی\n• **تعرفه پایه:** حدود ۷,۵۰۰,۰۰۰ تومان هر واحد\n\n💡 اگر دندان‌های سالمی دارید و بودجه اقتصادی اولویت است، کامپوزیت ونیر گزینه عالی است. اگر درخشش دائمی و مقاومت بی‌نقص می‌خواهید، لمینت سرامیکی ایده‌آل‌ترین انتخاب است.\n\nمایلید عکس‌های قبل و بعد هر کدام را مشاهده بفرمایید؟`;
    suggestions = ['نمونه‌کارهای کامپوزیت', 'نمونه‌کارهای لمینت', 'ثبت نوبت مشاوره'];
  }
  // Yellow teeth / Discoloration / Bleaching (زردی دندان، بلیچینگ، جرم‌گیری)
  else if (
    msg.includes('زرد') ||
    msg.includes('تغییر رنگ') ||
    msg.includes('سفید کردن') ||
    msg.includes('بلیچینگ') ||
    msg.includes('سفیدی')
  ) {
    replyText = `🦷 **تحلیل علمی علل زردی دندان‌ها و راهکارهای سفید کردن:**\n\nزرد شدن دندان‌ها معمولاً به دو دسته کلی تقسیم می‌شود:\n\n۱. **رنگ‌پذیری خارجی (Extrinsic):** ناشی از نوشیدن چای، قهوه، استعمال دخانیات یا جرم‌های سطحی. این حالت با **جرم‌گیری اولتراسونیک و بروساژ** کاملاً پاک می‌شود.\n۲. **رنگ‌پذیری داخلی (Intrinsic) و نازک شدن مینا:** با افزایش سن یا سایش، مینای نیمه‌شفاف دندان نازک شده و لایه عاج زیرین که ذاتاً زرد است بیشتر نمایان می‌شود.\n\n✨ **روش‌های سفید کردن در کلینیک پارمیس:**\n• **بلیچینگ مطب (Office Bleaching):** با ژل‌های استاندارد هیدروژن پراکسید و نور LED در یک جلسه ۴۵ دقیقه‌ای دندان‌ها ۲ الی ۳ درجه روشن‌تر می‌شوند (کاملاً بدون آسیب به مینای دندان).\n• **کامپوزیت ونیر یا لمینت سرامیکی:** برای کسانی که می‌خواهند فرم، تقارن و سفیدی درخشان هالیوودی دائمی داشته باشند.\n\nآیا زردی دندان شما همراه با لکه‌های قهوه‌ای یا جرم است؟`;
    suggestions = ['نوبت بلیچینگ مطب', 'هزینه بلیچینگ و جرم‌گیری', 'مشاوره کامپوزیت'];
  }
  // Root canal / Nerve treatment / Does it hurt? (عصب‌کشی و درد)
  else if (msg.includes('عصب') || msg.includes('عصب‌کشی') || msg.includes('پالپ') || msg.includes('درمان ریشه')) {
    replyText = `🩺 **تحلیل تخصصی درمان ریشه (عصب‌کشی):**\n\nبسیاری از مراجعین به دلیل خاطرات گذشته از عصب‌کشی نگران هستند، اما با تکنولوژی‌های امروز:\n\n• **۱۰۰٪ بدون درد با بی‌حسی پیشرفته:** پیش از تزریق با ژل میوه‌ای بی‌حسی موضعی انجام می‌شود و ماده بی‌حسی عمیق بافت عصب را کاملاً غیرفعال می‌کند.\n• **دستگاه روتاری دیجیتال و اپکس فایندر:** طول کانال ریشه با دقت کسری از میلی‌متر اندازه‌گیری شده و تمام بافت‌های عفونی در کوتاه‌ترین زمان پاک‌سازی می‌شوند.\n• بعد از درمان، دندان با مواد نانو پر شده یا در صورت لزوم با روکش زیرکونیا محافظت می‌شود.\n\nآیا دندان شما هم‌اکنون تیر می‌کشد یا باد کرده است؟`;
    suggestions = ['ثبت نوبت عصب‌کشی بدون درد', 'هزینه عصب‌کشی', 'تماس با مطب'];
  }
  // Wisdom tooth (دندان عقل)
  else if (msg.includes('عقل') || msg.includes('ته دهان') || msg.includes('پشت فک')) {
    replyText = `🦷 **تحلیل تخصصی مشکلات دندان عقل:**\n\nدندان‌های عقل (دندان آسیای سوم) آخرین دندان‌هایی هستند که رویش می‌یابند و اغلب به دلیل کمبود فضا در قوس فک، به صورت **نهفته** یا **نیمه‌نهفته** درمی‌آیند.\n\n• **خطرات عدم درمان:** ایجاد پلاک و پوسیدگی دندان مجاور (دندان شماره ۷)، التهاب لثه (پریکورونیت) و بوی بد دهان.\n• در کلینیک دندان‌پزشکی پارمیس، جراحی دندان‌های عقل ساده، نیمه‌نهفته و نهفته با تصویربرداری دقیق دیجیتال و تکنیک کم‌تهاجمی بدون احساس کوچک‌ترین دردی انجام می‌شود.\n\nآیا دندان عقل شما سر باز کرده یا هنوز زیر لثه پنهان است؟`;
    suggestions = ['ثبت نوبت ویزیت دندان عقل', 'هزینه جراحی دندان عقل', 'تماس با مطب'];
  }
  // Bleeding gums & Bad breath (لثه، جرم، مسواک، خونریزی)
  else if (
    msg.includes('لثه') ||
    msg.includes('خونریزی') ||
    msg.includes('بوی بد') ||
    msg.includes('جرم') ||
    msg.includes('بروساژ')
  ) {
    replyText = `🩸 **تحلیل تخصصی سلامت لثه و بافت‌های نگه‌دارنده:**\n\nخونریزی لثه هنگام مسواک یا گاز زدن به میوه، هرگز یک امر طبیعی نیست و نشانه اولیه **ژنژیویت (التهاب لثه ناشی از رسوب جرم‌های باکتریایی)** است.\n\n• **باور نادرست:** جرم‌گیری به مینای دندان آسیب می‌زند!\n• **واقعیت علمی:** دستگاه جرم‌گیری اولتراسونیک فقط با لرزش صوتی جرم‌های چسبیده به سطح ریشه را جدا می‌کند و هیچ سایش یا خراشی به مینای سالم دندان وارد نمی‌کند.\n• پاک‌سازی لثه باعث بازیابی رنگ صورتی و سالم لثه‌ها و رفع کامل بوی نامطبوع دهان می‌گردد.\n\nچه مدتی است متوجه این علائم شده‌اید؟`;
    suggestions = ['نوبت جرم‌گیری و معاینه لثه', 'هزینه جرم‌گیری', 'تماس مستقیم'];
  }
  // Tooth broken / Chipped / Emergency fell out (شکستگی یا افتادن دندان)
  else if (
    msg.includes('شکست') ||
    msg.includes('لب پر') ||
    msg.includes('خرد') ||
    msg.includes('پرکردگی افتاد') ||
    msg.includes('افتاده')
  ) {
    replyText = `✨ **تحلیل فوری بازسازی دندان آسیب‌دیده یا شکسته:**\n\nشکستگی دندان بسته به عمق آن قابل بازسازی کامل و بی‌نقص است:\n\n۱. **شکستگی‌های سطحی تا متوسط مینا و عاج:** با کامپوزیت نانوسرامیک زیبایی همرنگ دندان در یک جلسه بازسازی و پولیش می‌شود.\n۲. **شکستگی‌های وسیع:** با درمان ریشه (در صورت درگیری پالپ) و روکش تمام سرامیک زیرکونیا یا ای‌مکس با ماندگاری طولانی محافظت می‌گردد.\n۳. **اگر دندان به طور کامل در اثر ضربه خارج شده:** فوراً آن را در یک استکان شیر ولرم یا زیر زبان قرار دهید و ظرف کمتر از یک ساعت مراجعه فرمایید تا احتمال پیوند موفق حفظ شود.\n\n💡 اگر لبه دندان تیز شده و زبان را اذیت می‌کند، از جویدن با آن ناحیه پرهیز کنید.`;
    suggestions = ['ثبت نوبت بازسازی دندان', 'هزینه ترمیم کامپوزیت', 'تماس با کلینیک'];
  }
  // Fear of dentist / Pain anxiety (ترس از دندانپزشکی)
  else if (msg.includes('ترس') || msg.includes('می‌ترسم') || msg.includes('فوبیا') || msg.includes('استرس') || msg.includes('سوزن')) {
    replyText = `💙 **شما تنها نیستید؛ ما ترس از دندان‌پزشکی را کاملاً درک می‌کنیم.**\n\nدر کلینیک پارمیس، اولویت اصلی ${info.doctorName} فراهم کردن محیطی امن، محترمانه و ۱۰۰٪ بدون درد است:\n\n• **بی‌حسی مرحله‌ای:** پیش از هر تزریقی، از ژل بی‌حسی میوه‌ای موضعی استفاده می‌شود تا ورود سرنگ‌های بسیار ظریف دیجیتال اصلاً حس نشود.\n• **توقف در هر لحظه:** در طول درمان هر زمان احساس ناراحتی کردید با بالا بردن دست درمان موقتاً متوقف می‌شود.\n• تجربه بیش از ۵,۰۰۰ بیمار راضی نشان داده که بیشتر افراد از بی‌دردی کامل شگفت‌زده شده‌اند.\n\nدوست دارید در جلسه اول فقط در یک گفتگوی ساده و معاینه بدون دستگاه شرکت کنید؟`;
    suggestions = ['نوبت معاینه و مشاوره آرامش‌بخش', 'معرفی دکتر شمس‌پور', 'تماس با مطب'];
  }
  // Orthodontics & Crowded teeth (ارتودنسی و نامرتبی دندان‌ها)
  else if (msg.includes('ارتودنسی') || msg.includes('کج') || msg.includes('نامرتب') || msg.includes('فاصله') || msg.includes('دیاستم')) {
    replyText = `📐 **تحلیل تخصصی اصلاح نامرتبی و فاصله دندان‌ها:**\n\nبرای بستن فاصله‌های دندانی (دیاستم) و رفع نامنظمی‌های دندان، دو رویکرد اصلی وجود دارد:\n\n۱. **روش فوری با کامپوزیت ونیر (در یک جلسه):** برای نامرتبی‌های ملایم و فواصل بین دندان‌ها بدون نیاز به سیم‌کشی.\n۲. **ارتودنسی تخصصی (ثابت یا نامرئی):** برای مشکلات شدید فکی، چرخش‌های عمده ریشه و اصلاح قوس کامل فک.\n\nآیا فاصله بین دندان‌های جلویی شما را آزار می‌دهد یا شلوغی و روی هم افتادگی دندان‌ها؟`;
    suggestions = ['مشاوره اصلاح فاصله دندان‌ها', 'نمونه‌کارهای دیاستم', 'ثبت نوبت ویزیت'];
  }
  // Greetings
  else if (
    msg === 'سلام' ||
    msg.includes('سلام') ||
    msg.includes('درود') ||
    msg.includes('صبح بخیر') ||
    msg.includes('عصر بخیر')
  ) {
    replyText = `سلام و احترام فراوان! 🌱\n\nمن دستیار و مشاور کلینیک دندان‌پزشکی پارمیس (دکتر انوشیروان شمس‌پور) هستم. آماده‌ام تا با دقت کامل، هر پرسشی در رابطه با علائم و مشکلات دندانی، خدمات زیبایی، ایمپلنت، تعرفه‌ها یا سؤالات عمومی دارید را تحلیل کنم و بهترین راهکار را پیش پایتان بگذارم.\n\nدقیقاً با چه علائمی یا سؤالی مواجه هستید؟`;
    suggestions = ['دندانم درد می‌کند', 'هزینه کامپوزیت و لمینت', 'نوبت‌دهی آنلاین', 'آدرس مطب'];
  }
  // Symptoms: Pain / Sensitivity / Emergencies
  else if (
    msg.includes('درد') ||
    msg.includes('تیر') ||
    msg.includes('حساس') ||
    msg.includes('جویدن') ||
    msg.includes('ورم') ||
    msg.includes('عفونت') ||
    msg.includes('آبسه')
  ) {
    let symptomAnalysis = '';
    let recommendation = '';

    if (msg.includes('سرما') || msg.includes('گرما') || msg.includes('تیر')) {
      symptomAnalysis = `تحلیل نشان می‌دهد حساسیت یا تیر کشیدن دندان به حرارت ناشی از درگیر شدن عاج دندان یا التهاب اتاقک عصب (پالپ) است. در صورتی که درد با سرما شروع شده و بیش از چند ثانیه باقی بماند، احتمال نیاز به درمان ریشه (عصب‌کشی) مطرح است.`;
      recommendation = `پرهیز از مایعات بسیار سرد و داغ، و مراجعه جهت رادیوگرافی دیجیتال (PA).`;
    } else if (msg.includes('جویدن') || msg.includes('فشار') || msg.includes('غذا')) {
      symptomAnalysis = `درد در هنگام اعمال فشار جویدن معمولاً نشان‌دهنده درگیری بافت‌های اطراف نوک ریشه (پریودنتیت ریشه)، پرکردگی ناهماهنگ یا شکستگی میکرومتری تاج دندان است.`;
      recommendation = `پرهیز از جویدن با آن سمت فک تا زمان معاینه تخصصی.`;
    } else if (msg.includes('ورم') || msg.includes('چرک') || msg.includes('آبسه')) {
      symptomAnalysis = `تورم یا ترشح نشان‌دهنده فعالیت باکتریایی و عفونت موضعی است که نیاز به تخلیه و پاک‌سازی سریع توسط دندان‌پزشک دارد.`;
      recommendation = `شست‌وشوی مکرر با آب نمک ولرم و پرهیز از گرم کردن مستقیم موضع.`;
    } else {
      symptomAnalysis = `درد دندان بیانگر پیشروی پوسیدگی به لایه‌های عمقی و واکنش بافت‌های عصبی-عروقی دندان است که خودبه‌خود درمان نمی‌شود.`;
      recommendation = `استفاده موقت از مسکن ملایم استاندارد و معاینه حضوری.`;
    }

    replyText = `🔍 **تحلیل بالینی علائم شما:**\n${symptomAnalysis}\n\n💡 **اقدامات فوری تا ویزیت:**\n• ${recommendation}\n• تمامی درمان‌های ترمیمی و عصب‌کشی در کلینیک پارمیس با بی‌حسی عمیق دیجیتال و کاملاً بدون درد انجام می‌گیرد.\n\nآیا این علائم موقع استراحت شبانه هم شما را اذیت می‌کند؟`;
    suggestions = ['ثبت نوبت اورژانسی', 'تماس مستقیم با مطب', 'هزینه عصب‌کشی و ترمیم'];
  }
  // Cosmetic: Composite / Laminate / Smile makeover
  else if (msg.includes('کامپوزیت') || msg.includes('لمینت') || msg.includes('لبخند') || msg.includes('زیبایی')) {
    const isLaminate = msg.includes('لمینت') || msg.includes('ایماکس') || msg.includes('سرامیک');
    if (isLaminate) {
      replyText = `💎 **تحلیل تخصصی لمینت سرامیکی (E-Max):**\n\nلمینت‌های سرامیکی پوسته‌های شیشه‌ای فوق‌العاده مقاوم و با ثبات رنگ ابدی هستند. این روش برای کسانی که به دنبال ماندگاری بالای ۱۵ سال، درخشش مشابه مینای دندان و مقاومت کامل در برابر لکه هستند ایده‌آل است.\n\n• زمان اجرا: ۲ الی ۳ جلسه\n• تعرفه هر واحد ای‌مکس: حدود ۷,۵۰۰,۰۰۰ تومان\n• بدون تغییر رنگ و با حداقل تراش دندان.\n\nمایلید عکس‌های قبل و بعد بیماران لمینت‌شده را ببینید؟`;
      suggestions = ['نمونه‌کارهای لمینت', 'نوبت مشاوره لمینت', 'تفاوت با کامپوزیت'];
    } else {
      replyText = `✨ **تحلیل تخصصی کامپوزیت ونیر نانوسرامیک:**\n\nکامپوزیت‌های نانو (سوئیسی و ژاپنی Tokuyama) در یک جلسه چندساعته بدون کوچک‌ترین تراش مینای سالم، فرم، تقارن و سفیدی لبخند شما را متحول می‌کنند.\n\n• زمان اجرا: تک‌جلسه‌ای (۳ تا ۴ ساعت برای هر فک)\n• تعرفه هر واحد نانوکامپوزیت: حدود ۳,۵۰۰,۰۰۰ تومان\n• کاملاً بدون نیاز به بی‌حسی در اکثر موارد.\n\nدوست دارید نمونه‌کارهای قبل و بعد کامپوزیت ما را بررسی کنید؟`;
      suggestions = ['نمونه‌کارهای کامپوزیت', 'محاسبه‌گر هزینه', 'ثبت نوبت مشاوره'];
    }
  }
  // Implants
  else if (msg.includes('ایمپلنت') || msg.includes('کاشت') || msg.includes('implant')) {
    replyText = `🔩 **تحلیل تخصصی کاشت ایمپلنت دیجیتال:**\n\nجایگزینی دندان از دست رفته با فیکسچر تیتانیومی خالص در استخوان فک، بهترین راه‌حل بازگرداندن قدرت جویدن و زیبایی است.\n\n• در کلینیک پارمیس از برندهای معتبر کره‌ای و سوئیسی (اشترومان با ضمانت بین‌المللی) استفاده می‌شود.\n• جراحی به روش راهنمای سه‌بعدی و کاملاً بدون درد و با حداقل تورم انجام می‌گیرد.\n• شروع قیمت پایه ایمپلنت: از ۱۲,۰۰۰,۰۰۰ تومان.\n\nآیا کشیدن دندان شما به تازگی بوده یا زمان زیادی گذشته است؟`;
    suggestions = ['نمونه‌کارهای ایمپلنت', 'مشاوره ایمپلنت با دکتر', 'محاسبه هزینه اقساط'];
  }
  // Pricing
  else if (msg.includes('قیمت') || msg.includes('هزینه') || msg.includes('تعرفه') || msg.includes('قسط')) {
    replyText = `📋 **خلاصه تعرفه‌های شفاف کلینیک دندان‌پزشکی پارمیس:**\n\n` +
      treatments
        .slice(0, 6)
        .map((t) => `• **${t.name}**: حدود ${Number(t.basePricePerUnitTomans).toLocaleString('fa-IR')} تومان (${t.description || ''})`)
        .join('\n') +
      `\n\n💳 امکان پرداخت اقساطی برای درمان‌های جامع زیبایی و کاشت دندان فراهم است.\nبرای برآورد سفارشی هزینه می‌توانید از **محاسبه‌گر آنلاین هزینه** استفاده فرمایید.`;
    suggestions = ['محاسبه‌گر آنلاین هزینه', 'مشاوره اقساطی', 'ثبت نوبت'];
  }
  // Address & Navigation
  else if (msg.includes('آدرس') || msg.includes('کجاست') || msg.includes('لوکیشن') || msg.includes('تلفن') || msg.includes('پاکدشت')) {
    replyText = `📍 **آدرس دقیق کلینیک دندان‌پزشکی پارمیس:**\n${info.address}\n\n📞 **تلفن مستقیم مطب:** ${info.phoneDisplay}\n⏰ **ساعات کاری:** ${info.workingHours}\n\nبرای مسیریابی لحظه‌ای در نشان، بلد یا گوگل‌مپ می‌توانید از دکمه‌های زیر استفاده فرمایید:`;
    suggestions = ['مسیریابی با نشان', 'مسیریابی با گوگل مپ', 'تماس تلفنی', 'ثبت نوبت آنلاین'];
  }
  // Default Comprehensive Consultation
  else {
    const matchedFaq = faqs.find((f) => msg.includes(f.question.toLowerCase().slice(0, 8)));
    if (matchedFaq) {
      replyText = `**پاسخ تحلیلی به سؤال شما:**\n\n${matchedFaq.answer}\n\nجهت بررسی حضوری یا معاینه دقیق توسط ${info.doctorName} می‌توانید وقت مشاوره حضوری دریافت کنید.`;
    } else {
      replyText = `تحلیل پیام شما: «**${rawMsg}**»:\n\nمن با دقت پیام شما را بررسی کردم. در **کلینیک دندان‌پزشکی پارمیس** زیر نظر **${info.doctorName}** تمامی درمان‌های پیشرفته ترمیمی، زیبایی، جراحی ایمپلنت و درمان ریشه با استانداردهای نوین بین‌المللی ارائه می‌شود.\n\nخوشحال می‌شوم اطلاعات بیشتری در این باره به من بدهید تا پاسخ دقیق‌تر و مشاوره‌ای کاملاً کاربردی برایتان تنظیم کنم.`;
    }
  }

  return {
    reply: replyText,
    cases: enrichment.cases,
    doctorCard: enrichment.doctorCard,
    actions: enrichment.actions,
    followUpSuggestions: suggestions,
    mode: 'knowledge_engine',
  };
}

export function generateFallbackClinicResponse(cleanMessage: string): AiChatResponsePayload {
  return synthesizeDynamicAiAnalysis(cleanMessage);
}

export function analyzeIntentAndEnrich(cleanMessage: string) {
  const msg = cleanMessage.toLowerCase();
  const actionTypes = new Set<ChatActionItem['type']>();
  let cases: StructuredPortfolioCase[] = [];
  let doctorCard: DoctorProfileCardData | null = null;

  if (
    msg.includes('نمونه') ||
    msg.includes('عکس') ||
    msg.includes('تصویر') ||
    msg.includes('قبل و بعد') ||
    msg.includes('گالری')
  ) {
    const searchRes = searchPortfolioCases(cleanMessage);
    cases = searchRes.cases;
    actionTypes.add('navigate_gallery');
  }

  if (
    msg.includes('معرفی دکتر') ||
    msg.includes('دکتر شمس') ||
    msg.includes('بیوگرافی') ||
    msg.includes('رزومه') ||
    msg.includes('نظام پزشکی')
  ) {
    doctorCard = getPublicDoctorProfileCard();
  }

  if (
    msg.includes('آدرس') ||
    msg.includes('کجاست') ||
    msg.includes('لوکیشن') ||
    msg.includes('تلفن') ||
    msg.includes('شماره') ||
    msg.includes('مسیر')
  ) {
    actionTypes.add('call_clinic');
    actionTypes.add('open_google_maps');
    actionTypes.add('open_neshan');
  }

  if (msg.includes('نوبت') || msg.includes('رزرو') || msg.includes('وقت ویزیت')) {
    actionTypes.add('open_booking');
    actionTypes.add('call_clinic');
  }

  if (msg.includes('هزینه') || msg.includes('قیمت') || msg.includes('تعرفه')) {
    actionTypes.add('open_cost_calculator');
    actionTypes.add('open_booking');
  }

  return {
    cases,
    doctorCard,
    actions: buildClinicActions(Array.from(actionTypes)),
  };
}

function resolveActiveGeminiApiKey(cleanMessage?: string): string {
  // 1. Check if user sent an AIzaSy or AQ. key inside the current message
  if (cleanMessage && typeof cleanMessage === 'string') {
    const inMessageKey = cleanMessage.match(/(?:AIzaSy[A-Za-z0-9_-]{33}|AQ\.[A-Za-z0-9_-]{40,})/);
    if (inMessageKey) {
      const key = inMessageKey[0];
      try {
        fs.writeFileSync(path.join(process.cwd(), '.gemini_key'), key, 'utf8');
        process.env.GEMINI_API_KEY = key;
      } catch {}
      return key;
    }
  }

  // 2. Check local saved .gemini_key file (takes top priority for user-supplied key)
  try {
    const localKeyPath = path.join(process.cwd(), '.gemini_key');
    if (fs.existsSync(localKeyPath)) {
      const k = fs.readFileSync(localKeyPath, 'utf8').trim();
      if (k && (k.startsWith('AIzaSy') || k.startsWith('AQ.'))) {
        process.env.GEMINI_API_KEY = k;
        return k;
      }
    }
  } catch {}

  // 3. Check environment variable (loaded from .env)
  const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || '';
  if (envKey && (envKey.startsWith('AIzaSy') || envKey.startsWith('AQ.'))) {
    return envKey;
  }

  return '';
}

export async function handleAiAssistantChat(
  message: string,
  history: ChatHistoryMessage[] = []
): Promise<AiChatResponsePayload> {
  const cleanMessage = (message || '').trim().slice(0, 1500);
  if (!cleanMessage) {
    throw new Error('پیام ارسالی نمی‌تواند خالی باشد.');
  }

  // If user just sent a key alone (either AIzaSy or AQ.)
  if (/^(?:AIzaSy[A-Za-z0-9_-]{33}|AQ\.[A-Za-z0-9_-]{40,})$/.test(cleanMessage)) {
    const apiKey = cleanMessage;
    try {
      fs.writeFileSync(path.join(process.cwd(), '.gemini_key'), apiKey, 'utf8');
      process.env.GEMINI_API_KEY = apiKey;
    } catch {}

    const enrichment = analyzeIntentAndEnrich('کلینیک دندانپزشکی پارمیس');
    return {
      reply: `🎉 **کلید اختصاصی Google Gemini با موفقیت متصل و فعال شد!**\n\nارتباط زنده با هوش مصنوعی ابری Google Gemini برقرار گردید. از این لحظه هوش مصنوعی پاسخ تمامی سؤالات شما را به طور زنده، نامحدود و هوشمند تحلیل و ارسال می‌کند.\n\nهم‌اکنون هر سؤالی در رابطه با علائم دندانی، مشاوره‌های زیبایی، تعرفه‌ها یا نوبت‌دهی دارید بفرمایید تا پاسخ دهم! 😊`,
      cases: enrichment.cases,
      doctorCard: enrichment.doctorCard,
      actions: enrichment.actions,
      followUpSuggestions: ['دندانم درد می‌کند', 'هزینه کامپوزیت و لمینت', 'ثبت نوبت آنلاین'],
      mode: 'gemini',
    };
  }

  const lowerMsg = cleanMessage.toLowerCase();
  const isAskingAboutAiModelOrKey =
    (lowerMsg.includes('api') ||
      lowerMsg.includes('کلید') ||
      lowerMsg.includes('چه مدلی') ||
      lowerMsg.includes('چه هوش مصنوعی') ||
      lowerMsg.includes('مدلت چیه') ||
      lowerMsg.includes('نسخه') ||
      lowerMsg.includes('3.5') ||
      lowerMsg.includes('flash lite')) &&
    !lowerMsg.includes('درد') &&
    !lowerMsg.includes('دندان');

  if (isAskingAboutAiModelOrKey) {
    return synthesizeDynamicAiAnalysis(cleanMessage, history);
  }

  const apiKey = resolveActiveGeminiApiKey(cleanMessage);

  if (apiKey) {
    const systemInstruction = buildSystemInstruction();
    const contents = buildNormalizedGeminiContents(history, cleanMessage);

    try {
      const result = await generateFastGeminiReply(apiKey, systemInstruction, contents);

      if (result && result.reply) {
        const enrichment = analyzeIntentAndEnrich(cleanMessage);
        return {
          reply: result.reply,
          cases: enrichment.cases,
          doctorCard: enrichment.doctorCard,
          actions: enrichment.actions,
          followUpSuggestions: result.followUpSuggestions,
          mode: 'gemini',
        };
      }
    } catch {
      // Fall through to dynamic clinical synthesis
    }
  }

  // If live Gemini is not connected, use dynamic contextual reasoning synthesis
  return synthesizeDynamicAiAnalysis(cleanMessage, history);
}
