import { getTokenFromLocalStorage } from "../services/user";
import "../util/types";

function reportUnknownError() {
  console.error(`ERRCART`);
  return 'Unknown error occurred';
}

/**
 * Get cart from local storage
 * @returns {Promise<Result<CartItem[]>>} cart
 */
export async function getCart() {
  /**
   * @type {Result<CartItem[]>}
   */
  const result = { response: null, error: null };

  const token = getTokenFromLocalStorage()?.accessToken;
  if (!token) {
    result.error = "User not logged in";
    return result;
  }

  let response = null;
  
  try {
    response = await fetch('http://localhost:5000/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
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

  // if response is not an array, throw error
  if (!Array.isArray(response) || (status < 200 || status >= 300)) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = response;
  result.error = null;
  return result;
}


/**
 * Add product to cart
 * @param {string} productId
 * @returns {Promise<Result<string>>} message for notification
 */
export async function addToCart(productId) {
  /**
   * @type {Result<string>}
   */
  const result = { response: null, error: null };

  const token = getTokenFromLocalStorage()?.accessToken;
  if (!token) {
    result.error = 'User not logged in';
    return result;
  }

  let response = null;

  try {
    response = await fetch('http://localhost:5000/cart/add-to-cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ _id: { $oid: productId } })
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

  // check response status not in ranges [200, 300)
  if (status < 200 || status >= 300) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = response.message;
  result.error = null;
  return result;
}


/**
 * Remove product from cart
 * @param {string} productId
 * @returns {Promise<Result<string>>} message for notification
 */
export async function removeFromCart(productId) {

  /**
   * @type {Result<string>}
   */
  const result = { response: null, error: null };

  const token = getTokenFromLocalStorage()?.accessToken;
  if (!token) {
    throw new Error('User not logged in');
  }

  let response = null;

  try {
    response = await fetch(`http://localhost:5000/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
    });
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  const status = response?.status || 500;

  try {
    response = await response?.json();
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  // check response status not in ranges [200, 300)
  if (status < 200 || status >= 300) {
    result.error = response.message || reportUnknownError();
    return result;
  }

  result.response = response.message;
  result.error = null;
  return result;
}


/**
 * Get total quanity of a specific product in cart
 * @param {string} productId
 * @returns {Promise<Result<number>>} productQuantity
 */
export async function getProductCount(productId) {

  /**
   * @type {Result<number>}
   */
  const result = { response: null, error: null };

  if (!productId) {
    result.response = 0;
    result.error = null;
    return result;
  }

  const token = getTokenFromLocalStorage()?.accessToken;
  if (!token) {
    result.response = 0;
    result.error = null;
    return result;
  }

  let response = null;

  try {
    response = await fetch(`http://localhost:5000/cart/Count-Of-Product/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
    });
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  const status = response?.status || 500;

  try {
    response = await response?.json();
  } catch (error) {
    if (status === 404) {
      result.response = 0;
      result.error = null;
      return result;
    }
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  result.response = response.Quantity;
  result.error = null;
  return result;
}


/**
 * Get total quantity of distinct products in cart
 * @returns {Promise<Result<number>>} distinctQuantity
 */
export async function countDistinctProducts() {
  /**
   * @type {Result<number>}
   */
  const result = { response: null, error: null };

  const { response, error } = await getCart();
  if (error || !Array.isArray(response)) {
    if (error === "User not logged in") {
      result.response = 0;
      result.error = null;
      return result;
    }
    result.error = error;
    return result;
  }
  
  result.response = response.length;
  result.error = null;
  return result;
}


/**
 * Get total quantity of all products in cart
 * @returns {Promise<Result<number>>} totalQuantity
 */
export async function countTotalProducts() {
  /**
   * @type {Result<number>}
   */
  const result = { response: null, error: null };

  const { response, error } = await getCart();
  if (error || !Array.isArray(response)) {
    if (error === "User not logged in") {
      result.response = 0;
      result.error = null;
      return result;
    }
    result.error = error;
    return result;
  }

  result.response = response.reduce((acc, curr) => acc + curr.quantity, 0);
  result.error = null;
  return result;
}


/**
 * Get total price of all products in cart
 * @returns {Promise<Result<number>>} totalPrice
 */
export async function getTotalPrice() {
  /**
   * @type {Result<number>}
   */
  const result = { response: null, error: null };

  const { response, error } = await getCart();
  if (error || !response) {
    result.error = error;
    return result;
  }

  result.response = response.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  result.error = null;
  return result;
}
