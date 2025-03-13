import { useEffect, useMemo, useState } from "react";
import { Locale } from "../locale/locale";
import { TranslationFactory } from "../locale/translation";
import { Subject } from "./subject";

const localeSubject = new Subject<Locale>();

export const updateLocale = (locale: Locale) => {
  localeSubject.next(locale);
}

export function useTranslation() {
  const [locale, setLocale] = useState(Locale.en());
  const translation = useMemo(() => {
    return TranslationFactory.getTranslationsFor(locale);
  }, [locale]);

  useEffect(() => {
    const unsubscribe = localeSubject.subscribe(locale => {
      setLocale(locale);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return { locale, t: translation };
}
