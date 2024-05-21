const TOKEN = 'ecom-token';
const USER = 'ecom-user';

export const saveToken = (token) => {
  window.localStorage.removeItem(TOKEN);
  window.localStorage.setItem(TOKEN, token);
};

export const saveUser = (user) => {
  window.localStorage.removeItem(USER);
  window.localStorage.setItem(USER, JSON.stringify(user));
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