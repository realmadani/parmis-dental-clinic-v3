export const DEFAULT_CLINIC_INFO = {
  name: 'دندان‌پزشکی پارمیس',
  fullName: 'کلینیک دندان‌پزشکی پارمیس',
  doctorName: 'دکتر انوشیروان شمس‌پور',
  doctorRole: 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
  specialty: 'جراح - دندانپزشک (دکترای حرفه‌ای دندانپزشکی)',
  medicalCouncilCode: '۱۱۱۹۳۵',
  medicalLicenseLink: 'https://membersearch.irimc.org/',
  phone: '02136048581',
  phoneDisplay: '۰۲۱۳۶۰۴۸۵۸۱',
  mobilePhone: '09215395923',
  mobilePhoneDisplay: '۰۹۲۱۵۳۹۵۹۲۳',
  whatsappPhone: '989215395923',
  whatsappUrl: 'https://wa.me/989215395923',
  address:
    'پاکدشت، بلوار شهدای قمی، میدان علی ابن ابیطالب، ابتدای بلوار علی ابن ابیطالب، مجتمع پزشکی راستین، طبقه دوم، کلینیک دندان‌پزشکی پارمیس',
  workingHours: 'شنبه تا پنجشنبه، ۱۰:۰۰ الی ۲۰:۰۰ (با هماهنگی قبلی)',
  googleMapsUrl: 'https://maps.app.goo.gl/mW3LBkEkswiF6HBZ8?g_st=ac',
  neshanUrl: 'https://nshn.ir/fcsbQMQhQxn5EY',
  baladUrl: 'https://balad.ir/location?latitude=35.483203&longitude=51.680118&zoom=16.500000',
  doctorImage: '/images/dr-shamspoor.jpg',
};

export const DEFAULT_SERVICES = [
  {
    id: 'implant',
    title: 'ایمپلنت دیجیتال و جراحی کاشت دندان',
    shortDesc: 'کاشت دندان به روش دیجیتال با راهنمای جراحی سه‌بعدی، حداقل تهاجم و بدون درد',
    details: {
      duration: '۳۰ تا ۴۵ دقیقه برای هر واحد',
      painControl: 'بی‌حسی موضعی عمیق دیجیتال بدون درد',
      aftercare: [
        'استفاده از کمپرس سرد در ۲۴ ساعت اول',
        'مصرف منظم آنتی‌بیوتیک و مسکن تجویزی',
        'پرهیز از غذاهای سفت و داغ تا چند روز',
      ],
    },
  },
  {
    id: 'composite',
    title: 'کامپوزیت ونیر و اصلاح طرح لبخند',
    shortDesc: 'طراحی لبخند طبیعی با لایه‌گذاری نانوسرامیک و بدون تراش دندان در یک جلسه',
    details: {
      duration: 'هر فک حدود ۳ الی ۴ ساعت در یک جلسه',
      painControl: 'بدون نیاز به تزریق بی‌حسی در اغلب موارد و بدون تراش مینای سالم',
      aftercare: [
        'عدم مصرف مواد رنگی مانند قهوه و چای پررنگ در ۴۸ ساعت اول',
        'استفاده مداوم از نخ دندان و مسواک نرم',
        'پالیش دوره‌ای سالیانه برای حفظ درخشندگی',
      ],
    },
  },
  {
    id: 'laminate',
    title: 'لمینت سرامیکی پرسلن (E-Max)',
    shortDesc: 'پوسته‌های سرامیکی فوق‌العاده مقاوم و شفاف با ثبات رنگ مادام‌العمر',
    details: {
      duration: 'طی ۲ الی ۳ جلسه به فاصله حدود ۱۰ روز',
      painControl: 'بی‌حسی موضعی ملایم هنگام آماده‌سازی میکرومتری',
      aftercare: [
        'پرهیز از شکستن اجسام سخت مثل پسته درسته یا یخ با دندان',
        'رعایت بهداشت دهان و نخ دندان روزانه',
        'مراجعه منظم جهت چکاپ ۶ ماهه',
      ],
    },
  },
  {
    id: 'bleaching',
    title: 'بلیچینگ و سفید کردن حرفه‌ای دندان‌ها',
    shortDesc: 'سفید کردن دندان‌ها با دستگاه‌های نوین آفیس بلیچینگ و هوم بلیچینگ با ماندگاری بالا',
    details: {
      duration: '۴۵ دقیقه در مطب',
      painControl: 'بدون درد (استفاده از ژل‌های ضدحساسیت حاوی نیترات پتاسیم و فلوراید)',
      aftercare: [
        'رعایت رژیم سفید (پرهیز از چای، قهوه، رب و زعفران) در ۴۸ ساعت اول',
        'پرهیز از استعمال دخانیات تا چند روز',
      ],
    },
  },
  {
    id: 'root-canal',
    title: 'درمان ریشه تخصصی (عصب‌کشی دیجیتال)',
    shortDesc: 'عصب‌کشی دقیق با روتاری دیجیتال و اپکس لوکیتور بدون درد و در کمترین زمان',
    details: {
      duration: '۴۵ تا ۶۰ دقیقه (اکثراً در یک جلسه)',
      painControl: 'بی‌حسی موضعی کامل و تضمین عدم احساس درد حین کار',
      aftercare: [
        'پرهیز از جویدن غذای سفت با دندان پانسمان‌شده تا زمان قرارگیری روکش یا ترمیم دائم',
        'مصرف مسکن در ۴۸ ساعت اول در صورت حساسیت ملایم پس از رفع بی‌حسی',
      ],
    },
  },
];

export const DEFAULT_TREATMENTS = [
  {
    name: 'کامپوزیت لیرینگ نانوسرامیک',
    unit: 'واحد',
    basePricePerUnitTomans: 3500000,
    description: 'برندهای برتر آلمانی، ژاپنی (توکویاما) و سوئیسی (سارمکو)',
  },
  {
    name: 'لمینت سرامیکی E-Max',
    unit: 'واحد',
    basePricePerUnitTomans: 7500000,
    description: 'سرامیک فوق شفاف ایماکس با ماندگاری بیش از ۱۵ سال',
  },
  {
    name: 'ایمپلنت کره‌ای درجه یک',
    unit: 'واحد',
    basePricePerUnitTomans: 12000000,
    description: 'شامل فیکسچر تیتانیومی و روکش پیچی زیرکونیا',
  },
  {
    name: 'ایمپلنت سوئیسی ITI Straumann',
    unit: 'واحد',
    basePricePerUnitTomans: 22000000,
    description: 'برند برتر جهانی با گارانتی بین‌المللی و جوش‌خوردگی سریع',
  },
  {
    name: 'بلیچینگ تخصصی مطب (دو فک)',
    unit: 'فک',
    basePricePerUnitTomans: 4000000,
    description: 'سفیدسازی فوری با ژل اولترادنت آمریکا و محافظ لثه',
  },
  {
    name: 'عصب‌کشی تخصصی دندان آسیاب',
    unit: 'دندان',
    basePricePerUnitTomans: 3800000,
    description: 'پاکسازی دقیق کانال‌ها با دستگاه روتاری و اپکس لوکیتور دیجیتال',
  },
];

export const DEFAULT_CASES = [
  {
    id: 'case-composite-diastema',
    caseNumber: 'کیس #۲۱۴',
    title: 'بستن دیاستم فک بالا و لایه‌بندی نانو در ۱ جلسه',
    category: 'composite',
    categoryLabel: 'کامپوزیت نانو سرامیک',
    description:
      'بستن فاصله بین دندان‌های پیشین با تکنیک لایه‌بندی چندرنگ Tokuyama ژاپن بدون هیچ‌گونه تراش بافت سالم مینا.',
    patientInfo: 'خانم ۲۷ ساله • پاکدشت',
    duration: 'تک‌جلسه (۲ ساعت و نیم)',
    guaranteeText: 'بدون بی‌حسی و بدون درد',
    beforeImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXeHC0SAZprmuRhdCiYr54eWhHF_mki8Zb7YUh6MjeFg-cxRPIRcNoq9F18SOx7gM1XK7NwLi4rkke1UoAktdiI8uj8zYXQINfqgf8l39LNWe8i0Pq91TkmMMukqtCOdXycIrfSGFuOhJRJrVVBNAtaB2HazziEu6th9VRmCt2s-bSFDimg9USXZOn5s0dG1XIUUd5BrH2XtM-TfDU5lc6PL4baIcLGJEWNYChm_Ht6RvpoBIE0IRO',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmYMn9_xpu996h3jWqIBaCBzlD-0adrq2CB44mP18Fz3UcIMqT0UGXXNFgm55d-0MWGzTjdQ8YdxPmblckF0aOJS3MKvDOSsRJqQ73jbEixJ1eH1QjEVSKp0bKgpGjW84TjTVJcI6UAd-v8bO7rgjA0y_9_YngT3VhWt5A1kRpzQNrmf3qvlzxW6Oa2sk6mqwpejTMHdbUaHhKz2rsaRuxLBQVd558J4WdwIUw7HLC-KF6msVy_8bE',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از ۱ جلسه',
    badge: 'کامپوزیت ونیر',
  },
  {
    id: 'case-laminate-emax',
    caseNumber: 'کیس #۳۰۸',
    title: 'اصلاح بدرنگی تتراسایکلین و فرم دندان‌ها با لمینت E-Max',
    category: 'laminate',
    categoryLabel: 'پرسلن لمینت E-Max',
    description:
      'طراحی لبخند متناسب با میمیک چهره با لمینت سرامیکی شیشه‌ای ایماکس سوئیس و اصلاح خط لبخند متقارن با حداقل تراش.',
    patientInfo: 'آقای ۳۴ ساله • پاکدشت',
    duration: '۸ واحد قدامی (۲ جلسه)',
    guaranteeText: 'ضمانت کتبی ۱۰ ساله',
    beforeImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoM0lnD2KgyH9xirf2MUV1NDYbaxrKUYqKgKJZ6QHZNJjtZUyXu5buX7q4WDJITId0NmOGHnMrJcF6jBpmD-V7wHCW5Mg4HExQVsoD87DcDEqd56-HqAKFV1PItVPJbUrK1Q9gAIpuc7BKRS5tsxodK9vhSFOXSCeJvCYxwEC9Ryp_Y-01uXghJwk5LaYUBAEw99Tm9LkkeNSvVpwhdH3kJg0xwskrNI7SZYXlm9bt2nOhT6jLnZ_C',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzxW9EZdYXhDHL5IULw_ATMDiWeFPlECj3Ui3RKW5xiD3VWwE7XgyE8R_YnZa-q9DYNstSqS_881-H_X-e7YjsAqmacdAvnOawjlMvT_4ZUHqYvsjgJBTijOGKq4r39jM0wmX8WV2jX5l7qj52FJzqHeBuJ69cOzsvVlcX6cFeu6pG8hrq39H_r7NjZsqASksaPR0IUSvKQi463OUTA6Mk5D3NQflwTmsjWof-xrfB_EnEkDBMiP_P',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از لمینت سرامیکی',
    badge: 'لمینت سرامیکی',
  },
  {
    id: 'case-digital-implant',
    caseNumber: 'کیس #۴۵۵',
    title: 'کاشت فوری ایمپلنت دیجیتال و روکش زیرکونیا',
    category: 'implant',
    categoryLabel: 'ایمپلنت دیجیتال',
    description:
      'استفاده از سرجیکال گاید اختصاصی سه‌بعدی، پایه تیتانیومی اشترومن سوئیس و تحویل روکش تمام‌سرامیک بدون تورم و بدون درد.',
    patientInfo: 'آقای ۴۸ ساله • قیام‌دشت',
    duration: 'جراحی بدون بخیه (Flapless)',
    guaranteeText: 'پایه اشترومن با ضمانت مادام‌العمر',
    beforeImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByP-3e29b5Zayma0foQQ9FWc804xowE7cSwcPMVHH7mh0GPAFD45dHhI75CZs8eH5TviDI0wYdHMY_WbccEPqRmBeX9piiSXsUVubUTNg_WWE1DeweAUDSi481VNIzwy6d6FhoudOejk1QVOFYGITgGmoaocI-L6TLd8Gy8KbOtDnXKdIIQQKGJX_UODUl-aRgk2ZXrFCmWDpGSABzMumi_mAy2B59AbBZHwHM-rill-kke8Nkiqou',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMsO07WVVr0Yy8aIvr-0ozAm_TdGXXhwNh_fadtN7K7VjNlTVW7DPWTyamnlELdwcLXpSwXLQlb3DDNnX33_lbDaUIK3xn-bbQSgL368NynL9-kEzOxLqcL2njHV2kTnFu3Hl1LtNxqHqSCNaN-wFrWBhs3pfrS_CmC94k7vSmCl3vjbf3WOsS5JMkAfS8wJCksiTrcgsSm_dPrgzbAt2QBPXTHRVPxLa-Wmeq6_XwZez9pdA08VOW',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از کاشت و روکش',
    badge: 'ایمپلنت دیجیتال',
  },
  {
    id: 'case-bleaching-office',
    caseNumber: 'کیس #۱۱۷',
    title: 'روشن‌سازی ۴ درجه‌ای مینای دندان با بلیچینگ مطب',
    category: 'bleaching',
    categoryLabel: 'بلیچینگ تخصصی مطب',
    description:
      'انجام بلیچینگ هوم و آفیس توأم با ژل اولترادنت آمریکا همراه با محافظ ژل لثه، بدون کمترین حساسیت حرارتی یا درد پس از درمان.',
    patientInfo: 'خانم ۲۹ ساله • ورامین',
    duration: 'آفیس + هوم در ۴۵ دقیقه',
    guaranteeText: 'نتیجه پایدار با تری اختصاصی شبانه',
    beforeImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxt1-43rKkC2yNX8MzHuwKVW29APrmZ-hWmu8iS8-atQkr1caYTC5rTuiSbcSC_zEV8l2i72s7eDhlXKZX4Yita8mUxzbMsCpK75JSHOL9dN4vTpocIjt4myP_PZkgduIp4hQ3FD01s2nSlNJbpFv2tnkaxSd8ETXLpUZWuzx6EHXU3Ydd1MkA2fce-0YILYWfURxg0HEetXNXK_2o4SLSGiyZgBL-Li7Y8W46ZBzEal6yVjfXrsDz',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPHB-CjF_xDVQO_gN5Bt-HJmaMHC883jkF0mvD_q7imuy56lzYzQqLt_rdTUSX-FTTkyz9b3ecWMipbjEDMgzYYESgygWVSP6XFxyE4nLEWXWbUaJhz2HWVsPBB4jruzOI0os6CzW_D030nDmfDnRjRA-bF_sxD6BTTQsuQpOieevWqrs4ZZYO77BAjlvV9VPnX5h8NMuzpgg1vnulj9ixOPhsd_yCm9Vi-FLL9pgNznXx4WRCAucw',
    beforeLabel: 'قبل از درمان',
    afterLabel: 'بعد از سفیدسازی',
    badge: 'بلیچینگ تخصصی',
  },
];
