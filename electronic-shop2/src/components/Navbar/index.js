import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faShoppingCart, faUser, faHeart, faGlobe, faUserLock } from '@fortawesome/free-solid-svg-icons';
import '../../style.css';
import { isLoggedIn, savelang, getlang, getUserId } from '../pages/Account/userStorageService';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    const lang = getlang();
    if (lang) {
      i18n.changeLanguage(lang);
    }
    setIsLoggedInState(isLoggedIn());
    fetchCartData();
    fetchWishlistData();

    const handleCartUpdated = (event) => {
      setCartCount(event.detail.cartCount);
    };

    const handleWishlistUpdated = (event) => {
      setWishlistCount(event.detail.wishlistCount);
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
    };
  }, []);

  const fetchCartData = async () => {
    try {
      const lang = getlang();
      const response = await axios.get(
        `http://localhost:8080/api/customer/cart/${userId}`, { params: { lang } }
      );
      if (response.data && response.data.cartItems) {
        setCartCount(response.data.cartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const fetchWishlistData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/customer/wishlist/${userId}`
      );
      if (response.data ) {
        setWishlistCount(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    savelang(lng);
    setIsLanguageMenuOpen(false); 
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

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
                  {t('home')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={closeMenu}>
                  {t('produ')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeMenu}>
                  {t('about')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeMenu}>
                  {t('contact')}
                </Link>
              </li>
            </ul>

            <div className="container-fluid p-2">
              <div className="d-flex justify-content-end align-items-center">
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleLanguageMenu}>
                    <FontAwesomeIcon icon={faGlobe} className="me-2" />
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
                  <FontAwesomeIcon icon={faHeart} />
                  {wishlistCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {wishlistCount}
                      <span className="visually-hidden">items in wishlist</span>
                    </span>
                  )}
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
    </>
  );
}

export default Navbar;