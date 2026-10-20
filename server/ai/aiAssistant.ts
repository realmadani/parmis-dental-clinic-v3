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

  return `تو مشاور و دستیار هوشمند، صمیمی، همدل و بسیار دانای «کلینیک دندان‌پزشکی پارمیس» با مدیریت «${info.doctorName}» در پاکدشت هستی.

### دستورالعمل پاسخگویی (بسیار مهم):
۱. **اصلاً از جملات تکراری، کلیشه‌ای یا رباتیک استفاده نکن**: پاسخ‌های تو باید ۱۰۰٪ پویا، طبیعی، گرم و هوشمندانه باشد. اگر کاربر محاوره‌ای و خودمانی صحبت کرد، تو هم با لحن گرم و محترمانه محاوره‌ای پاسخ بده.
۲. **به تمام سؤالات جواب کامل و کاربردی بده**: چه سؤالات تخصصی پزشکی و دندان‌پزشکی (درد دندان، عصب‌کشی، ایمپلنت، کامپوزیت، لمینت، بلیچینگ، دندان عقل، ارتودنسی، کودکان، لثه)، چه تعرفه‌ها، آدرس، نوبت‌دهی و حتی احوال‌پرسی یا سؤالات عمومی.
۳. **تعامل دوطرفه برقرار کن**: در انتهای پاسخت ۱ سؤال مرتبط از کاربر بپرس تا گفتگو ادامه پیدا کند.
۴. **فرمت پاسخ و پیشنهادهای بعدی**:
در انتهای پاسخت، دقیقاً این خط را قرار بده:
---SUGGESTIONS---
و در خط بعدی، ۳ پیشنهاد کوتاه و طبیعی (هرکدام حداکثر ۶ کلمه) برای کاربر بنویس که با کاراکتر | از هم جدا شده باشند.

### اطلاعات کلینیک دندان‌پزشکی پارمیس:
- نام مرکز: ${info.fullName}
- دندان‌پزشک و مسئول فنی: ${info.doctorName} (${info.doctorRole}) - نظام پزشکی: ${info.medicalCouncilCode}
- نشانی: ${info.address}
- تلفن مطب: ${info.phoneDisplay}
- ساعات کاری: ${info.workingHours}

### خدمات تخصصی:
${servicesSummary}

### تعرفه‌ها (تومان):
${pricingSummary}
${faqsSummary}
${articlesSummary}`;
}

/**
 * Normalizes conversation history so that it strictly starts with 'user'
 * and alternates between 'user' and 'model' as required by the Gemini API.
 */
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

  // Strip any leading 'model' turns (e.g. initial welcome greeting)
  while (rawTurns.length > 0 && rawTurns[0].role === 'model') {
    rawTurns.shift();
  }

  // Merge consecutive turns of the same role so user/model strictly alternate
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
): Promise<{ reply: string; followUpSuggestions: string[] } | null> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Use the ultra-fast lightweight models (gemini-3.5-flash-lite & gemini-3.1-flash-lite)
  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const rawText = response.text?.trim();
      if (rawText) {
        let reply = rawText;
        let followUpSuggestions: string[] = [];

        if (rawText.includes('---SUGGESTIONS---')) {
          const parts = rawText.split('---SUGGESTIONS---');
          reply = parts[0].trim();
          const sugLine = (parts[1] || '').trim();
          if (sugLine) {
            followUpSuggestions = sugLine
              .split('|')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .slice(0, 4);
          }
        }

        return { reply, followUpSuggestions };
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function analyzeIntentAndEnrich(cleanMessage: string) {
  const msg = cleanMessage.toLowerCase();
  const actionTypes = new Set<ChatActionItem['type']>();
  let cases: StructuredPortfolioCase[] = [];
  let doctorCard: DoctorProfileCardData | null = null;

  // Check if user explicitly asked for photos/portfolio
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

  // Doctor profile card only when asked about the doctor
  if (
    msg.includes('معرفی دکتر') ||
    msg.includes('دکتر شمس') ||
    msg.includes('بیوگرافی') ||
    msg.includes('رزومه') ||
    msg.includes('نظام پزشکی')
  ) {
    doctorCard = getPublicDoctorProfileCard();
  }

  // Enrich actions based on clear user intent
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

export async function handleAiAssistantChat(
  message: string,
  history: ChatHistoryMessage[] = []
): Promise<AiChatResponsePayload> {
  const cleanMessage = (message || '').trim().slice(0, 1500);
  if (!cleanMessage) {
    throw new Error('پیام ارسالی نمی‌تواند خالی باشد.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error('کلید API هوش مصنوعی در محیط سرور تنظیم نشده است.');
  }

  const systemInstruction = buildSystemInstruction();
  const contents = buildNormalizedGeminiContents(history, cleanMessage);

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

  throw new Error('خطا در دریافت پاسخ لحظه‌ای از هوش مصنوعی. لطفاً مجدداً تلاش نمایید.');
}
