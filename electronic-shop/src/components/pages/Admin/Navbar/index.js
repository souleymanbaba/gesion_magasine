import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change la langue
    setIsLanguageMenuOpen(false); // Ferme le menu de langue après le changement
  };

  return (
    <div className="navigation" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <ul>
        <li>
          <a href="#">
            <span className="icon">
              <ion-icon name="logo-apple"></ion-icon>
            </span>
            <span className="title">{t('admin')}</span>
          </a>
        </li>
        <li>
          <button className="language-icon" onClick={toggleLanguageMenu}>
            <FontAwesomeIcon icon={faGlobe} />
          </button>
          {isLanguageMenuOpen && (
            <ul className="dropdown-menu show" style={{ display: 'block' }}>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage('fr')}>
                  Français
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage('ar')}>
                  العربية
                </button>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/admin/Categorie">
            <span className="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span className="title">{t('category')}</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/ProductsA">
            <span className="icon">
              <ion-icon name="cube-outline"></ion-icon>
            </span>
            <span className="title">{t('produ')}</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span className="icon">
              <ion-icon name="cart-outline"></ion-icon>
            </span>
            <span className="title">{t('ord')}</span>
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <span className="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span className="title">{t('logout')}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
