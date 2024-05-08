import React from "react";
import { useLanguage } from "./LanguageContext";

const LanguageSwitcher = () => {
  const { toggleLanguage } = useLanguage();

  return <button onClick={toggleLanguage}>切换语言</button>;
};

export default LanguageSwitcher;
