import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="ml-6">
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
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="ja">日本語</option>
        <option value="ji">Yiddish</option>
        <option value="ka">ქართული</option>
        <option value="ko">한국어</option>
        <option value="nl">Nederlands</option>
        <option value="pl">Polski</option>
        <option value="pt">Português</option>
        <option value="ru">Русский</option>
        <option value="tr">Türkçe</option>
      </select>
    </div>
  );
};

export default Language;
