import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  LANGUAGES,
  type Language,
  type TranslationKey,
  translations,
} from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("openclaw-lang");
    if (
      stored &&
      (stored === "en" || stored === "id" || stored === "ar" || stored === "ru")
    ) {
      return stored as Language;
    }
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("openclaw-lang", lang);
  }, []);

  const langConfig = LANGUAGES.find((l) => l.code === language)!;

  useEffect(() => {
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = language;
  }, [language, langConfig.dir]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        dir: langConfig.dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
