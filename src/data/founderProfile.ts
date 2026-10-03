import { FounderProfile } from '../types';

export const defaultFounderProfile: FounderProfile = {
  photoUrl: '',
  cvUrl: '',
  fullName: {
    en: 'Founder name to be added',
    ps: 'د بنسټګر نوم دلته ولیکئ',
    fa: 'نام بنیان‌گذار را وارد کنید',
  },
  title: {
    en: 'Founder / CEO / Director',
    ps: 'بنسټګر / اجرائیوي رئیس / رئیس',
    fa: 'بنیان‌گذار / مدیرعامل / رئیس',
  },
  introduction: {
    en: 'Add the founder’s approved introduction here.',
    ps: 'د بنسټګر تایید شوې پېژندنه دلته ولیکئ.',
    fa: 'معرفی تأییدشده بنیان‌گذار را اینجا وارد کنید.',
  },
  professionalInformation: [
    {
      label: { en: 'Professional background', ps: 'مسلکي مخینه', fa: 'پیشینه حرفه‌ای' },
      value: { en: 'Editable profile detail to be added', ps: 'د پېژندپاڼې د سمون وړ معلومات دلته ولیکئ', fa: 'جزئیات حرفه‌ای را اینجا وارد کنید' },
    },
    {
      label: { en: 'Leadership focus', ps: 'د رهبرۍ تمرکز', fa: 'حوزه رهبری' },
      value: { en: 'Editable profile detail to be added', ps: 'د رهبرۍ د سمون وړ معلومات دلته ولیکئ', fa: 'اطلاعات حوزه رهبری را اینجا وارد کنید' },
    },
  ],
  additionalInformation: {
    en: 'Add any additional approved information here.',
    ps: 'نور تایید شوي معلومات دلته ولیکئ.',
    fa: 'اطلاعات تکمیلی تأییدشده را اینجا وارد کنید.',
  },
};