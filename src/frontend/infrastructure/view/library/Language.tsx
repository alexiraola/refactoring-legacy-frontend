import React from "react";
import { Locale } from "../../locale/locale";

type LanguageProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export default function Language({ locale, onChange }: LanguageProps) {
  return (
    <select value={locale.toString()} onChange={(e) => onChange(Locale.create(e.target.value))}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
    </select>
  )
}
