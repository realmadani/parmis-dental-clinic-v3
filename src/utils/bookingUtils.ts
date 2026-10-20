/**
 * Appointment booking and patient contact validation utilities
 */

export interface AppointmentBookingRequest {
  fullName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  preferredDay: 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday';
  preferredShift: 'morning' | 'evening';
  patientNotes?: string;
  hasInsurance: boolean;
  createdAt?: string;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  normalizedPhone?: string;
}

/**
 * Validates an Iranian mobile number (09xxxxxxxxx, +989xxxxxxxxx, 9xxxxxxxxx)
 * or Iranian landline with area code (021xxxxxxxx, 021-3604xxxx)
 */
export function validateIranianPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', error: 'لطفاً شماره تماس را وارد فرمایید' };
  }

  // Convert Persian/Arabic digits to English digits
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let cleaned = phone.trim();
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replaceAll(persianDigits[i], String(i)).replaceAll(arabicDigits[i], String(i));
  }

  // Remove spaces, hyphens, and parentheses
  cleaned = cleaned.replace(/[\s\-\(\)]/g, '');

  // Convert international +98 or 0098 to 0
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('0098')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }

  // Mobile check: 09 followed by 9 digits (total 11 digits)
  const isMobile = /^09\d{9}$/.test(cleaned);
  // Landline check: 021 or 02x followed by 8 digits (total 11 digits)
  const isLandline = /^0\d{2}\d{8}$/.test(cleaned);

  if (isMobile || isLandline) {
    return { isValid: true, normalized: cleaned };
  }

  return {
    isValid: false,
    normalized: cleaned,
    error: 'شماره تلفن معتبر نیست. لطفاً شماره موبایل (مثال: ۰۹۱۲۳۴۵۶۷۸۹) یا تلفن ثابت را وارد کنید',
  };
}

export function validateAppointmentRequest(data: Partial<AppointmentBookingRequest>): BookingValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'نام و نام خانوادگی باید حداقل ۳ حرف باشد';
  }

  const phoneCheck = validateIranianPhone(data.phone || '');
  if (!phoneCheck.isValid) {
    errors.phone = phoneCheck.error || 'شماره تلفن نامعتبر است';
  }

  if (!data.serviceId || data.serviceId.trim().length === 0) {
    errors.serviceId = 'لطفاً خدمت مورد نظر خود را انتخاب نمایید';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalizedPhone: phoneCheck.normalized,
  };
}

export function generateAppointmentTrackingCode(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PARMIS-${randomNum}`;
}

export const PERSIAN_WEEKDAYS: Record<string, string> = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنج‌شنبه',
};

export const PERSIAN_SHIFTS: Record<string, string> = {
  morning: 'نوبت صبح (۱۰:۰۰ الی ۱۳:۰۰)',
  evening: 'نوبت عصر (۱۶:۰۰ الی ۲۰:۰۰)',
};
