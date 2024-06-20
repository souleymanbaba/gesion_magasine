import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as BiIcons from 'react-icons/bi';
import './Header.css';
import { savelang } from '../../Account/userStorageService';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [sidebar, setSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // Set language from localStorage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setSelectedLanguage(storedLanguage);
    }
  }, [i18n]);

  const SidebarData = [
   
    {
      title: t('category'),
      path: '/admin/Categorie',
      icon: <IoIcons.IoMdApps />,
      cName: 'nav-text'
    },
    {
      title: t('produ'),
      path: '/admin/ProductsA',
      icon: <FaIcons.FaShoppingCart />,
      cName: 'nav-text'
    },
    {
      title: t('ord'),
      path: '/admin/orders',
      icon: <IoIcons.IoIosListBox />,
      cName: 'nav-text'
    },
    {
      title: t('orders.marque'),
      path: '/admin/Marque',
      icon: <FaIcons.FaTags />,
      cName: 'nav-text'
    },
    {
      title: t('logout'),
      path: '/logout',
      icon: <BiIcons.BiLogOut />,
      cName: 'nav-text'
    }
  ];

  const showSidebar = () => setSidebar(!sidebar);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng); // Store selected language in localStorage
  };

  const directionClass = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
  const menuClass = selectedLanguage === 'ar' ? 'menu-ar' : '';

  return (
    <>
      <nav dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className={`navbar ${directionClass}`}>
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
          <nav className={`nav-menu ${menuClass} ${sidebar ? 'active' : ''}`}>
            <ul className='nav-menu-items' onClick={showSidebar}>
              <li className='navbar-toggle'>
                <Link to='#' className='menu-bars'>
                  <FaIcons.FaTimes onClick={showSidebar} />
                </Link>
              </li>
              {SidebarData.map((item, index) => (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li className={`nav-text language-buttons ${directionClass}`}>
                <button
                  className={`language-button ${selectedLanguage === 'fr' ? 'active' : ''}`}
                  onClick={() => changeLanguage('fr')}
                >
                  🇫🇷
                </button>
                <button
                  className={`language-button ${selectedLanguage === 'ar' ? 'active' : ''}`}
                  onClick={() => changeLanguage('ar')}
                >
                  🇸🇦
                </button>
              </li>
            </ul>
          </nav>
        </IconContext.Provider>
      </nav>
    </>
  );
}

export default Navbar;
