const TOKEN = 'ecom-token';
const USER = 'ecom-user';
const Lang = 'fr'
export const saveToken = (token) => {
  window.localStorage.removeItem(TOKEN);
  window.localStorage.setItem(TOKEN, token);
};

export const saveUser = (user) => {
  window.localStorage.removeItem(USER);
  window.localStorage.setItem(USER, JSON.stringify(user));
};



export const getlang = () => {
 const Lang = localStorage.getItem(Lang);
 return Lang ? JSON.parse(Lang) : null;
};


export const savelang = (lang) => {
 window.localStorage.removeItem(Lang);
 window.localStorage.setItem("lang", JSON.stringify(lang));
};


export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const getUser = () => {
  const user = localStorage.getItem(USER);
  return user ? JSON.parse(user) : null;
};

export const getUserId = () => {
  const user = getUser();
  return user ? user.userId : '';
};

export const signOut = () => {
  window.localStorage.removeItem(TOKEN);
  window.localStorage.removeItem(USER);
};

export const isLoggedIn = () => {
  const token = getToken();
  return token ? true : false;
};
