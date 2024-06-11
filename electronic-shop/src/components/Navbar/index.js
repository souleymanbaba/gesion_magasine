import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser, faHeart } from '@fortawesome/free-solid-svg-icons'; // Importer faHeart
import '../../style.css';
import { isLoggedIn, savelang } from '../pages/Account/userStorageService';
import { useTranslation } from 'react-i18next';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
  const [t, i18n] = useTranslation();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedInState(isLoggedIn());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const test = () => {
    savelang("ar");
  };

  const testt = () => {
    savelang("fr");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" id="navbar" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logo">
            <span id="span1">{t('title')}</span>{t('subtitle')} <span>{t('suubtitle')}</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen ? 'true' : 'false'}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/" onClick={closeMenu}>
                  {(t('home'))}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={closeMenu}>
                  {(t('products'))}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeMenu}>
                 {(t('about'))}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeMenu}>
                {(t('contact'))}
                </Link>
              </li>
            </ul>

            <div className="container-fluid p-2">
              <div className="d-flex justify-content-end align-items-center">
                <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleLanguageMenu}>
      <FontAwesomeIcon icon={faGlobe} className="me-2" />
      {/* {t('language')} */}
    </button>
                  {isLanguageMenuOpen && (
                    <ul className="dropdown-menu show" style={{ display: 'block' }}>
                      <li>{i18n.language==='ar' && <button className="dropdown-item" onClick={() =>{i18n.changeLanguage('fr');testt()} }>Français</button>}</li>
                      <li>
                        {i18n.language === 'fr' && (
                          <button className="dropdown-item" onClick={() => { 
                            i18n.changeLanguage('ar');
                            test();
                          }}>العربية</button>
                        )}
                      </li>
                    </ul>
                  )}
                </div>

             
                <Link to="/cart" className="btn btn-primary position-relative ms-3" onClick={closeMenu}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className="btn btn-primary position-relative ms-3" onClick={closeMenu}>
                  <FontAwesomeIcon icon={faHeart} /> {/* Ajout de l'icône de wishlist */}
                </Link>

                {isLoggedInState ? (
                  <Link to="/logout" className="btn btn-primary d-flex align-items-center ms-3" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    <FontAwesomeIcon icon={faUser} />
                  </Link>
                ) : (
                  <Link to="/SigIn" className="btn btn-primary ms-3" onClick={closeMenu}>
                  <FontAwesomeIcon icon={faUserLock} className="me-2" />
                
                </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <br />
      <br />
      {/* <br />
      <br />
      <br /> */}
    </>
  );
}

export default Navbar;
