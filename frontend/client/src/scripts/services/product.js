import { ProductFactory } from "../util/typeFactories";
import "../util/types";

function reportUnknownError() {
  console.error(`ERRPRODUCT`);
  return 'Unknown error occurred';
}

/**
 * @returns {Promise<Result<Category[]>>} list of products
 */
export async function getCategorizedProductList() {
  /**
   * @type {Result<Category[]>}
   */
  const result = { response: null, error: null };

  let response = null;

  try {
    response = await fetch("http://localhost:5000/api/products");
  } catch (error) {
    result.error = reportUnknownError();
    return result;
  }

  const status = response?.status || 500;

  if (!response) {
    result.error = reportUnknownError();
    return result;
  }

  try {
    response = await response.json();
  } catch (error) {
    result.error = reportUnknownError();
    return result;
  }

  if (status < 200 || status >= 300) {
    result.error = response.error || reportUnknownError();
    return result;
  }

  /**
   * @type {Category[]}
   */
  const list = [];

  // segregate products into categories
  const setOfCategories = new Set();
  response.forEach(product => setOfCategories.add(product.category));

  for (const category of setOfCategories) {
    list.push({ name: category, products: [] });
  }

  // add products to categories
  for (const product of response) {
    product.id = product._id;
    product.bannerImage = product.images[0];
    ProductFactory.validateSchema(product);
    for (const category of list) {
      if (product.category === category.name) {
        category.products.push(product);
        break;
      }
    }
  }

  result.response = list;
  result.error = null;
  return result;
}


/**
 * @param {string} productId
 * @returns {Promise<Result<Product>>} product
 */
export async function getProductById(productId) {

  /**
   * @type {Result<Product>}
   */
  const result = { response: null, error: null };

  let response = null;

  try {
    response = await fetch(`http://localhost:5000/api/products/${productId}`);
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
    response = await response.json();
  } catch (error) {
    result.error = reportUnknownError();
    console.error(error);
    return result;
  }

  if (status < 200 || status >= 300) {
    result.error = response.error || reportUnknownError();
    return result;
  }

  response.id = response._id;
  response.bannerImage = response.images[0];
  ProductFactory.validateSchema(response);

  result.response = response;
  result.error = null;
  return result;
}
