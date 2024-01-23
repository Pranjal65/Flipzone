import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, getProductCount, removeFromCart } from "../../scripts/services/cart";
import { getTokenFromLocalStorage } from "../../scripts/services/user";
import { NotificationContext } from "../Contexts";
import { ProductCountContext } from "./Home";
import { assertType } from "../../scripts/util/util";
import "../../scripts/util/types";

/**
 * Add to cart button
 * @param {object} props
 * @param {Product} props.product - Product object
 * @param {function} props.history - Function to navigate to login page
 * @param {function} props.setUpdateUiState - Function to update product details
 */
function AddToCartButton({ product, history, setUpdateUiState }) {

  assertType(product, "object", "product");
  assertType(history, "function", "history");
  assertType(setUpdateUiState, "function", "setUpdateUiState");

  const { setShowNotifWithData } = useContext(NotificationContext);
  const { countAdded, setCountAdded, updateCountAdded } = useContext(ProductCountContext);

  useEffect(() => {
    (async () => {
      await updateCountAdded();
    })();
  }, []);

  /**
   * @param {Product} product
   */
  const handleAddToCart = async (product) => {
    const { response, error } = await addToCart(product.id);
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occured",
        type: "error",
      });
      return;
    }
    await updateCountAdded();
    if (!getTokenFromLocalStorage()) {
      setShowNotifWithData({
        message: "Please login to use cart",
        type: "error",
      });
      history("/login");
      return;
    }
    setShowNotifWithData({
      message: response || "Added to cart",
      type: "success",
    });
    setUpdateUiState(prev => prev + 1);
  }

  /**
   * @param {Product} product
   */
  const handleRemoveFromCart = async (product) => {
    const { response, error } = await removeFromCart(product.id);
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occured",
        type: "error",
      });
      return;
    }
    await updateCountAdded();
    if (!getTokenFromLocalStorage()) {
      setShowNotifWithData({
        message: "Please login to use cart",
        type: "error",
      });
      history("/login");
      return;
    }
    setShowNotifWithData({
      message: response || "Removed from cart",
      type: "success",
    });
    setUpdateUiState(prev => prev - 1);
  }

  // show [-][countAdded][+] if product is already in cart
  if (countAdded > 0) {
    return (
      <div className="w-36 flex justify-between mt-auto">

        <button
          className={`
            w-[30%] h-11
            rounded-l-lg
            bg-green-700 text-white
            hover:bg-green-500 hover:text-white
            transition duration-150 ease-in-out focus:outline-none`}
          onClick={async () => await handleRemoveFromCart(product)}
        >
          <i className="fas fa-minus text-xs"></i>
        </button>

        <div className="w-[40%] h-11 text-lg flex justify-center items-center bg-green-700 text-white">
          {countAdded}
        </div>

        <button
          className={`
            w-[30%] h-11
            rounded-r-lg
            bg-green-700 text-white
            hover:bg-green-500 hover:text-white
            transition duration-150 ease-in-out focus:outline-none`}
          onClick={async () => await handleAddToCart(product)}
        >
          <i className="fas fa-plus text-xs"></i>
        </button>
      </div>
    );
  }

  return (
    <button
      className={`
        bg-green-700 rounded-lg
        mt-auto
        w-36 h-11
        text-white hover:bg-green-500 hover:text-white
        transition duration-150 ease-in-out focus:outline-none`}
      onClick={async () => await handleAddToCart(product)}
    >
      Add to Cart
    </button>
  );
}

/**
 * Modal to show product details
 * @param {object} props
 * @param {Product} props.product - Product object
 * @param {function} props.setVisible - Function to set showProductDetails
 * @param {number} props.updateUiState - Function to update product details
 * @param {function} props.setUpdateUiState - Function to update product details
 */
export default function ProductDetails({ product, setVisible, updateUiState, setUpdateUiState }) {

  const history = useNavigate();

  assertType(product, "object", "product");
  assertType(setVisible, "function", "setVisible");
  assertType(updateUiState, "number", "updateUiState");
  assertType(setUpdateUiState, "function", "setUpdateUiState");

  return (
    <>
      {/* background div: semi-transparent, hide modal on click */}
      <div className="fixed inset-0 flex justify-center items-center content-center z-50"
        style={{ backgroundColor: "#0007" }}
        onClick={e => {
          if (e.currentTarget != e.target) return;
          setVisible(false);
        }}
      >
        {/* product details modal */}
        <div className="color-bg-primary w-[40%] h-50 p-5 rounded-lg">

          {/* flex justify-between: product name and close button */}
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-4">{product.title}</h2>
            <button
              className={`
                color-bg-accent rounded-lg
                px-4 text-red hover:bg-red-500 hover:text-white
                transition duration-150 ease-in-out focus:outline-none`}
              onClick={() => setVisible(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* product details with image and description */}
          <div className="flex justify-left">

            <img
              className="w-[40%] rounded-lg color-border-bg-accent"
              src={product.bannerImage.url}
              alt={product.title}
            />
            <div className="w-[60%] pl-4">
              {
                product.quantity > 0 ?
                <p className="text-xl font-bold color-fg-accent">Rs {product.price}</p> :
                <p className="text-xl font-semibold text-red-600">Out of Stock</p>
              }
              <p className="product-details__description">{product.description}</p>
            </div>

            {/* Add to cart button */}
            <AddToCartButton
              product={product}
              history={history}
              setUpdateUiState={setUpdateUiState} />
          </div>

        </div>
      </div>
    </>
  );
}
