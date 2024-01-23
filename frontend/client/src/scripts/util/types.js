/**
 * @template T
 * @typedef {Object} Result
 * @property {T | null} response
 * @property {string | null} error
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} public_id
 * @property {string} url
 */

/**
 * @typedef {Object} Product
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {string} brand
 * @property {number} quantity
 * @property {number} sold
 * @property {ProductImage[]} images
 * @property {string} id
 * @property {string} _id
 * @property {ProductImage} bannerImage
 */

/**
 * @typedef {Object} Category
 * @property {string} name
 * @property {Product[]} products
 */

/**
 * @typedef {Object} CartItem
 * @property {string} _id - item id
 * @property {string} userId - user id
 * @property {string} productId - product id
 * @property {number} quantity - quantity of product
 * @property {number} price - price of product
 * @property {number} __v
 */
