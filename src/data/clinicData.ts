export interface ServiceItem {
  id: string;
  title: string;
  mobileTitle: string;
  shortDesc: string;
  mobileDesc: string;
  iconName: string;
  mobileIconName: string;
  mobileCtaText: string;
  category: string;
  details: {
    overview: string;
    steps: string[];
    duration: string;
    painControl: string;
    aftercare: string[];
  };
}

export interface CaseGalleryImage {
  url: string;
  label?: string;
  stage?: 'before' | 'during' | 'after' | 'xray';
}

export interface TransformationItem {
  id: string;
  title: string;
  mobileTitle?: string;
  subtitle?: string;
  mobileSubtitle?: string;
  image: string;
  mobileImage?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  description?: string;
  badge?: string;
  iconName?: string;
  accentColor?: string;
  category?: string;
  categoryLabel?: string;
  duration?: string;
  patientInfo?: string;
  caseNumber?: string;
  afterBadge?: string;
  galleryImages?: CaseGalleryImage[];
  tags?: string[];
}

export interface ExecutiveSummaryItem {
  title: string;
  desc: string;
  icon?: string;
}

export interface ComparisonTableRow {
  criterion: string;
  col1: string;
  col2: string;
}

export interface ComparisonTable {
  title: string;
  subtitle?: string;
  badge?: string;
  col1Header: string;
  col2Header: string;
  rows: ComparisonTableRow[];
}

export interface DoctorQuote {
  quote: string;
  doctorName?: string;
  doctorRole?: string;
  sectionTitle?: string;
  medicalCouncilCode?: string;
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface CandidacyGroup {
  title: string;
  items: string[];
}

export interface ArticleItem {
  id: string;
  category: string;
  categorySlug?: string;
  mobileCategory: string;
  title: string;
  mobileTitle: string;
  summary: string;
  mobileSummary: string;
  image: string;
  mobileImage: string;
  readTime: string;
  date?: string;
  views?: number;
  author?: string;
  authorRole?: string;
  tags?: string[];
  isFeatured?: boolean;
  content: string[];
  tips: string[];
  tipsTitle?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  // Structured customized content
  introduction?: string;
  executiveSummary?: ExecutiveSummaryItem[];
  comparisonTable?: ComparisonTable;
  doctorQuote?: DoctorQuote;
  candidacy?: {
    title?: string;
    option1: CandidacyGroup;
    option2: CandidacyGroup;
  };
  faqs?: ArticleFaqItem[];
  showClinicalCases?: boolean;
  showComments?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon?: string;
}

export const CLINIC_INFO = {
  name: 'دندان‌پزشکی پارمیس',
  fullName: 'کلینیک دندان‌پزشکی پارمیس',
  doctorTitleBrand: 'دکتر انوشیروان شمس‌پور',
  doctorName: 'دکتر انوشیروان شمس‌پور',
  doctorRole: 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
  specialty: 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
  medicalCouncilCode: '۱۱۱۹۳۵',
  medicalLicenseLink: 'https://membersearch.irimc.org/',
  phone: '02136048581',
  phone2: '02136048582',
  phoneLine1: '۰۲۱۳۶۰۴۸۵۸۱',
  phoneLine2: '۰۲۱۳۶۰۴۸۵۸۲',
  phoneDisplay: '۰۲۱۳۶۰۴۸۵۸۱',
  phoneDisplay2: '۰۲۱۳۶۰۴۸۵۸۲',
  phoneCompact: '۰۲۱۳۶۰۴۸۵۸۱',
  phoneCompact2: '۰۲۱۳۶۰۴۸۵۸۲',
  mobilePhone: '09215395923',
  mobilePhoneDisplay: '۰۹۲۱۵۳۹۵۹۲۳',
  whatsappPhone: '989215395923',
  whatsappDisplay: '۰۹۲۱۵۳۹۵۹۲۳ (مشاوره واتساپ)',
  whatsappUrl: 'https://wa.me/989215395923',
  address:
    'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
  shortAddress:
    'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم',
  workingHours: 'شنبه تا پنجشنبه، ۱۰:۰۰ الی ۲۰:۰۰',
  mobileWorkingHours: '۱۰:۰۰ الی ۲۰:۰۰ (شنبه تا پنج‌شنبه)',
  googleMapsUrl: 'https://maps.app.goo.gl/mW3LBkEkswiF6HBZ8?g_st=ac',
  neshanUrl: 'https://nshn.ir/fcsbQMQhQxn5EY',
  baladUrl: 'https://balad.ir/location?latitude=35.483203&longitude=51.680118&zoom=16.500000',
  // Desktop images
  heroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCPFaA_datw-F1_DHr1TUtJBECQSwTHSr9-64n9RfKP82zD_STvCU_gm9KEbvVzsBkAjDTVR-Ih7KjWJV8AAjmdigBg_QEEmCwIEv6T1VKv-N5kydIMDGZiXjHdIvUrWF6-uPWBkIF9Yzcqa0QdTljTmYHWcOpoe0zdoADgFkuL7rrs8wffQEuRpAUFtsJvt3pc_qNty70FZofnDU1F2ERSvbfZUobOYGPcFX_T8Nyclpzi20d6sp22',
  operatoryImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA4eZSRbpCc4iM2eEyXnmCwHDyzkzPhf6Fcza35-sdb83oUdkmJMgN4NzlqVQ6e1qwz4Mdd3c4AsgTXLUJz2ET_L2fbW30BNHsMV0iyDeXqTVMt_4Q6DNfkdPl4_-GeQbwZXGbg5EeBVu1tQf5gkz2EUpxl73fBAJSeH2zz-QcLn2i6cSpkg4URN9JI3uh8QsXTcMqviHoPqXlMSXP12zfUBPevfAx3ye8krZ8r9hwI5yd9Dm7JNIxf',
  doctorImage:
    '/images/dr-shamspoor.jpg',
  mapImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC8R3q-m6biXlpO7DVycxHmqcNT_QFcBsrU1786ZHCW0VGFIct0xTksc6ThpNzl4UE1edGk6rNhHOH7WE238hsY2i07aeGlHxsu8Psnpqp36L5kXTdJMbITMta3l6la2zCfbtWFFAq5Rtzmopfb3YkLXviWvA1-wgcxITowC_Qlf1KXV2u7TiWNR1ilYLK5ePobi9LrNt70eeC5wsXdymV2_-wGXA65t86B8OlEsYkYyoh92a9E3NHP',
  // Mobile-specific reference images
  mobileDrawerAvatar:
    '/images/dr-shamspoor.jpg',
  mobileHeroImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuATTsF5oShaNlaLNdC1EqldPfzCdUAW0NANawm2FttWoHzb2RjKAyr3QHiqbqv7dteWztzP2DnPntZuuKPE6oQHYNf8IkMLHzHnE7wNXdlmY9qxlwsRDxEOL8_zHYMi4HPmJFRujM4ytoizD956PQeV7uUXK1yfrqhEqhRK5j3UCFb0jLmTKq5tUOjF3Qnjh7eonzQUAUZ_7LPNp0KafEPwAJvEqNjQy0PBlcJhTemkrvNuOeycnLBd',
  mobileOperatoryImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA8M6a5U0aeHjNzujN0Y477If9OsockvCQZIlAUwIdkmkCWfE4emoZvfaaSMLpMycdzUsW9Zpg9M30wwKOsFtl9tFD5P65cZmbP20fkOvo41JnqErK9O2fNftCxQlMMbZxmXbId5B8STyQ2TnkgqlEHW9DVvf4YshLfus7_Fjz3d3jNYARtUKRkkqZRw4rm9WdrU0VR8T5Hr1tRYR8nJKX_FsKbzGifrNt_euewkSG0_kLy0dUmEVmZ',
  mobileDoctorAvatar:
    '/images/dr-shamspoor.jpg',
  mobileMapImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHvqpw0t-E40vgbMyKuCGaJGAWKzBCiV5b891YytZux_z6_eM9nFdH91YoDCXt0x_w14XvggfHsBN_OKsr4qi92Ya7hfsZeqBisZvBYTS3jk2Fok2s6tF656aB22nZi5e4BWrXWroMDXCgJqUssxemFBSqoExDEDD27Ie47_Rn8AnbBhcIIDSVi9lbFaXwu0N2CJglPDBHeV51VzwC0B6_bZW2gUTjLHEFLObv82ZyY-63k-ZzdWN3',
};

export const VALUE_PROPOSITIONS = [
  {
    icon: 'sentiment_very_satisfied',
    mobileIcon: 'favorite',
    title: 'اولویت راحتی بیمار',
    desc: 'تجربه‌ای آرام و بدون استرس در محیطی صمیمی',
    mobileDesc: 'محیطی آرام‌بخش و درمان بدون استرس و اضطراب پزشکی.',
  },
  {
    icon: 'medical_services',
    mobileIcon: 'psychology',
    title: 'کادر مجرب و حرفه‌ای',
    mobileTitle: 'مهارت و تخصص بالا',
    desc: 'بهره‌مندی از تجارب ارزشمند و مهارت بالا',
    mobileDesc: 'تجربه گسترده دکتر شمس پور در جراحی‌های پیچیده و ایمپلنت.',
  },
  {
    icon: 'devices',
    mobileIcon: 'devices',
    title: 'تجهیزات به‌روز',
    desc: 'تصویربرداری و ابزارهای تشخیصی پیشرفته',
    mobileDesc: 'تصویربرداری و ابزارهای تشخیصی پیشرفته دیجیتال.',
  },
  {
    icon: 'payments',
    mobileIcon: 'payments',
    title: 'هزینه‌های منصفانه',
    mobileTitle: 'شفافیت کامل هزینه‌ها',
    desc: 'شفافیت کامل در برآورد هزینه‌ها و درمان',
    mobileDesc: 'تعرفه منصفانه و ارائه فاکتور رسمی معتبر بیمه‌های تکمیلی.',
  },
  {
    icon: 'location_on',
    mobileIcon: 'pin_drop',
    title: 'دسترسی عالی در پاکدشت',
    mobileTitle: 'موقعیت عالی در پاکدشت',
    desc: 'مجتمع پزشکی راستین با امکانات رفاهی',
    mobileDesc: 'دسترسی آسان در مجتمع پزشکی راستین با جای پارک مناسب.',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'root-canal',
    title: 'درمان ریشه (عصب‌کشی)',
    mobileTitle: 'عصب‌کشی تخصصی (اندو)',
    shortDesc: 'نجات دندان‌های طبیعی با دستگاه روتاری دیجیتال و کاهش چشمگیر درد حین و پس از درمان با متدهای نوین بی‌حسی.',
    mobileDesc: 'درمان ریشه با دستگاه روتاری دیجیتال بدون حس درد یا ناراحتی.',
    iconName: 'dentistry',
    mobileIconName: 'vital_signs',
    mobileCtaText: 'نوبت اورژانسی',
    category: 'درمان تخصصی ریشه',
    details: {
      overview:
        'عصب‌کشی یا درمان اندودنتیک زمانی لازم است که پالپ داخلی دندان در اثر پوسیدگی عمیق یا ضربه ملتهب یا عفونی شود. با استفاده از فایل‌های روتاری نیکل-تیتانیوم، درمان در کمترین زمان و بدون درد انجام می‌شود.',
      steps: [
        'معاینه رادیوگرافی دیجیتال و ارزیابی عمق ریشه',
        'بی‌حسی کامل و ایزولاسیون با رابردم',
        'پاکسازی کانال‌ها و فرم‌دهی با فایل روتاری',
        'تسکین و پرکردن متراکم سه بعدی کانال‌ها (گوتاپرکا)',
        'پانسمان و آماده‌سازی برای ترمیم نهایی یا روکش',
      ],
      duration: 'معمولاً یک جلسه ۴۵ تا ۶۰ دقیقه‌ای',
      painControl: 'بی‌حسی موضعی با کارتریج‌های استاندارد و تزریق بدون احساس سوزش',
      aftercare: [
        'پرهیز از جویدن غذاهای سفت با دندان تحت درمان تا زمان ترمیم نهایی',
        'مصرف مسکن‌های تجویز شده در ۲۴ ساعت اول',
        'رعایت بهداشت و مسواک زدن آرام ناحیه درمان شده',
      ],
    },
  },
  {
    id: 'cosmetic-composite',
    title: 'دندان‌پزشکی زیبایی و لمینت',
    mobileTitle: 'زیبایی، لمینت و کامپوزیت',
    shortDesc: 'اصلاح فواصل دندانی، بدشکلی و تغییر رنگ دندان‌ها با کامپوزیت‌های نانوسرامیک و لمینت‌های مقاوم و باظرافت.',
    mobileDesc: 'بستن فاصله دندانی و اصلاح بدفرمی با متد لایه‌ای طبیعی.',
    iconName: 'palette',
    mobileIconName: 'arrow_back_ios_new',
    mobileCtaText: 'مشاوره لبخند',
    category: 'دندان‌پزشکی زیبایی',
    details: {
      overview:
        'طراحی لبخند هالیوودی با در نظر گرفتن تناسبات طلایی چهره، خط لبخند و فرم لب‌ها. بهره‌گیری از برترین برندهای کامپوزیت ژاپنی (Tokuyama، Gradia) و سوئیسی.',
      steps: [
        'آنالیز عکاسی و فوتوگرافی چهره و دندان‌ها',
        'انتخاب رنگ متناسب با سلیقه بیمار و تن پوست',
        'لیرینگ لایه به لایه کامپوزیت برای بازسازی ترانسلوسنسی طبیعی مینا',
        'پالیش چند مرحله‌ای با دیسک‌های الماسه جهت درخشش ماندگار',
      ],
      duration: 'هر فک معمولاً در یک جلسه ۳ تا ۴ ساعته تکمیل می‌شود',
      painControl: 'بدون نیاز به تراش یا با حداقل تراش و کاملاً بدون درد',
      aftercare: [
        'عدم مصرف مواد رنگی شدید (قهوه غلیظ، نوشابه، چای پررنگ) در ۴۸ ساعت اول',
        'پرهیز از شکستن اجسام سخت با دندان‌های جلو',
        'مراجعه برای پولیش دوره‌ای هر ۶ ماه یکبار',
      ],
    },
  },
  {
    id: 'dental-implant',
    title: 'ایمپلنت و کاشت تخصصی دندان',
    mobileTitle: 'ایمپلنت و کاشت دندان',
    shortDesc: 'جایگزینی دندان‌های از دست رفته با فیکسچرهای معتبر بین‌المللی با ماندگاری بالا و قابلیت هماهنگی ایده‌آل با لثه.',
    mobileDesc: 'جایگزینی دائمی دندان از دست رفته با فیکسچرهای معتبر جهانی.',
    iconName: 'health_and_safety',
    mobileIconName: 'dentistry',
    mobileCtaText: 'استعلام هزینه',
    category: 'جراحی و کاشت',
    details: {
      overview:
        'ایمپلنت دندانی از جنس تیتانیوم سازگار با بدن است که جایگزین ریشه دندان طبیعی می‌شود و پایه‌ای محکم برای روکش‌های دائمی سرامیکی فراهم می‌سازد.',
      steps: [
        'بررسی سی‌تی‌اسکن فک (CBCT) و سنجش تراکم استخوان',
        'کاشت پایه فیکسچر با تکنیک جراحی میکروسکوپی کم‌تهاجمی',
        'دوره پیوند استخوان با ایمپلنت (استئواینتگریشن)',
        'قالب‌گیری دقیق دیجیتال برای روکش نهایی تمام‌سرامیک زیرکونیا',
      ],
      duration: 'جلسه جراحی حدود ۳۰ الی ۴۵ دقیقه برای هر پایه',
      painControl: 'بی‌حسی عمیق موضعی، بدون کوچکترین درد در حین پروسه',
      aftercare: [
        'استفاده از کمپرس سرد در ۲۴ ساعت اول برای کاهش تورم احتمالی',
        'استفاده از دهانشویه کلرهگزیدین طبق دستور پزشک',
        'استفاده از غذاهای نرم و خنک در روزهای اولیه',
      ],
    },
  },
  {
    id: 'pediatric',
    title: 'دندان‌پزشکی اطفال و پیشگیری',
    mobileTitle: 'دندان‌پزشکی کودکان',
    shortDesc: 'فلورایدتراپی، شیاربندی (فیشورسیلانت) و ترمیم دندان‌های شیری با رفتاری صبورانه و بدون ترس برای کودکان عزیز.',
    mobileDesc: 'فلورایدتراپی، شیاربندی و پیشگیری از پوسیدگی در محیطی دوستانه.',
    iconName: 'child_care',
    mobileIconName: 'child_care',
    mobileCtaText: 'نوبت کودکان',
    category: 'کودکان و نوجوانان',
    details: {
      overview:
        'حفظ دندان‌های شیری پایه سلامت دندان‌های دائمی است. محیط کودک‌دوست کلینیک پارمیس اضطراب کودک را کاملاً برطرف می‌کند.',
      steps: [
        'آشناسازی کودک با محیط و ابزارها به شکل بازی و داستان',
        'بررسی پوسیدگی‌ها و وضعیت رویش دندان‌های دائمی',
        'فلورایدتراپی موضعی جهت تقویت مینای دندان',
        'شیاربندی دندان‌های آسیاب شماره ۶ جهت پیشگیری مادام‌العمر از پوسیدگی',
      ],
      duration: 'جلسات کوتاه ۲۰ الی ۳۰ دقیقه‌ای متناسب با حوصله کودک',
      painControl: 'استفاده از ژل‌های بی‌حسی با طعم میوه و رویکرد روانشناختی مثبت',
      aftercare: [
        'پرهیز از خوردن و آشامیدن تا نیم ساعت پس از فلورایدتراپی',
        'تشویق کودک به مسواک زدن منظم دو نوبت در روز',
      ],
    },
  },
  {
    id: 'oral-surgery',
    title: 'جراحی لثه و دندان‌های عقل',
    mobileTitle: 'جراحی لثه و دندان عقل',
    shortDesc: 'خارج‌سازی دقیق دندان‌های عقل نهفته و نیمه‌نهفته با حداقل تهاجم بافتی و بهبود سریع دوره نقاهت بیمار.',
    mobileDesc: 'خروج دندان‌های نهفته و جراحی‌های ظریف بافت نرم با ترمیم سریع.',
    iconName: 'medical_information',
    mobileIconName: 'vaccines',
    mobileCtaText: 'مشاوره جراحی',
    category: 'جراحی دهان و فک',
    details: {
      overview:
        'دندان‌های عقل نهفته می‌توانند به ریشه دندان‌های مجاور آسیب بزنند یا موجب تشکیل کیست و بهم‌ریختگی قوس دندانی شوند. جراحی با ظرافت و حداقل دستکاری بافتی انجام می‌گردد.',
      steps: [
        'بررسی موقعیت عصب فک تحتانی با رادیوگرافی پانورامیک (OPG)',
        'بی‌حسی اختصاصی با دوام بالا',
        'برش بافت و خارج کردن آرام دندان به صورت بخش‌بندی شده (Sectioning)',
        'بخیه جذبی یا نایلونی ضدعفونی شده',
      ],
      duration: 'حدود ۲۰ الی ۴۰ دقیقه',
      painControl: 'بی‌حسی عمیق با بازگشت آرام حس بدون شوک درد',
      aftercare: [
        'نگه داشتن گاز استریل روی محل جراحی به مدت یک ساعت با فشار ملایم',
        'عدم شستشوی شدید دهان و تف کردن در روز اول',
        'مصرف به موقع آنتی‌بیوتیک و مسکن‌های تجویزی',
      ],
    },
  },
  {
    id: 'scaling',
    title: 'جرم‌گیری و بروساژ تخصصی',
    mobileTitle: 'جرم‌گیری و بروساژ',
    shortDesc: 'پاکسازی رسوبات و لکه‌های ناشی از مصرف چای و دخانیات همراه با آموزش کامل بهداشت دهان و دندان به مراجعین.',
    mobileDesc: 'رفع کامل پلاک میکروبی و بوی بد دهان با روش اولتراسونیک ملایم.',
    iconName: 'cleaning_services',
    mobileIconName: 'water_drop',
    mobileCtaText: 'رزرو نوبت',
    category: 'سلامت لثه و پیشگیری',
    details: {
      overview:
        'جرم‌های دندانی عامل اصلی التهاب لثه (ژنژیویت) و بوی بد دهان هستند. جرم‌گیری اولتراسونیک بدون آسیب به مینای دندان، لثه‌ها را احیا و تازه می‌سازد.',
      steps: [
        'بررسی عمق پاکت‌های لثه‌ای و ارزیابی میزان رسوبات',
        'جرم‌گیری با قلم‌های اولتراسونیک دقیق پیزوالکتریک',
        'بروساژ سطحی با خمیر پولیش حاوی فلوراید برای رفع لکه‌های زرد و قهوه‌ای',
        'آموزش روش صحیح استفاده از نخ دندان و مسواک بین‌دندانی',
      ],
      duration: 'حدود ۳۰ تا ۴۵ دقیقه',
      painControl: 'بدون نیاز به بی‌حسی در اکثر موارد؛ همراه با اسپری بی‌حسی در لثه‌های حساس',
      aftercare: [
        'حساسیت موقت به سرما و گرما در ۲ الی ۳ روز اول طبیعی است',
        'استفاده از خمیردندان ضدحساسیت به مدت یک هفته',
      ],
    },
  },
];

// Order on mobile bento grid matches reference: Implant, Cosmetic, Root Canal, Surgery, Scaling, Pediatric
export const MOBILE_SERVICES_ORDER = [
  'dental-implant',
  'cosmetic-composite',
  'root-canal',
  'oral-surgery',
  'scaling',
  'pediatric',
];

export const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'bleaching',
    title: 'بلیچینگ و سفیدکردن دندان',
    mobileTitle: 'بلیچینگ و سفید کردن تخصصی',
    subtitle: 'روشن‌سازی تخصصی دندان‌ها بدون آسیب به مینا',
    mobileSubtitle: 'درمان سریع ۲ درجه روشن‌تر بدون حساسیت',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgvab7UgT4Y1Ai2FOYC7LIWG8_NPSojhfA3vA0lvRM20w3B0LVQqVOFANpMpKE93sC2ZSUcNVAFvQjnyT-x-cy0xndAKcvd_lcnbvefkCj99TkULspfJgqxlteZ4BkvN7jURVwLxZdXxL439vq02W2hxuo2o4XW8nY6vh-9jqXaIt54ay31ZygfsFs0Hd5yq97RwC7XZnff2AWts1gFuegS5tO-isoP6Z4g8E6D1BmQR4v0Bw1H3aw',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAorbQVoj3UcKzLzSRqSk5Qo8Rrxiy68DZtIa1ad5cH_9h0VS2mtpgq8l660-gAaNMaen-oyvroBzUweCX1Xy5VieFNG9949I9ghTucb7dXdgJqjajbbwuc2NzRUG7IJZwX8d0i66-Y0bPnphby7MMaEonvzLw_wY77cpNZMaWbfrkuIrGb9vF_XkrVV-i74R-3ep665kRL9hqaWEe-VTpYnupX5pFo0dpf0hX6P95icWtHD7hjowbF',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از درمان',
    description: 'رفع زردی، تیرگی و لکه‌های ناشی از مصرف چای و سیگار در یک جلسه با روشن‌سازی تا ۴ پرده رنگی استاندارد.',
    badge: '۱ جلسه درمانی',
  },
  {
    id: 'implant',
    title: 'ایمپلنت و کاشت دندان',
    mobileTitle: 'کاشت دندان و ایمپلنت فوری',
    subtitle: 'جایگزینی دائمی و طبیعی دندان‌های از دست‌رفته',
    mobileSubtitle: 'بازسازی کامل دندان با روکش زیرکونیا',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2WutJ1Xenz3N-v1E6ywEJ5MT5_fhDQBAnmbdpJGoNwFVJmnDEjTjO18yp54uBETGITl3SjQItDrQVtlNj_rfFY7otylZsxMRrGJ_fptvoLKenb-JHGF9umxm-6n8OKVF8vOJjm3sVLrI2Zf1X4bchcfgL2XZeWY_jKFI_QpAyamfRhOLp6qp_ZDWAOb6KVWxAMtWYuFnDoeUyox11SR7Z3IeZIQMxLsuJVdbTXJychrzaXj35yG_Y',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsf6XPsv-27kjwmM-MNaTExUjHcVRGypuXsyavcbN2O50SiDviPM03hYDMRdIoeU2Xb76N56bc0KtwFTUxJS18uUD6Zi_g2hn8Z2L-dZFV-KGOv3GM7-OttYb6kDjsOpSavRelCAmPaVVbcR-VQTsKK9a3YDQmw-ubBbJpB9133rnXahcxT2fIQ0BQNdfYs4B8a61JzVsXE9jtYCUzkLeXPd-kU4uVDXzTUygCCI7ZFzdVfTPMw19V',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از درمان',
    description: 'بازسازی کامل فانکشن جویدن و هارمونی لبخند با ایمپلنت تیتانیومی و روکش زیرکونیای متال‌فری.',
    badge: 'نتیجه ماندگار مادام‌العمر',
  },
  {
    id: 'composite-smile',
    title: 'کامپوزیت و اصلاح طرح لبخند',
    mobileTitle: 'اصلاح طرح لبخند و کامپوزیت ونیر',
    subtitle: 'فرم‌دهی و قرینه‌سازی متناسب با چهره بیمار',
    mobileSubtitle: 'فرم‌دهی طبیعی بدون آسیب به مینای دندان',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzKy3ALLpuz6hr2Px8u5QsUvXikbG24bQXi24wYPsurV_UPHBGq6HCDxKq5qYX4KxNgbyVqoDy7YiJPs4ikXZawSlkSFIt56bXmYJEueciG3Q0IUcRaeBboLKnDHHhcOr7xALQk_Dz6xZqUJtm-IWP7slhPQXfZbxj1KFKHYiH0gDuGFGJBMDTf5uyYuLuHbH4ATYK9poXnaSe8opDhfRSL0-rlIANdHvqpHXbgBo_7F_QQ1VGc86t',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBibvAg_V5m9qV6lk3wFPr17yMdSLgMSyII6E2I3pSDjcJrxk21DSqqQXOtNZo2BV_LS0lDh9B0Iv4YsU7oZSjwtrjAiZ8ojjR_x-dS5c9r5pxQqPsUBnOeXNlgCv4lKBX45jjA2tiQkWNyhH-8hgNRzxTCHn3TX4StSkrbu0dGzWyXkxZgB-RNMKw9QnS_-DbBLzNdSBSv2A7_L1DCy87ws22Mq4T3t5zL5aJenG4FG_xrZyHIUyul',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از درمان',
    description: 'بستن فاصله دندان‌های پیشین، هم‌سطح‌سازی لبه‌های دندانی و ایجاد فرم لبخند متقارن بدون کوچکترین تراش دندان.',
    badge: 'طراحی اختصاصی لبخند',
  },
];

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'همه مقالات', icon: 'grid_view' },
  { id: 'cosmetic', label: 'زیبایی (کامپوزیت و لمینت)', icon: 'auto_awesome' },
  { id: 'implant', label: 'ایمپلنت و جراحی فک', icon: 'healing' },
  { id: 'endodontics', label: 'درمان ریشه و ترمیمی', icon: 'medical_services' },
  { id: 'hygiene', label: 'بهداشت و پیشگیری', icon: 'clean_hands' },
  { id: 'care', label: 'مراقبت‌های پس از درمان', icon: 'assignment_turned_in' },
  { id: 'pediatric', label: 'دندان‌پزشکی کودکان', icon: 'child_care' },
];

export const TRENDING_TAGS = [
  '#ایمپلنت_دندان',
  '#لمینت_سرامیکی',
  '#کامپوزیت_ونیر',
  '#عصب‌کشی_بدون_درد',
  '#دندان‌پزشکی_کودکان',
  '#مراقبت‌های_جراحی',
  '#بلیچینگ_دندان',
  '#بیمه_تکمیلی_پاکدشت',
];

export const QUICK_HEALTH_TIPS = [
  {
    id: 'tip-emergency',
    title: 'چه زمانی درد دندان اورژانسی است؟',
    description:
      'درد ضربان‌دار مداوم شبانه، تورم فک یا گونه و تب از نشانه‌های انتشار عفونت است و باید سریعاً به کلینیک مراجعه نمایید. از گذاشتن قرص آسپرین روی لثه خودداری کنید.',
    badge: 'نیاز به مداخله ۲۴ ساعته',
    badgeType: 'error',
    icon: 'emergency',
  },
  {
    id: 'tip-electric-brush',
    title: 'مسواک برقی یا دستی؛ کدام بهتر است؟',
    description:
      'تحقیقات نشان می‌دهند مسواک‌های برقی با لرزش صوتی پلاک‌های میکروبی را ۲۱٪ بیشتر حذف می‌کنند و برای افراد دارای ارتودنسی، ایمپلنت و افراد کم‌توان بهترین بازدهی را دارند.',
    badge: 'توصیه انجمن دندان‌پزشکان',
    badgeType: 'primary',
    icon: 'electric_bolt',
  },
  {
    id: 'tip-composite-brands',
    title: 'بهترین برندهای کامپوزیت کدامند؟',
    description:
      'در کلینیک پارمیس پاکدشت منحصراً از برندهای برتر توکویاما (Tokuyama ژاپن)، ایوکلار (Ivoclar آلمان/سوئیس) و گرادیای ژاپن به دلیل درخشندگی بالا و مقاومت سایشی عالی استفاده می‌شود.',
    badge: 'ضمانت متریال اورجینال',
    badgeType: 'tertiary',
    icon: 'verified_user',
  },
];

export const ARTICLES: ArticleItem[] = [
  {
    id: 'featured-composite-vs-laminate',
    category: 'زیبایی (کامپوزیت و لمینت)',
    categorySlug: 'cosmetic',
    mobileCategory: 'طراحی لبخند و ونیر',
    title:
      'راهنمای جامع تفاوت ونیر کامپوزیت و لمینت سرامیکی؛ کدام یک برای اصلاح طرح لبخند شما مناسب‌تر است؟',
    mobileTitle:
      'راهنمای جامع تفاوت ونیر کامپوزیت و لمینت سرامیکی؛ کدام یک برای شما مناسب‌تر است؟',
    summary:
      'اصلاح طرح لبخند یکی از حساس‌ترین درمان‌های دندان‌پزشکی نوین است. در این بررسی بالینی تخصصی، دکتر انوشیروان شمس پور تفاوت‌های ساختاری، میزان تراش دندان، استحکام، طول عمر، هزینه و موارد کاربرد کامپوزیت‌های سرامیکی در برابر لمینت‌های کاد-کم را برای بیماران در پاکدشت به تفصیل شرح می‌دهد.',
    mobileSummary:
      'بررسی دقیق تفاوت در تراش دندان، ماندگاری و استحکام، هزینه تمام شده، و جلوه طبیعی هر روش جهت تصمیم‌گیری هوشمندانه در کلینیک پارمیس پاکدشت.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsq7ZJ9hYCX0cUIRYsuZ6lYxD4NCEB_EXeo9Zq7ZCVFjqZ-1w9uO0aa55twFck6vI52exqPieMEmuRJjYS_5HWsiIghJbMCIYv9Q8BTchsi2Sqjht-P7NdZZ2bBu3Kdx6PczIXGH9a9yco5azOdO8pq823Bidc4qQr2VXycIxfb_hQBw2XG0rW44_ZspLfon1DawRTsm7rCDZOg0AqCnpq3RF22fAN-g53ZQBc86FGFv4JBMzv5L0',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0dV3PCPYR1lxTu7JJ-viZy6qxlXyBMiq22eIbl54e08_KljywloHoeJPZUYsfPAlPqGLFumudh5BiCW3U9xKs6k8RR1wDwuF3idNbd8VPDt6ohR1oeZDaoTr_C3MXoGfMu20alvdiXyL7SiU41r6XO9FZpvVhcgxN50aGC8Qaem-yBb9XH1qqpXVWaVlkYQ5xj3vQIWdEzXl9shij5yWOmNjBdD6nyoVIWZMbkBC1-trSXNiAwxJD',
    readTime: '۷ دقیقه مطالعه',
    date: '۱۵ اردیبهشت ۱۴۰۳',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'عضو انجمن دندان‌پزشکان ایران • جراح و دندان‌پزشک مجتمع راستین',
    tags: ['کامپوزیت_ونیر', 'لمینت_سرامیکی', 'اصلاح_طرح_لبخند'],
    isFeatured: true,
    content: [
      'اصلاح طرح لبخند یکی از حساس‌ترین و هنرمندانه‌ترین درمان‌های دندان‌پزشکی مدرن است. مراجعین همواره این دغدغه را دارند که کامپوزیت ونیر برای شرایط فک و دندان آن‌ها مناسب‌تر است یا لمینت‌های سرامیکی.',
      'کامپوزیت ونیر به عنوان درمانی کم‌تهاجمی، در ۹۰ درصد موارد بدون نیاز به تراش یا با حداقل آماده‌سازی میکرونی مینای دندان در یک جلسه انجام می‌شود. از مزایای بارز آن، قابلیت پالیش مجدد و ترمیم سریع در مطب در صورت لب‌پریدگی احتمالی است.',
      'در نقطه مقابل، لمینت‌های سرامیکی (پرسلن لیرینگ یا کاد-کم) در لابراتوار دندان‌پزشکی ساخته شده و از استحکام مکانیکی فوق‌العاده و مقاومت بی‌نظیر در برابر تغییر رنگ ناشی از چای و قهوه بهره می‌برند. طول عمر مفید لمینت سرامیکی با رعایت بهداشت تا بیش از ۱۵ الی ۲۰ سال برآورد می‌گردد.',
    ],
    tips: [
      'افرادی که دچار دندان‌قروچه شدید هستند حتماً باید قبل از انتخاب نوع درمان با پزشک مشورت نمایند.',
      'استفاده از خمیردندان‌های بدون مواد ساینده و نخ دندان مرتب، طول عمر کامپوزیت و لمینت را دوچندان می‌کند.',
      'ویزیت چکاپ دوره‌ای هر ۶ ماه یکبار برای بررسی سلامت لثه در محل پیوند ونیر ضروری است.',
    ],
  },
  {
    id: 'implant-post-op-24h',
    category: 'ایمپلنت و جراحی فک',
    categorySlug: 'implant',
    mobileCategory: 'جراحی و ایمپلنت',
    title: 'مراقبت‌های حیاتی ۲۴ ساعت اول پس از کاشت ایمپلنت دندان',
    mobileTitle: 'مراقبت‌های حیاتی ۲۴ ساعت اول پس از کاشت ایمپلنت',
    summary:
      'دستورالعمل‌های حیاتی کنترل خونریزی، پرهیز از شستشوی شدید دهان، رژیم غذایی نرم و نحوه صحیح مصرف داروها و آنتی‌بیوتیک‌ها برای پیشگیری از پس‌زدگی فیکسچر.',
    mobileSummary: 'دستورالعمل‌های کنترل خونریزی، استراحت و مصرف صحیح داروها.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4EQaLK1OPeycL6-FDbyEj3bLdHa5wCzMNLuZPrGXbaB_i7qI1Zm5jFaCIUxyHRqP6K909z4oIYei6bS_eygar9lxajyB1yInwfwkWcf2ImrHuCGWUd6sm0Rg3HMRKMqhQVVFdxdLOrOrIw3kcDQfZhi2WuJgqhKvRixJl6_1O3e7Tow8gAK6EQOJywJVBhizpq2ohAcple78poLnYo1csaj7cLgWn3PEbLeF7oHVpNSLdA59G3LgW',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6g-KCHzA0ozV3Jo2XFnwRhQoI2dFT4tiDvzbSBlTVsMUOPoffVZsD6MeYCGNtnlDnhISuEyA--JTQFiwH8av4iWVc3vJ-JVXWWHv3HZ4ke55JQQfkv_rmyFjWR-OcPdMefmEJuna0nq3LE90YuEgh9E5tOLyH7AMN6JjRTqcGIXvAqfe4x5-KqMp7AsvcxMmLEweC8f8kjFezLv-Tm2YsLrj-bsQuTH6Q21A6uNR-3ZFckpb5Gd3g',
    readTime: '۴ دقیقه مطالعه',
    date: '۲ اردیبهشت ۱۴۰۳',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'سرپرست درمان کلینیک پارمیس',
    tags: ['ایمپلنت_دندان', 'مراقبت_جراحی', 'جایگزینی_دندان'],
    content: [
      'موفقیت درمان ایمپلنت تا حد زیادی به رعایت مراقبت‌های شبانه‌روز اول بستگی دارد. پس از اتمام جراحی، گاز استریل قرار داده شده روی ناحیه را تا ۱ ساعت با فشار ملایم فک نگه دارید و از تعویض مکرر آن پرهیز کنید.',
      'آب دهان خود را بیرون نریزید و تف نکنید، زیرا این عمل باعث ایجاد فشار منفی در دهان و کنده شدن لخته خون تثبیت‌کننده می‌شود. در صورت خروج بزاق خونی، آن را به آرامی ببلعید که امری کاملاً طبیعی است.',
      'در ۲۴ ساعت نخست، مصرف مایعات خنک و غذاهای پوره‌ای نرم مانند سوپ ولرم و پوره سیب‌زمینی توصیه می‌شود. از نوشیدن با نی جداً خودداری نمایید.',
    ],
    tips: [
      'استفاده از کمپرس یخ بر روی گونه (۱۰ دقیقه روی صورت، ۱۰ دقیقه استراحت) به کاهش تورم کمک شایانی می‌کند.',
      'آنتی‌بیوتیک تجویزشده توسط پزشک را دقیقاً سر ساعت و تا انتها مصرف فرمایید.',
      'حداقل تا ۴۸ ساعت بعد از جراحی از استعمال دخانیات و قلیان اکیداً خودداری کنید.',
    ],
  },
  {
    id: 'painless-rotary-root-canal',
    category: 'درمان ریشه و ترمیمی',
    categorySlug: 'endodontics',
    mobileCategory: 'درمان ریشه',
    title:
      'آیا عصب‌کشی واقعاً درد دارد؟ فناوری نوین روتاری و بی‌حسی دیجیتال در مطب پارمیس',
    mobileTitle:
      'آیا عصب‌کشی واقعاً درد دارد؟ فناوری نوین روتاری و بی حسی دیجیتال',
    summary:
      'تکنولوژی‌های جدید پاکسازی کانال ریشه و سیستم‌های کنترل درد چگونه تجربه ترسناک عصب‌کشی را به درمانی بدون استرس و آرامش‌بخش تبدیل کرده‌اند؟',
    mobileSummary: 'تکنولوژی‌های مدرن درمان ریشه بدون درد در کلینیک پارمیس.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1GR01M4_nS65vqjMR6eBOdOmMrgCc_3y37-nlxprK-pa81qKKPJgj1q1D3k7_5__8-PGjuE3Ndcz7GCRopg9IQQLXlUDTjrtwJq2vFfwRw0mCaeDdfeCCqwhpJYgzxX9QjWrn0BvE2_70I1_LL0Wz9CWNHhTUX_pZRJUEjhlxZNJh476Q4XaukUg5Xzh0DVg6SDXroV01o0spJtdv_DhdnnVPBJIFyf46txduWnYkSKJ1o3bH2pxs',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOIr1S4GQ7RJsDRV0zgF-TvPw90tbErPa4nH6izsbSjhu5wDv79iklW5IYQ758tTddjoTDNvgnYiyAX_DWof9HgE7y3aT6teezFndRrHZd3fBGEhA7NbOLfDQ3haVXnJ5NyirniuNIPCsg8KbjaevxsFO4JtgDz8IxHMXvlgJGV23XXKTuVP0yRvxf9UD_Ws9Fsn_eCrs6bUBGcmzIi7D1f45ketI5aZtZUsLYTr28xDOKT_l0D0uO',
    readTime: '۵ دقیقه مطالعه',
    date: '۲۸ فروردین ۱۴۰۳',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'جراح - دندان‌پزشک',
    tags: ['عصب‌کشی_بدون_درد', 'روتاری_دیجیتال', 'درمان_ریشه'],
    content: [
      'تصور دردناک بودن عصب‌کشی مربوط به دهه‌های گذشته است. امروزه با ابداع داروهای بی‌حسی با ضریب نفوذ بسیار بالا و تکنیک‌های تزریق آرام، بیمار در طول درمان هیچ دردی احساس نمی‌کند.',
      'در کلینیک پارمیس پاکدشت از دستگاه‌های روتاری مدرن اندودنتیکس همراه با اپکس فایندر دیجیتال استفاده می‌شود. این تجهیزات کانال‌های باریک و منحنی ریشه را در کوتاه‌ترین زمان و با دقت میکرومتری تمیز و شکل‌دهی می‌کنند.',
      'حفظ دندان طبیعی بیمار از طریق یک عصب‌کشی اصولی، همیشه بر کشیدن دندان و جایگزینی آن اولویت دارد زیرا استخوان فک را سالم و دست‌نخورده حفظ می‌نماید.',
    ],
    tips: [
      'درد پس از درمان معمولاً ناشی از التهاب بافت دور ریشه است و با مسکن ساده ظرف چند روز فروکش می‌کند.',
      'پس از پایان درمان، پانسمان موقت را دستکاری نکنید و برای پرکردن دائمی یا روکش سریعاً اقدام نمایید.',
    ],
  },
  {
    id: 'composite-stain-prevention',
    category: 'زیبایی (کامپوزیت و لمینت)',
    categorySlug: 'cosmetic',
    mobileCategory: 'ترمیم و زیبایی',
    title: 'علل تغییر رنگ کامپوزیت و راه‌های حفظ سفیدی و درخشش دندان‌ها',
    mobileTitle: 'علل تغییر رنگ کامپوزیت و راه‌های حفظ سفیدی و درخشش دندان‌ها',
    summary:
      'نقش مصرف چای، قهوه و دخانیات در زرد شدن ونیرها، راهکارهای پولیش دوره‌ای در کلینیک پارمیس و خمیردندان‌های مخصوص مجاز برای کامپوزیت دندان.',
    mobileSummary: 'روش‌های حفظ درخشندگی و ماندگاری رنگ کامپوزیت ونیر.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlFcRNrbAzFqWQ0gERJKD6Le9AH8rGzCetRqSr9BBjOi_gSu2xsc0IUAYiKsEPXRZn8nEZentD_6wT7OEhWzk3VRcsOXn-quwlmPN8Dgbp7m0OdvvLVLno0Ce90-1aWHDPjuDLnoTZV5J3_YEXMxnU5bGzCxXcoqyYkfIliFaHxgmGKwAAp2Q9Rgs37ps6gQJoyDlSpRv7hZSabu_OnGSUgxnCbkDRZ41KP4kLIkXP7DSwHuUtcfjr',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBs0SWzPA3ciqT8WnvPYAxtu7cTppG3fyA_GLkk-u9cqX3m1TiFmXisPnHGOO1m4YHZ0tbsugPndt4yWjH93bmLBxjmDfdx1p5C68-qU3UolnAGGPzeGhWbbB-Lf0liQVTioXwAsCmgLvguYXfNiKdDvNm4xPDUASM5RMme_-FB72jX83QMZUqniW1c-EFdCdmtzFrr4yBvuPu-muzDGzSpd8rMxnB-BRpn5o0WmvakWugwRIy0PntZ',
    readTime: '۶ دقیقه مطالعه',
    date: '۲۰ فروردین ۱۴۰۳',
    author: 'تیم بالینی پارمیس',
    authorRole: 'واحد تخصصی ترمیمی و زیبایی',
    tags: ['کامپوزیت_ونیر', 'پولیش_دندان', 'زیبایی_لبخند'],
    content: [
      'رزین‌های کامپوزیتی ماهیتی میکروهیبریدی یا نانوهیبریدی دارند و به مرور زمان تحت تاثیر رنگدانه‌های موجود در رژیم غذایی ممکن است مقداری کدر شوند.',
      'مهم‌ترین عامل در حفظ درخشش اولیه کامپوزیت، کیفیت پالیش اولیه با دیسک‌های الماسه و استفاده از برندهای با درصد فیلر بالا مانند توکویامای ژاپن است که در مطب پارمیس به کار گرفته می‌شود.',
      'انجام پالیش سالانه در یک جلسه کوتاه ۱۵ دقیقه‌ای، تمام زردی‌های سطحی را برطرف کرده و براقیت روز اول را به لبخند شما بازمی‌گرداند.',
    ],
    tips: [
      'بلافاصله بعد از نوشیدن قهوه یا چای پررنگ، دهان خود را با آب خالی غرغره کنید.',
      'از خمیردندان‌های زغالی و سفیدکننده‌های ساینده استفاده نکنید زیرا سطح کامپوزیت را زبر و مستعد جذب رنگ می‌کنند.',
    ],
  },
  {
    id: 'pediatric-orthodontics-timing',
    category: 'دندان‌پزشکی کودکان',
    categorySlug: 'pediatric',
    mobileCategory: 'دندان‌پزشکی کودکان',
    title: 'سن مناسب ارتودنسی و درمان ناهنجاری‌های فک در کودکان و نوجوانان',
    mobileTitle: 'سن مناسب ارتودنسی و درمان ناهنجاری‌های فک در کودکان',
    summary:
      'چرا ویزیت اولیه ارتودنسی در سن ۷ سالگی ضرورت دارد؟ تفاوت ارتودنسی متحرک پیشگیرانه با درمان‌های ثابت در دوران بلوغ در پاکدشت.',
    mobileSummary: 'اهمیت بررسی اولیه فک و دندان‌ها در سنین رشد کودکان.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRJ7vrqBmNwRqMsheVygxHef1KeledD11vFGyXMdDJoqQygsM4b5PsC2FIHrn3J8AJ5-LeXTcVcMB1N_Gy91rKtQhcKSkW-8Uk4s52R2p7E3TnteEGLYx87DSpfGrG-XO4d3g1yTtJRxqa-rlOrM_W9eK1R0nD6H35IIDI-yLJUwykqfsVU2xUxoSn-W_T6p5tdP3OEuxEAxwrE4xfdaRAK9qOAHf_cNGFBCKFAExLSnjUsX3OYHQ_',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTpcvjbcdPyt5IhzzecW5NgV7XyqbUbVaG7ztwLybK0X_diUxJ3szae0fBKZLmkkCRP8oeItq-m4CCItbyCoPjWX-nz-U0tKsV-pvv2POQJC8OdhJck2BkOh7MS92aw-8a-uWgxLr18rQ2DzfgdfJ6WS1rCIbYn5wVDGP2EHmE4B6yVcI_quNwSrU-rNwKcWkB-lJ4L1cZVn1AHCs2EMmZ2SLcxGu8Jq7jZPfiYLn8T2MPFQiz4cDf',
    readTime: '۵ دقیقه مطالعه',
    date: '۱۵ فروردین ۱۴۰۳',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'جراح - دندان‌پزشک',
    tags: ['دندان‌پزشکی_کودکان', 'ارتودنسی', 'سلامت_فک'],
    content: [
      'انجمن بین‌المللی دندان‌پزشکی کودکان سن ۷ سالگی را بهترین زمان برای نخستین معاینه تشخیصی ناهنجاری‌های فکی پیشنهاد می‌کند.',
      'در این سن به دلیل فعال بودن پلاک‌های رشد استخوان فک، می‌توان با پلاک‌های متحرک ساده مشکلات بزرگی چون جلو بودن فک پایین یا تنگی قوس فک بالا را بدون نیاز به جراحی‌های پیچیده در بزرگسالی درمان نمود.',
      'درمان به‌موقع از آسیب به مفصل گیجگاهی-فکی (TMJ) و کشیدن دندان‌های دائمی در آینده جلوگیری به عمل می‌آورد.',
    ],
    tips: [
      'عادت‌هایی مانند مکیدن انگشت یا تنفس دهانی در کودکان باید زودتر تحت بررسی دندان‌پزشک قرار گیرند.',
      'حفظ دندان‌های شیری با فضا نگه‌دارنده در صورت کشیدن زودهنگام بسیار حیاتی است.',
    ],
  },
  {
    id: 'office-vs-home-bleaching',
    category: 'زیبایی (کامپوزیت و لمینت)',
    categorySlug: 'cosmetic',
    mobileCategory: 'سفید کردن دندان',
    title:
      'بلیچینگ در مطب (آفیس) یا هوم بلیچینگ خانگی؟ بررسی مزایا و ماندگاری',
    mobileTitle: 'بلیچینگ مطب یا هوم بلیچینگ خانگی؟ بررسی مزایا و ماندگاری',
    summary:
      'کدام روش سفید کردن دندان سریع‌تر و ماندگارتر است؟ مقایسه غلظت ژل هیدروژن پراکسید و نحوه جلوگیری از حساسیت شدید دندانی پس از درمان.',
    mobileSummary: 'مقایسه سرعت نتیجه‌گیری و دوام سفید کردن دندان در مطب و خانه.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwfU_HUiOaeVAssegsAj8OyP9-3C45jQv6lfLuHreRwSGI465ADgk1_n3KDutdYcKsPICAZQs25wQpDXOoxYpejqEL_-Ut5H-VnuUUGohfaDMhoMKakcjJA_cFVgJohBk1si8q_x20iE9DZbxmwwezbDQsfVsSq96Q5kHaGMW_1SMB2bSJurygpsNWO7JWBSU21RnKIsccDiYp8usgl33ANqeP3lfYCTy_QEhlXSnBmP6irRF2ZBUn',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5IDeKsi3h2ADsldXm7qoimQDYvOe7YF46ANsH52y3F1z0j69iznVu64GMItZGzRlc3lxqsKmcIpWpzCJUt6DGFxzx9iWQARtdrczfqMsV1zjFBQMWGL2TrwWDHAoxIdtFlA-LRWB3pDF8IsDTm-M8cwr_XyKIPATZOJ76BCd636Qcd_om5h851zleQtV9Uz1Y-PJVJYkmyCai4XKBLv00Mii62VRSBzu2XC_MwkgoSLtRv59P6iFj',
    readTime: '۴ دقیقه مطالعه',
    date: '۸ فروردین ۱۴۰۳',
    author: 'تیم بالینی پارمیس',
    authorRole: 'بخش دندان‌پزشکی زیبایی',
    tags: ['بلیچینگ_دندان', 'سفید_کردن', 'طرح_لبخند'],
    content: [
      'بلیچینگ موثرترین روش غیرتهاجمی برای روشن کردن چند درجه‌ای رنگ طبیعی دندان‌هاست بدون اینکه ساختار دندان تراشیده یا دستکاری شود.',
      'در روش آفیس بلیچینگ (مطب)، از ژل‌های تغلیظ‌شده استاندارد و فعال‌سازی با نور سرد در یک جلسه ۴۵ دقیقه‌ای استفاده می‌شود که نتایج سریع و چشمگیری به همراه دارد.',
      'ترکیب ایده‌آل پیشنهادی پزشکان، انجام بلیچینگ مطب همراه با قالب اختصاصی هوم بلیچینگ برای تثبیت و دوام چندساله رنگ دندان است.',
    ],
    tips: [
      'استفاده از خمیردندان ضدحساسیت ۲ هفته قبل از بلیچینگ، حساسیت حین کار را به صفر می‌رساند.',
      'تا ۴۸ ساعت بعد از سفید کردن، رژیم غذایی سفید (پرهیز از سس گوجه، چای و زعفران) رعایت گردد.',
    ],
  },
  {
    id: 'halitosis-treatment',
    category: 'بهداشت و پیشگیری',
    categorySlug: 'hygiene',
    mobileCategory: 'بهداشت و سلامت عمومی',
    title:
      'بوی بد دهان (هالیتوزیس)؛ دلایل، راه‌های تشخیص و درمان قطعی در کلینیک',
    mobileTitle:
      'بوی بد دهان (هالیتوزیس)؛ دلایل، راه‌های تشخیص و درمان قطعی در کلینیک',
    summary:
      'آیا بوی بد دهان منشا گوارشی دارد یا ناشی از جرم دندانی و عفونت لثه است؟ روش‌های قطعی جرم‌گیری التراسونیک و درمان قطعی در کلینیک پارمیس.',
    mobileSummary: 'بررسی ریشه‌ای علل بوی دهان و درمان با جرم‌گیری اصولی.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQYMqz5vgdRmGOHxw6-Ug6ODgNgxVbRfKYOZBMVDaCn9JLMNF6BB59T5GkhVlJdRnwrv289gYUNEK38TFh-8CbqBKpu7DG4GpeywMQG6xjjw01c6RoHg4BqEtPEwUwRJWtPWdnlC0HhlPUjPlirXJuntBpXxQYjunHjEpeTQva2T4dEIk09kgXYRVvt4f5K5NlJmn4ceb2uVlzXQmGSmXdUziBkJ-bP2Eq5CEUbgrN4xyvxeqyLIzo',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzm476byTv2gQzRhKrjVm4uC9_nd-nzXSeDCd3RSocJevwTap24Bc5JpHmcz7MVMTC2yOVqFW6jBM4J8Qqyvqmi0nYGRsdo5aN_7Wh3gPr2V4r4QFxGtXmcncRzD-6zZshxTMviOBoLWiq1_ETAFYcBQP7SjB4opGVONZohGzEomewLrrf81fDv9Os3sliQ2Dz6Gu7918447Z3OeYlbl9CXqrjMHhvYwuLF_cC2gkHNn_mvXkbHQ9g',
    readTime: '۵ دقیقه مطالعه',
    date: '۲۵ اسفند ۱۴۰۲',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'جراح - دندان‌پزشک',
    tags: ['جرم‌گیری', 'بهداشت_دهان', 'عفونت_لثه'],
    content: [
      'بر خلاف باور عامه که بوی بد دهان را ناشی از معده می‌دانند، بیش از ۸۵ درصد موارد هالیتوزیس ریشه در تجمع باکتری‌های بی‌هوازی داخل پاکت‌های لثه و لابه‌لای پرزهای زبان دارد.',
      'جرم‌های سخت‌شده زیر لثه پناهگاه مناسبی برای ترشح گازهای گوگردی هستند که با مسواک معمولی پاک نمی‌شوند و تنها با جرم‌گیری التراسونیک قابل برطرف شدن هستند.',
      'جرم‌گیری هیچ‌گونه آسیبی به مینای دندان وارد نمی‌کند و باور غلط نازک شدن دندان در اثر جرم‌گیری کاملاً رد شده است.',
    ],
    tips: [
      'حتماً همراه با مسواک زدن، پرزهای روی زبان را نیز با مسواک یا زبان‌شوی تمیز کنید.',
      'نخ دندان کشیدن روزانه برای پاکسازی فواصل بین دندانی الزامی است.',
    ],
  },
  {
    id: 'supplementary-insurance-guide',
    category: 'مراقبت‌های پس از درمان',
    categorySlug: 'care',
    mobileCategory: 'بیمه و هزینه‌ها',
    title:
      'راهنمای جامع پوشش‌های بیمه تکمیلی و تعرفه‌های دندان‌پزشکی در پاکدشت',
    mobileTitle:
      'راهنمای جامع پوشش‌های بیمه تکمیلی دندان‌پزشکی در پاکدشت',
    summary:
      'چگونه از سقف تعهدات بیمه دانا، ایران، البرز، آسیا و بانک‌ها در کلینیک پارمیس استفاده کنیم و مدارک لازم برای تایید گواهی درمان چیست؟',
    mobileSummary: 'مدارک و نحوه دریافت هزینه از بیمه‌های تکمیلی.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXwn8cDQYlkepS57KoU6_HRKkuYqrxhvGu1QxGTaa5srrto5lweISJxkriAggQ-Y9_c1VNa5ehiEZnZ3rUXC6x03_eqOEfGx1T0dhniTYsE-z_YheCg0FLUPciq_hChMDpIsk-Jkvpp5zJPpNrFezsO0c9I1ovhCCZDMAIy3mQmTUqjErpPeLm6PXBDZnKtKZNMvCmTkbJNeJrBezOLyRrY_VQA49uCnru-O8AmexznUdZvwmxVWpf',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjV-YlqJDURCATaJrS79TYIDbspjIaINosRHy5nKs6fT99BWSrYSvL-se0dEMsZ2a0eVXOdf5NykITYqCQ7zcBQoT1CLyuQ5PKPSw-yoj5cpuLqZSf4KVRCNgD_8HwkPyxSd-rDuqT5oO5mdgwjnpH4uy9NZlRBbjdHG5IxqnGqeUZ8zWRKS-D4UjVjD9zGxj2c_ZKAzOVXv1DwnkIIOW4G5PkEQaGNUtE4vsrQK7Zd2PX2xqvv41Z',
    readTime: '۳ دقیقه مطالعه',
    date: '۱۸ اسفند ۱۴۰۲',
    author: 'واحد پذیرش و مالی',
    authorRole: 'کلینیک پارمیس پاکدشت',
    tags: ['بیمه_تکمیلی_پاکدشت', 'هزینه_درمان', 'فاکتور_معتبر'],
    content: [
      'هزینه‌های دندان‌پزشکی همواره یکی از دغدغه‌های اصلی مراجعین است. کلینیک پارمیس پس از انجام هر نوع خدمت درمانی، صورتحساب رسمی همراه با مهر معتبر نظام پزشکی صادر می‌نماید.',
      'اکثر شرکت‌های بیمه تکمیلی (دانا، ایران، آتیه‌سازان، آسیا، البرز و سامان) با ارائه این گواهی و رادیوگرافی‌های قبل و بعد، تا سقف تعهدات قرارداد شما هزینه را مستقیماً عودت می‌دهند.',
      'برای درمان‌های سنگین‌تر مانند ایمپلنت یا ارتودنسی، امکان تسویه در چند قسط متناسب با پیشرفت مراحل درمان در کلینیک فراهم است.',
    ],
    tips: [
      'عکس‌های رادیوگرافی قبل و بعد درمان را حتماً تا زمان تحویل مدارک به بیمه نگهداری فرمایید.',
      'واحد پذیرش مطب پارمیس مدارک لازم را به صورت کامل و آماده تحویل بیمه‌گذار می‌نماید.',
    ],
  },
  {
    id: 'gum-recession-prevention',
    category: 'درمان ریشه و ترمیمی',
    categorySlug: 'endodontics',
    mobileCategory: 'پریودنتولوژی',
    title:
      'چگونه از تحلیل لثه جلوگیری کنیم؟ نکات پیشگیری، علائم هشدار و درمان جراحی',
    mobileTitle: 'چگونه از تحلیل لثه جلوگیری کنیم؟ نکات پیشگیری و درمان',
    summary:
      'حساسیت به آب سرد و لق شدن ریشه می‌تواند نشانه تحلیل استخوان و بافت پریودنتال باشد. روش‌های پیوند بافت لثه و پیشگیری با مسواک مناسب.',
    mobileSummary: 'راهکارهای جلوگیری از تحلیل لثه و حساسیت طوق دندان.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSDNnDoIdcXacKU9urKTPb13pJ-URr3n2Q3VxvtLWc8MIERtOpPj2OQ9gym09aDvAmthcHcuU73TVmC-mzAoxIis6Sg7gFL2f7q1h0RgnW2o8MTGwAVtucYN5htDx_DYfgaJ_wju16CEm7p7NRAJyS3wj6DKlyNnoJrkWHRavU33NwHNXTPgXiEpcLXt_Ud9sqcuhBABiBUhvOXbSUdNwbIK0rfjQQghrkPuEOO61khXC1jkSMiv9p',
    mobileImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzm476byTv2gQzRhKrjVm4uC9_nd-nzXSeDCd3RSocJevwTap24Bc5JpHmcz7MVMTC2yOVqFW6jBM4J8Qqyvqmi0nYGRsdo5aN_7Wh3gPr2V4r4QFxGtXmcncRzD-6zZshxTMviOBoLWiq1_ETAFYcBQP7SjB4opGVONZohGzEomewLrrf81fDv9Os3sliQ2Dz6Gu7918447Z3OeYlbl9CXqrjMHhvYwuLF_cC2gkHNn_mvXkbHQ9g',
    readTime: '۶ دقیقه مطالعه',
    date: '۵ اسفند ۱۴۰۲',
    author: 'دکتر انوشیروان شمس پور',
    authorRole: 'جراح - دندان‌پزشک',
    tags: ['تحلیل_لثه', 'جراحی_پریودنتال', 'پیشگیری'],
    content: [
      'عقب‌نشینی لثه و بیرون افتادن طوق دندان پدیده‌ای شایع است که باعث حساسیت شدید دندان به هوای سرد یا آب یخ می‌شود.',
      'یکی از متهمان اصلی تحلیل لثه، مسواک زدن خشن و افقی با مسواک‌های زبر (Hard) است که بافت ظریف لثه را دچار سایش مکانیکی می‌کند.',
      'در مراحل پیشرفته‌تر، با تکنیک‌های پیوند لثه و پیوند بافت همبند می‌توان طوق دندان را مجدداً پوشاند و از لق شدن دندان جلوگیری نمود.',
    ],
    tips: [
      'همیشه از مسواک‌های با موی بسیار نرم (Soft یا Extra Soft) استفاده کنید.',
      'حرکت مسواک باید از سمت لثه به سمت تاج دندان (حرکت جارویی دورانی) باشد نه حرکت افقی اره‌ای.',
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'نحوه دریافت نوبت در دندان‌پزشکی پارمیس چگونه است؟',
    answer:
      'جهت برقراری هماهنگی و رزرو نوبت ویزیت یا درمان، کافی است در ساعات کاری با شماره‌های مستقیم مطب ۰۲۱۳۶۰۴۸۵۸۱ و ۰۲۱۳۶۰۴۸۵۸۲ تماس حاصل فرمایید تا کارشناسان پذیرش مناسب‌ترین زمان را برای شما هماهنگ کنند.',
  },
  {
    id: 'faq-2',
    question: 'آیا درمان‌های دندان‌پزشکی همراه با درد انجام می‌شوند؟',
    answer:
      'خیر، با بهره‌گیری از داروهای بی‌حسی موضعی باکیفیت و متدهای تزریق تدریجی و آرام توسط دکتر انوشیروان شمس پور، درمان‌ها به شیوه‌ای کاملاً کنترل‌شده و با حداقل احساس ناخوشایند انجام خواهند شد.',
  },
  {
    id: 'faq-3',
    question: 'درمان‌های کامپوزیت و زیبایی چند جلسه زمان می‌برند؟',
    answer:
      'بیشتر درمان‌های کامپوزیت ونیر معمولاً در یک یا دو جلسه پس از معاینه اولیه و بررسی سلامت لثه‌ها تکمیل می‌گردند. لمینت‌های سرامیکی نیازمند مرحله قالب‌گیری و ساخت لابراتواری بوده و طی ۲ الی ۳ جلسه تحویل داده می‌شوند.',
  },
  {
    id: 'faq-4',
    question: 'وضعیت صدور فاکتور برای بیمه‌های تکمیلی چگونه است؟',
    answer:
      'پس از انجام درمان، گواهی معتبر با مهر نظام پزشکی دکتر انوشیروان شمس پور به همراه شرح دقیق خدمات جهت دریافت هزینه از کلیه شرکت‌های بیمه تکمیلی به مراجعین ارائه می‌گردد.',
  },
];

export const MOBILE_FAQS: FaqItem[] = [
  {
    id: 'm-faq-1',
    question: 'آیا معاینه و ویزیت اولیه در کلینیک پارمیس رایگان است؟',
    answer:
      'بله، ویزیت اولیه و بررسی تشخیصی طرح درمان توسط دکتر انوشیروان شمس پور به همراه برآورد کامل هزینه‌ها در اولین جلسه با هماهنگی تلفنی قبلی انجام می‌گردد.',
  },
  {
    id: 'm-faq-2',
    question: 'آیا با بیمه‌های تکمیلی و درمانی همکاری دارید؟',
    answer:
      'فاکتور رسمی معتبر همراه با شرح دقیق درمان‌ها و مهر نظام‌پزشکی دکتر انوشیروان شمس پور صادر می‌شود تا بتوانید کل هزینه‌ها را از کلیه بیمه‌های تکمیلی دریافت فرمایید.',
  },
  {
    id: 'm-faq-3',
    question: 'ساعات کاری و پذیرش مطب در پاکدشت به چه صورت است؟',
    answer:
      'کلینیک شنبه تا پنجشنبه از ساعت ۱۰:۰۰ الی ۲۰:۰۰ آماده ارائه خدمات به همشهریان محترم پاکدشت و حومه می‌باشد.',
  },
];

// Hydrate from localStorage on module load
if (typeof window !== 'undefined') {
  try {
    const savedInfo = localStorage.getItem('PARMIS_CLINIC_INFO_V1');
    if (savedInfo) {
      Object.assign(CLINIC_INFO, JSON.parse(savedInfo));
    }
    const savedServices = localStorage.getItem('PARMIS_SERVICES_V1');
    if (savedServices) {
      const parsed = JSON.parse(savedServices);
      if (Array.isArray(parsed) && parsed.length > 0) {
        SERVICES.splice(0, SERVICES.length, ...parsed);
      }
    }
    const savedTransformations = localStorage.getItem('PARMIS_TRANSFORMATIONS_V1');
    if (savedTransformations) {
      const parsed = JSON.parse(savedTransformations);
      if (Array.isArray(parsed) && parsed.length > 0) {
        TRANSFORMATIONS.splice(0, TRANSFORMATIONS.length, ...parsed);
      }
    }
    const savedArticles = localStorage.getItem('PARMIS_ARTICLES_V1');
    if (savedArticles) {
      const parsed = JSON.parse(savedArticles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        ARTICLES.splice(0, ARTICLES.length, ...parsed);
      }
    }
  } catch (e) {
    console.error('Failed to hydrate clinic data from localStorage:', e);
  }
}

export function saveClinicDataStores(data: {
  clinicInfo?: Partial<typeof CLINIC_INFO>;
  services?: ServiceItem[];
  transformations?: TransformationItem[];
  articles?: ArticleItem[];
}) {
  if (typeof window === 'undefined') return;
  if (data.clinicInfo) {
    Object.assign(CLINIC_INFO, data.clinicInfo);
    localStorage.setItem('PARMIS_CLINIC_INFO_V1', JSON.stringify(CLINIC_INFO));
  }
  if (data.services) {
    SERVICES.splice(0, SERVICES.length, ...data.services);
    localStorage.setItem('PARMIS_SERVICES_V1', JSON.stringify(SERVICES));
  }
  if (data.transformations) {
    TRANSFORMATIONS.splice(0, TRANSFORMATIONS.length, ...data.transformations);
    localStorage.setItem('PARMIS_TRANSFORMATIONS_V1', JSON.stringify(TRANSFORMATIONS));
  }
  if (data.articles) {
    ARTICLES.splice(0, ARTICLES.length, ...data.articles);
    localStorage.setItem('PARMIS_ARTICLES_V1', JSON.stringify(ARTICLES));
  }
  window.dispatchEvent(new Event('clinicDataUpdated'));
}
