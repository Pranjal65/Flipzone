import { useContext } from 'react';
import { LoginContext } from '../../components/Contexts';
import "../util/types";


function reportUnknownError() {
  console.error(`ERRUSER`);
  return 'Unknown error occurred';
}

/**
 * @returns {boolean} isLoggedIn
 */
export function useGetLoginStatus() {
  // @ts-ignore
  const { isLoggedIn } = useContext(LoginContext);
  return isLoggedIn;
}

/**
 * @returns {{ accessToken: string, refreshToken: string } | null} token
 */
export function getTokenFromLocalStorage() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

/**
 * @param {boolean} newState - New login state
 * @returns {void}
 */
export function useSetLoginStatus(newState) {
  // @ts-ignore
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  setIsLoggedIn(newState);
}


/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Result<{ accessToken: string, refreshToken: string }>>}
 */
export async function registerUser(username, email, password) {

  /**
   * @type {Result<{ accessToken: string, refreshToken: string }>}
   */
  const result = { response: null, error: null };

  let response = null;

  try {
    response = await fetch("http://localhost:5000/api/auth/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, email, password })
    });
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  const status = response?.status || 500;

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  try {
    response = await response?.json();
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  // response neither has accessToken nor refreshToken
  if (!response.accessToken || !response.refreshToken) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  if (status < 200 || status >= 300) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken
  };
  result.error = null;

  localStorage.setItem('accessToken', result.response.accessToken);
  localStorage.setItem('refreshToken', result.response.refreshToken);
  return result;
}


/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Result<{ accessToken: string, refreshToken: string }>>}
 */
export async function loginUser(email, password) {

  /**
   * @type {Result<{ accessToken: string, refreshToken: string }>}
   */
  const result = { response: null, error: null };

  let response = null;

  try {
    response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  const status = response?.status || 500;

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  try {
    response = await response?.json();
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  // response neither has accessToken nor refreshToken
  if (!response.accessToken || !response.refreshToken) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  if (status < 200 || status >= 300) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken
  };
  result.error = null;

  localStorage.setItem('accessToken', result.response.accessToken);
  localStorage.setItem('refreshToken', result.response.refreshToken);
  return result;
}

/**
 * @returns {Promise<Result<string>>}
 */
export async function logoutUser() {

  /**
   * @type {Result<string>}
   */
  const result = { response: null, error: null };

  let response = null;

  try {
    response = await fetch("http://localhost:5000/api/auth/logout", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ accessToken: localStorage.getItem('accessToken') })
    });
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  try {
    response = await response?.json();
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  // response neither has accessToken nor refreshToken
  if (!response.message) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = response.message;
  result.error = null;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return result;
}
