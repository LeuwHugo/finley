import { Language } from './i18n';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷'
  }
];

export const getLanguageConfig = (code: Language): LanguageConfig => {
  return supportedLanguages.find(lang => lang.code === code) || supportedLanguages[0];
};

export const getLanguageName = (code: Language): string => {
  const config = getLanguageConfig(code);
  return config.nativeName;
};
