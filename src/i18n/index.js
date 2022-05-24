import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/en.json";
import ko from "./locales/ko/ko.json";
import jp from "./locales/jp/jp.json";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        ko: {
            translation: ko,
        },
        jp: {
            translation: jp,
        },
    },
    lng: "ko",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
