// src/pages/Home/Home.js
import React from 'react';
import { useLanguage } from '../../lang/LanguageContext';
import './Home.css';

const Home = () => {
  const { currentLang, translations } = useLanguage();

  return (
    <div>
      <h1>{translations[currentLang].welcome || 'خوش آمدید'}</h1>
      <p>{translations[currentLang].homeMessage || 'این صفحه اصلی سیستم مدیریت آشپزخانه است'}</p>
    </div>
  );
};

export default Home;