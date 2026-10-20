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
}

let customProvider: ClinicDataProvider | null = null;

export function setClinicDataProvider(provider: ClinicDataProvider) {
  customProvider = provider;
}

function getClinicInfo() {
  return customProvider?.getClinicInfo ? customProvider.getClinicInfo() : DEFAULT_CLINIC_INFO;
}

function getServices() {
  return customProvider?.getServices ? customProvider.getServices() : DEFAULT_SERVICES;
}

function getTreatments() {
  return customProvider?.getTreatments ? customProvider.getTreatments() : DEFAULT_TREATMENTS;
}

export function getVerifiedPortfolioCases(): StructuredPortfolioCase[] {
  if (customProvider?.getCases) {
    return customProvider.getCases();
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
    bio: 'فارغ‌التحصیل دکترای حرفه‌ای دندان‌پزشکی، دارای بورد تخصصی زیبایی و ایمپلنت‌های دیجیتال با تمرکز بر درمان‌های کم‌تهاجمی و بدون درد در کلینیک پارمیس پاکدشت.',
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

  if (combined.includes('کامپوزیت') || combined.includes('composite') || combined.includes('دیاستم') || combined.includes('فاصله دندان')) {
    targetCategory = 'composite';
    requestedCategoryName = 'کامپوزیت ونیر';
  } else if (combined.includes('لمینت') || combined.includes('laminate') || combined.includes('ایماکس') || combined.includes('e-max') || combined.includes('پرسلن')) {
    targetCategory = 'laminate';
    requestedCategoryName = 'لمینت سرامیکی';
  } else if (combined.includes('ایمپلنت') || combined.includes('کاشت') || combined.includes('implant')) {
    targetCategory = 'implant';
    requestedCategoryName = 'ایمپلنت دندان';
  } else if (combined.includes('بلیچینگ') || combined.includes('سفید') || combined.includes('bleaching') || combined.includes('روشن')) {
    targetCategory = 'bleaching';
    requestedCategoryName = 'بلیچینگ و سفید کردن دندان';
  }

  if (targetCategory) {
    const filtered = allCases.filter((item) => item.category === targetCategory);
    return {
      cases: filtered.slice(0, 4),
      exactMatchFound: filtered.length > 0,
      requestedCategoryName,
    };
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

  for (const type of types) {
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
        label: 'ورود به صفحه تماس و نقشه',
        icon: 'location_on',
      });
    } else if (type === 'navigate_services') {
      actions.push({
        id: 'act-services-page',
        type: 'navigate_services',
        label: 'مشاهده کامل صفحه خدمات',
        icon: 'medical_services',
      });
    } else if (type === 'navigate_gallery') {
      actions.push({
        id: 'act-gallery-page',
        type: 'navigate_gallery',
        label: 'مشاهده تمام نمونه‌کارها در گالری',
        icon: 'photo_library',
      });
    }
  }

  return actions;
}

function buildSystemInstruction(portfolioContextNote?: string): string {
  const info = getClinicInfo();
  const services = getServices();
  const treatments = getTreatments();

  const servicesSummary = services
    .map((s) => `- ${s.title}: ${s.shortDesc}`)
    .join('\n');

  const pricingSummary = treatments
    .map((t) => `- ${t.name}: حدود ${Number(t.basePricePerUnitTomans).toLocaleString('fa-IR')} تومان هر ${t.unit} (${t.description})`)
    .join('\n');

  return `شما «دستیار هوشمند کلینیک دندان‌پزشکی پارمیس» (به مدیریت و مسئولیت فنی دکتر انوشیروان شمس پور) هستید.
وظیفه شما راهنمایی مهربانانه، صادقانه و علمی مراجعان و بیماران به زبان فارسی روان و محترمانه است.

مشخصات کلینیک:
- نام مرکز: ${info.fullName}
- پزشک مسئول: ${info.doctorName} (${info.doctorRole}) - شماره نظام پزشکی: ${info.medicalCouncilCode}
- نشانی: ${info.address}
- تلفن تماس: ${info.phoneDisplay}
- ساعت کاری: ${info.workingHours}

خدمات اصلی کلینیک:
${servicesSummary}

تعرفه‌ها و برآورد هزینه‌ها:
${pricingSummary}

نکات مهم:
۱. همواره تأکید کنید که قیمت دقیق و طرح درمان نهایی پس از معاینه حضوری و بررسی رادیوگرافی (عکس OPG یا CBCT) توسط دکتر شمس پور تعیین می‌شود.
۲. در صورت علائم خطرناک (تورم شدید، تب، تنگی نفس، درد غیرقابل تحمل)، بیمار را سریعاً به مراجعه حضوری یا تماس اورژانسی راهنمایی کنید.
۳. لحن شما صمیمی، دلسوزانه، خوش‌برخورد و اطمینان‌بخش باشد. از پاسخ‌های طولانی خسته‌کننده پرهیز کنید.
${portfolioContextNote ? `\nنکته زمینه جاری: ${portfolioContextNote}` : ''}`;
}

export function analyzeIntentAndEnrich(cleanMessage: string) {
  const msg = cleanMessage.toLowerCase();
  const actionTypes = new Set<ChatActionItem['type']>();
  let cases: StructuredPortfolioCase[] = [];
  let doctorCard: DoctorProfileCardData | null = null;
  let followUpSuggestions: string[] = [];
  let portfolioNote = '';

  if (msg.includes('دکتر') || msg.includes('شمس') || msg.includes('پزشک') || msg.includes('کیست') || msg.includes('رزومه')) {
    doctorCard = getPublicDoctorProfileCard();
    actionTypes.add('open_booking');
    actionTypes.add('call_clinic');
    followUpSuggestions = ['مشاهده خدمات دندانپزشکی', 'دیدن نمونه‌کارها', 'آدرس مطب و راه‌های تماس'];
  }

  if (
    msg.includes('نمونه') ||
    msg.includes('عکس') ||
    msg.includes('قبل و بعد') ||
    msg.includes('کامپوزیت') ||
    msg.includes('لمینت') ||
    msg.includes('ایمپلنت') ||
    msg.includes('بلیچینگ')
  ) {
    const searchRes = searchPortfolioCases(cleanMessage);
    cases = searchRes.cases;
    actionTypes.add('navigate_gallery');
    actionTypes.add('open_booking');
    actionTypes.add('open_cost_calculator');
    portfolioNote = `کارت‌های نمونه‌کار واقعی به کاربر نمایش داده شد. در پاسخ به آنها اشاره فرمایید.`;
  }

  if (msg.includes('آدرس') || msg.includes('کجاست') || msg.includes('لوکیشن') || msg.includes('تلفن') || msg.includes('شماره')) {
    actionTypes.add('call_clinic');
    actionTypes.add('open_google_maps');
    actionTypes.add('open_neshan');
    actionTypes.add('open_balad');
    actionTypes.add('navigate_contact');
    followUpSuggestions = ['نحوه دریافت نوبت', 'مشاهده خدمات دندانپزشکی', 'معرفی دکتر شمس‌پور'];
  }

  if (msg.includes('نوبت') || msg.includes('رزرو') || msg.includes('وقت')) {
    actionTypes.add('open_booking');
    actionTypes.add('call_clinic');
    followUpSuggestions = ['آدرس مطب و راه‌های تماس', 'هزینه خدمات و روش‌های درمان'];
  }

  if (msg.includes('هزینه') || msg.includes('قیمت') || msg.includes('تعرفه')) {
    actionTypes.add('open_cost_calculator');
    actionTypes.add('open_booking');
    actionTypes.add('call_clinic');
    followUpSuggestions = ['دیدن نمونه‌کارها', 'تفاوت کامپوزیت و لمینت چیست؟', 'نحوه دریافت نوبت'];
  }

  if (followUpSuggestions.length === 0) {
    followUpSuggestions = ['دیدن نمونه‌کارها', 'هزینه خدمات و روش‌های درمان', 'آدرس مطب و راه‌های تماس', 'نحوه دریافت نوبت'];
  }

  return {
    cases,
    doctorCard,
    actions: buildClinicActions(Array.from(actionTypes)),
    followUpSuggestions,
    portfolioNote,
  };
}

function buildEmergencyFallbackResponse(userMessage: string): string {
  const info = getClinicInfo();
  return `سلام و درود! خوشحال می‌شوم کمکتان کنم.
برای مشاوره تخصصی مستقیم با ${info.doctorName} یا هماهنگی وقت ویزیت و معاینه رایگان در کلینیک پارمیس، می‌توانید با شماره تلفن ${info.phoneDisplay} تماس بگیرید یا از دکمه‌های راهنمای زیر استفاده فرمایید.`;
}

async function generateNaturalGeminiReply(
  apiKey: string,
  systemInstruction: string,
  contents: any[]
): Promise<string | null> {
  const ai = new GoogleGenAI({
    apiKey,
  });

  const candidateConfigs: Array<{ model: string; thinkingLevel: ThinkingLevel }> = [
    { model: 'gemini-2.5-flash', thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-2.5-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-1.5-flash', thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  for (const candidate of candidateConfigs) {
    try {
      const response = await ai.models.generateContent({
        model: candidate.model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function handleAiAssistantChat(
  message: string,
  history: ChatHistoryMessage[] = []
): Promise<AiChatResponsePayload> {
  const cleanMessage = (message || '').trim().slice(0, 1500);
  if (!cleanMessage) {
    throw new Error('پیام ارسالی نمی‌تواند خالی باشد.');
  }

  const enrichment = analyzeIntentAndEnrich(cleanMessage);
  const cases = enrichment.cases;
  const doctorCard = enrichment.doctorCard;
  const actions = enrichment.actions;
  const followUpSuggestions = enrichment.followUpSuggestions;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    return {
      reply: buildEmergencyFallbackResponse(cleanMessage),
      cases,
      doctorCard,
      actions,
      followUpSuggestions,
      mode: 'knowledge_engine',
    };
  }

  const systemInstruction = buildSystemInstruction(enrichment.portfolioNote);
  const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
  const contents: any[] = recentHistory
    .filter((h) => h && typeof h.content === 'string' && h.content.trim().length > 0)
    .map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content.trim().slice(0, 1000) }],
    }));

  contents.push({
    role: 'user',
    parts: [{ text: cleanMessage }],
  });

  const aiReply = await generateNaturalGeminiReply(apiKey, systemInstruction, contents);

  if (aiReply) {
    return {
      reply: aiReply,
      cases,
      doctorCard,
      actions,
      followUpSuggestions,
      mode: 'gemini',
    };
  }

  return {
    reply: buildEmergencyFallbackResponse(cleanMessage),
    cases,
    doctorCard,
    actions,
    followUpSuggestions,
    mode: 'knowledge_engine',
  };
}
