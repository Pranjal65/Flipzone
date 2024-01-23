import React, { useRef, useState, useEffect, useContext } from "react";
import ProductDetails from "./ProductDetails";
import { getProductCount } from "../../scripts/services/cart";
import { getCategorizedProductList, getProductById } from "../../scripts/services/product";
import { assertType } from "../../scripts/util/util";
import { NotificationContext } from "../Contexts";
import "../../scripts/util/types";
import { ProductFactory } from "../../scripts/util/typeFactories";


/**
 * Usage:
 * ```
 * const { countAdded, setCountAdded } = useContext(ProductCountContext);
 * ```
 * where
 * ```
 * countAdded: number
 * setCountAdded: (value: number) => void
 * ```
 * @type {React.Context<{
 *   countAdded: number,
 *   setCountAdded: (value: number) => void,
 *   updateCountAdded: () => Promise<void>,
 * }>} ProductCountContext
 */
export const ProductCountContext = React.createContext({
  countAdded: 0,
  setCountAdded: (value) => { },
  updateCountAdded: async () => { }
});


/**
 * Banner component
 * @param {React.PropsWithChildren} props
 */
export function Banner(props) {
  return (
    <div className="relative bg-blue-500 text-white py-16">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Discover the Latest Trends
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Explore our curated collection of fashion and accessories.
          </p>
          <a
            href="/"
            className="
              bg-white text-blue-500
              font-bold py-2 px-6 rounded-full
              hover:bg-blue-700 hover:text-white
              transition duration-150"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.productId - Product object
 */
export function Product({ productId }) {

  const [countAdded, setCountAdded] = useState(0);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const { showNotifWithData, setShowNotifWithData } = useContext(NotificationContext);

  /**
   * @type {[Product, function]}
   */
  const [product, setProduct] = useState(ProductFactory.default());

  /**
   * This is used to fetch product details everytime cart button is clicked
   * and also when the modal opens for the first time
   * @type {[number, function]}
   */
  const [updateUiState, setUpdateUiState] = useState(0);

  /**
   * @param {string} productId
   * @returns {Promise<void>}
   */
  const updateCountAdded = async (productId = product.id) => {
    const { response, error } = await getProductCount(productId);
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occured",
        type: "error",
      });
      return;
    }
    setCountAdded(response || 0);
  }

  // fetch product details every time updateUiState changes
  // this is done to keep product data on the modal updated real-time
  useEffect(() => {
    (async () => {
      const { response, error } = await getProductById(productId);
      if (error) {
        console.log(error);
        return;
      }
      const newProduct = response || product;
      setProduct(newProduct);
      if (newProduct?.id)
        await updateCountAdded(newProduct.id);
    })();
  }, [updateUiState]);

  useEffect(() => {
    (async () => {
      await updateCountAdded();
    })();
  }, [product]);

  return (
    <ProductCountContext.Provider value={{ countAdded, setCountAdded, updateCountAdded }}>
      {showProductDetails &&
        <ProductDetails
          product={product}
          setVisible={setShowProductDetails}
          updateUiState={updateUiState}
          setUpdateUiState={setUpdateUiState}
        />
      }

      <div key={product.id}
        className="flex-shrink-0 m-2 rounded-lg color-border-bg-accent p-3 cursor-pointer"
        onClick={() => setShowProductDetails(oldState => true)}
        onContextMenu={e => {
          e.preventDefault();
          setShowNotifWithData({
            message: `[${product.id}]
                      [${product.title}]
                      [${product.price}]`,
            type: "error",
          });
        }}
      >
        {
          product.quantity > 0 ?
          <img className="w-40 rounded-lg mb-2" src={product.bannerImage.url} alt={product.title} /> :
          <div className="w-40 h-40 rounded-lg mb-2 flex justify-center items-center">
            <img className="w-full rounded-lg opacity-50" src={product.bannerImage.url} alt={product.title} />
          </div>
        }
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-700">{product.title}</h2>
            {
              product.quantity > 0 ?
                <p className="text-xl font-semibold color-fg-accent">Rs {product.price}</p> :
                <p className="text-md font-semibold text-red-600">Out of Stock</p>
            }
          </div>
          {/* show cart icon and count of items if product is in cart */}
          {countAdded > 0 &&
            <div className="flex justify-between">
              <p className="text-sm text-gray-700">
                <i className="fas fa-shopping-cart text-xs text-gray-500"></i>
                &nbsp; {countAdded}
              </p>
            </div>
          }
        </div>
      </div>
    </ProductCountContext.Provider>
  );
}

/**
 * ProductList component
 * @param {object} props
 * @param {Product[]} props.products - List of products
 */
export function ProductList({ products }) {

  /**
   * @returns {React.MutableRefObject<HTMLDivElement>}
   */
  const useHorizontalScroll = function () {

    /** @type {React.MutableRefObject<HTMLDivElement | undefined>} */
    const ref = useRef();

    useEffect(() => {

      if (!ref?.current) return;
      /** @type {HTMLElement} */
      const reference = ref.current;

      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        reference.scrollTo({
          left: reference.scrollLeft + e.deltaY,
          behavior: "smooth"
        });
      };

      reference.addEventListener("wheel", onWheel);
      return () => reference.removeEventListener("wheel", onWheel);
    }, []);

    // @ts-ignore
    return ref;
  }


  return (
    <div
      ref={useHorizontalScroll()}
      className="flex w-full overflow-hidden select-none hover:overflow-x-auto"
    >
      {products.map((product, index) => (
        <Product key={product.id} productId={product.id} />
      ))}
    </div>
  );
}

/**
 * CategoryContainer component
 * @param {object} props
 * @param {object} props.category - Category object
 * @param {string} props.category.name - Category name
 * @param {Product[]} props.category.products - List of products
 */
export function CategoryContainer({ category }) {

  assertType(category, "object", "category");
  assertType(category.name, "string", "category.name");
  assertType(category.products, "object", "category.products");

  return (
    <>
      <div className="color-bg-primary p-5 m-10 flex flex-col items-center">
        <h1 className="text-xl font-bold color-fg-primary w-full">{category.name}</h1>
        <ProductList products={category.products} />
      </div>
    </>
  );
}

/**
 * Home component
 * @param {React.PropsWithChildren} props
 * @returns {JSX.Element} - Home component
 */
export default function Home(props) {

  /** @type {[Category[], (value: Category[]) => void]} */
  // @ts-ignore
  const [listOfCategories, setListOfCategories] = useState([]);

  useEffect(() => {
    /* useEffect doesnt take async functions */
    (async () => {
      const { response, error } = await getCategorizedProductList();
      if (error || !response) {
        console.error(error);
        return;
      }
      setListOfCategories(response || []);
    })();

  }, []);

  if (listOfCategories.length === 0 || listOfCategories[0].products.length === 0) {
    return (
      <div className="flex justify-center items-center color-bg-secondary" style={{ minHeight: "100vh" }}>
        <h1 className="text-center">No products found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 color-bg-secondary min-h-screen">

        <Banner />

        {listOfCategories.map((category, index) => {
          // verify type of category
          if (typeof category !== "object") {
            throw new Error(`category at ${index} is not an object`);
          }

          // verify type of category.name
          if (typeof category.name !== "string") {
            throw new Error(`category.name at ${index} is not a string`);
          }

          // verify type of category.products
          if (!Array.isArray(category.products)) {
            throw new Error(`category.products at ${index} is not an array`);
          }

          return <CategoryContainer key={category.name} category={category} />;
        })}
      </div>
    </>
  );
}
