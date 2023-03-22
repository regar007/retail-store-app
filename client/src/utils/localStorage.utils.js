import { UI_HOST, UI_PORT } from "../config";

const SESSION_TIMEOUT = "SESSION_TIMEOUT";

const writeLocalStorage = (key, value) => {
  if (typeof Storage == "undefined") {
    return false;
  }

  window.localStorage.setItem(key, value);
  return true;
};

const readLocalStorage = key => {
  if (typeof Storage == "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
};


const readSession = () => {
  let sessionValue = null;

  try {
    let data = localStorage.getItem('user')
    sessionValue = JSON.parse(data)
  
  } catch (e) {
    console.log(e);
  }
  console.log('session ', sessionValue)

  return sessionValue;
};

const clearSession = () => {
    
    if(window.localStorage) 
      window.localStorage.clear();
    
    window.location.href =
    `/login`
};

export default {
  readSession,
  clearSession,
  writeLocalStorage,
  readLocalStorage,
  SESSION_TIMEOUT,
};
