import "./types";
import { assertType } from "./util";

export class ResultFactory {
    /**
     * @template T
     * @param {T | null} response
     * @param {string | null} error
     */
    static create(response, error) {
        /**
         * @type {Result<T>}
         */
        const result = {
            response,
            error
        };
        return result;
    }
}

export class ProductImageFactory {
    /**
     * @param {string} public_id
     * @param {string} url
     */
    static create(public_id, url) {
        /**
         * @type {ProductImage}
         */
        const productImage = {
            public_id,
            url
        };
        return productImage;
    }
    /**
     * @returns {ProductImage}
     */
    static default() {
        return this.create('', '');
    }
}

export class ProductFactory {
    /**
     * @param {string} title
     * @param {string} description
     * @param {number} price
     * @param {string} category
     * @param {string} brand
     * @param {number} quantity
     * @param {number} sold
     * @param {ProductImage[]} images
     * @param {string} id
     * @param {string} _id
     * @param {ProductImage} bannerImage
     */
    static create(title, description, price, category, brand, quantity, sold, images, id, _id, bannerImage) {
        /**
         * @type {Product}
         */
        const product = {
            title,
            description,
            price,
            category,
            brand,
            quantity,
            sold,
            images,
            id,
            _id,
            bannerImage
        };
        return product;
    }
    /**
     * @returns {Product}
     */
    static default() {
        return this.create('', '', 0, '', '', 0, 0, [], '', '', ProductImageFactory.create('', ''));
    }
    /**
     * @param {Product} product
     * @returns {void}
     */
    static validateSchema(product) {
        assertType(product, "object", "product");
        assertType(product.title, "string", "product.title");
        assertType(product.description, "string", "product.description");
        assertType(product.price, "number", "product.price");
        assertType(product.category, "string", "product.category");
        assertType(product.brand, "string", "product.brand");
        assertType(product.quantity, "number", "product.quantity");
        assertType(product.sold, "number", "product.sold");
        assertType(product.images, "object", "product.images");
        assertType(product.id, "string", "product.id");
        assertType(product._id, "string", "product._id");
        assertType(product.bannerImage, "object", "product.bannerImage");
        assertType(product.bannerImage.public_id, "string", "product.bannerImage.public_id");
        assertType(product.bannerImage.url, "string", "product.bannerImage.url");
    }
}

export class CategoryFactory {
    /**
     * @param {string} name
     * @param {Product[]} products
     */
    static create(name, products) {
        /**
         * @type {Category}
         */
        const category = {
            name,
            products
        };
        return category;
    }
    /**
     * @returns {Category}
     */
    static default() {
        return this.create('', []);
    }
}

export class CartItemFactory {
    /**
     * @param {string} _id
     * @param {string} userId
     * @param {string} productId
     * @param {number} quantity
     * @param {number} price
     * @param {number} __v
     */
    static create(_id, userId, productId, quantity, price, __v) {
        /**
         * @type {CartItem}
         */
        const cartItem = {
            _id,
            userId,
            productId,
            quantity,
            price,
            __v
        };
        return cartItem;
    }
    /**
     * @returns {CartItem}
     */
    static default() {
        return this.create('', '', '', 0, 0, 0);
    }
}
