import en from './en';
import km from './km';
import adminEn from './admin-en';
import adminKm from './admin-km';

export const languages = {
  en: { ...en, ...adminEn },
  km: { ...km, ...adminKm },
};

export const languageLabels = {
  en: 'EN',
  km: 'KH',
};

export const languageNames = {
  en: 'English',
  km: 'ភាសាខ្មែរ',
};

export default languages;
