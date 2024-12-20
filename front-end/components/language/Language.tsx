import { useRouter } from "next/router";
import styles from "@styles/home.module.css";
import React from "react";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className={styles.languageDiv}>
      <label htmlFor="language" className="text-white">
        Language
      </label>
      <select
        id="language"
        className="ml-2 p-1"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ja">日本語</option>
        <option value="nl">Nederlands</option>
      </select>
    </div>
  );
};

export default Language;
