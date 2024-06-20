import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './style.css';
import { useTranslation } from 'react-i18next';


const SignUp = () => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { t, i18n } = useTranslation();

  const getDirection = (lang) => {
    if (['ar', 'he', 'fa', 'ur'].includes(lang)) {
      return 'rtl';
    }
    return 'ltr';
  };

  const [direction, setDirection] = useState(getDirection(i18n.language));
  
  useEffect(() => {
    setDirection(getDirection(i18n.language));
  }, [i18n.language]);

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const emailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name: clientName
        })
      });
      if (response.ok) {
        setSuccessMsg(t('signup.successMessage'));
        setClientName("");
        setEmail("");
        setPassword("");
        window.location.href = '/SigIn'; // Utilisez window.location.href pour rediriger vers /SignIn après inscription réussie
      } else {
        const errorData = await response.json();
        alert(`${t('signup.createAccount')} ${t('errors.shortPassword')}: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`${t('signup.createAccount')} ${t('errors.shortPassword')}: ${t('signup.errorMsg')}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!clientName) {
      setErrClientName(t('errors.enterName'));
      isValid = false;
    }
    if (!email) {
      setErrEmail(t('errors.enterEmail'));
      isValid = false;
    } else if (!emailValidation(email)) {
      setErrEmail(t('errors.invalidEmail'));
      isValid = false;
    }
    if (!password) {
      setErrPassword(t('errors.createPassword'));
      isValid = false;
    } else if (password.length < 6) {
      setErrPassword(t('errors.shortPassword'));
      isValid = false;
    }

    if (isValid) {
      await handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100" dir={direction}>
      <div className="w-full max-w-[500px] mx-4">
        {successMsg ? (
          <div className="bg-white rounded-md shadow-md p-8">
            <p className="text-green-500 font-medium text-center mb-4">
              {successMsg}
            </p>
            <Link to="/SigIn">
              
            </Link>
          </div>
        ) : (
          <form className="bg-white rounded-md shadow-md p-8" onSubmit={handleSignUp}>
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              {t('signup.title')}
            </h1>
            <div className="mb-4">
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="clientName">{t('signup.fullName')}</label>
              <input
                id="clientName"
                onChange={handleName}
                value={clientName}
                className={`w-full h-10 border rounded-md px-4 focus:outline-none focus:border-primeColor ${errClientName && "border-red-500"}`}
                type="text"
                placeholder={t('signup.placeholderName')}
              />
              {errClientName && (
                <p className="text-red-500               text-sm mt-1">{errClientName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="email">{t('signup.email')}</label>
              <input
                id="email"
                onChange={handleEmail}
                value={email}
                className={`w-full h-10 border rounded-md px-4 focus:outline-none focus:border-primeColor ${errEmail && "border-red-500"}`}
                type="email"
                placeholder={t('signup.placeholderEmail')}
              />
              {errEmail && (
                <p className="text-red-500 text-sm mt-1">{errEmail}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="password">{t('signup.password')}</label>
              <input
                id="password"
                onChange={handlePassword}
                value={password}
                className={`w-full h-10 border rounded-md px-4 focus:outline-none focus:border-primeColor ${errPassword && "border-red-500"}`}
                type="password"
                placeholder={t('signup.placeholderPassword')}
              />
              {errPassword && (
                <p className="text-red-500 text-sm mt-1">{errPassword}</p>
              )}
            </div>
            <div className="flex items-center mb-4">
              <input
                id="remember"
                onClick={() => setChecked(!checked)}
                className="w-4 h-4"
                type="checkbox"
              />
              <label className="ml-2 text-gray-600" htmlFor="remember">
                {t('signup.termsAndConditions')}
              </label>
            </div>
            <button
              type="submit"
              className={`w-full h-10 rounded-md text-base font-semibold ${checked ? "bg-primeColor text-white hover:bg-black hover:text-white transition duration-300" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
              disabled={!checked}
            >
              {t('signup.createAccount')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;

