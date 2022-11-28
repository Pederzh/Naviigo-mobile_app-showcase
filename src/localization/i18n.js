import i18next from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationIT from './locales/it.json';

// the translations
const resources = {
    en: {
    translation: translationEN
    },
    it: {
        translation: translationIT
    }
};

const languageDetector = {
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: callback => {
        return Localization.getLocalizationAsync().then(({ locale }) => {
            callback(locale);
        });
    },
    init: () => {},
    cacheUserLanguage: () => {},
};

i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        //debug: true,
    //defaultNS: 'common',
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
    // react: {
    //     wait: true,
    // },
});

export default i18next;