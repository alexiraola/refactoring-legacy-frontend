import React from "react";
import { Locale } from "../../locale/locale";
import { updateLocale, useTranslation } from "../locale.hook";

export default function Language() {
  const { locale } = useTranslation();

  return (
    <select value={locale.toString()} onChange={(e) => {
      updateLocale(Locale.create(e.target.value));
    }}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
    </select>
  )
}
