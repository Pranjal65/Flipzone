import React, { useContext, useEffect, useState } from 'react';
import { getProductById } from '../../scripts/services/product';
import { getCart, addToCart, removeFromCart, getTotalPrice } from "../../scripts/services/cart";
import { NotificationContext } from "../Contexts";
import "../../scripts/util/types";

const CartPage = () => {
  /**
   * State variable to store cart items
   * @type {[CartItem[], function]}
   */
  const [cartItems, setCartItems] = useState([]);

  /**
   * @type {[number, function]}
   */
  const [totalPrice, setTotalPrice] = useState(0);

  /**
   * @type {[number, function]}
   */
  const [cartChangedIndicator, setCartChangedIndicator] = useState(0);

  const { setShowNotifWithData } = useContext(NotificationContext);

  // Fetch cart items and update price from the server every time the cart changes
  useEffect(() => {
    (async () => {

      const cartItemsResult = await getCart();
      if (cartItemsResult.error) {
        setShowNotifWithData({
          message: cartItemsResult.error || "Unknown error occurred",
          type: "error"
        });
        return;
      }

      cartItemsResult.response = cartItemsResult.response || [];

      for (let i = 0; i < cartItemsResult.response.length; ++i) {
        const { response, error } = await getProductById(cartItemsResult.response[i].productId);
        if (error) {
          setShowNotifWithData({
            message: error || "Unknown error occurred",
            type: "error"
          });
          delete cartItemsResult.response[i];
          continue;
        }

        if (!response) {
          setShowNotifWithData({
            message: "Unknown error occurred",
            type: "error"
          });
          delete cartItemsResult.response[i];
          continue;
        }

        // @ts-ignore
        cartItemsResult.response[i].title = response.title;
        // @ts-ignore
        cartItemsResult.response[i].bannerImage = response.bannerImage
      }

      setCartItems(cartItemsResult.response);

      // Update the total price
      const priceResult = await getTotalPrice();
      if (priceResult.error) {
        setShowNotifWithData({
          message: priceResult.error || "Unknown error occurred",
          type: "error"
        });
        return;
      }

      setTotalPrice(priceResult.response);

    })();
  }, [cartChangedIndicator]);


  /**
   * Function to update the quantity of an item in the cart
   * @param {string} productId ID of the product to update
   * @returns {Promise<void>}
   */
  const handleAddItem = async (productId) => {
    const { response, error } = await addToCart(productId);
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occurred",
        type: "error"
      });
      return;
    }

    if (!response) {
      setShowNotifWithData({
        message: "Unknown error occurred",
        type: "error"
      });
      return;
    }

    setCartChangedIndicator(oldVal => oldVal + 1);
    setShowNotifWithData({
      message: response || "Item added to cart",
      type: "success"
    });
  };

  /**
   * Function to reduce the quantity of an item in the cart
   * @param {string} productId ID of the product to update
   * @returns {Promise<void>}
   */
  const handleRemoveItem = async (productId) => {
    const { response, error } = await removeFromCart(productId);
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occurred",
        type: "error"
      });
      return;
    }

    if (!response) {
      setShowNotifWithData({
        message: "Unknown error occurred",
        type: "error"
      });
      return;
    }

    setCartChangedIndicator(oldVal => oldVal - 1);
    setShowNotifWithData({
      message: response || "Item removed from cart",
      type: "success"
    });
  };

  /**
   * Function to remove an item from the cart
   * @param {string} productId ID of the product to remove
   * @returns {Promise<void>}
   */
  const handleRemoveCompletely = async (productId) => {
    // get current quantity of the item
    const qty = cartItems.find(item => item.productId === productId)?.quantity || 0;
    // remove the item from the cart repeatedly until the quantity becomes 0
    for (let i = 0; i < qty; i++) {
      await handleRemoveItem(productId);
    }
  };

  /**
   * Function to clear the cart
   * @returns {Promise<void>}
   */
  const handleClearCart = async () => {
    // remove all items from the cart
    for (const item of cartItems) {
      await handleRemoveCompletely(item.productId);
    }
  };

  /**
   * Function to handle checkout
   */
  const handleCheckout = () => {
    setShowNotifWithData({
      message: "Checkout",
      type: "success"
    });
  };


  if (cartItems.length === 0) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold color-fg-accent mb-6">Shopping Cart</h2>
        </div>
        <div className="flex justify-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-gray-700 text-lg font-bold">Your cart is empty</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="flex justify-center items-center min-h-screen p-10">
      <div className="w-full max-w-xl">

        <div className="text-center">
          <h2 className="text-4xl font-extrabold color-fg-accent mb-6">Shopping Cart</h2>
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

          {/* Fetch and display cart items dynamically */}
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="h-50 flex w-full justify-around items-center mb-4 border-b pb-4">

              <img src={
                // @ts-ignore
                item.bannerImage.url
              } alt="product" className="w-[15%] rounded-lg" />

              <div key={item.productId} className="w-[80%]">
                <p className="text-gray-700 text-lg font-bold">{
                  // @ts-ignore
                  item.title
                }</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() => handleAddItem(item.productId)}
                    >
                      <i className="text-xs fas fa-plus"></i>
                    </button>
                    <p className="text-md text-gray-600 mx-3">{item.quantity}</p>
                    <button
                      className="text-red-500 hover:underline focus:outline-none"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <i className="text-xs fas fa-minus"></i>
                    </button>
                  </div>
                  <p className="text-gray-700 font-bold">Rs {item.price * item.quantity}</p>
                  <button
                    className="ml-2 text-red-500 hover:underline focus:outline-none"
                    onClick={() => handleRemoveCompletely(item.productId)}
                  >
                    <i className="text-xs fas fa-trash"></i>
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Display total price of items in the cart */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-700 text-lg font-bold">Total:</p>
            <p className="text-gray-700 font-bold">Rs {totalPrice.toFixed(2)}</p>
          </div>

          {/* Options to proceed to checkout */}
          <div className="mt-6">
            <button
              className="
                bg-blue-500 hover:bg-blue-700 text-white
                font-bold py-2 px-4 rounded focus:outline-none
                focus:shadow-outline mr-2"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            <button
              className="
                bg-gray-300 hover:bg-gray-400 text-gray-700
                font-bold py-2 px-4 rounded focus:outline-none
                focus:shadow-outline"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;


// export default function Cart() {
//   const cartItems=[{
//       productName:"Headphones",
//       quantity:2,
//       price : 2500
//   }];

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-md">
//         <div className="text-center">
//           <h2 className="text-4xl font-extrabold text-blue-600 mb-6">Shopping Cart</h2>
//         </div>
//         <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//           {/* Fetch and display cart items dynamically */}
//           {cartItems.map((item) => (
//             <div key={item.productId} className="mb-4 border-b pb-4">
//               <p className="text-gray-700 text-lg font-bold">{item.productName}</p>
//               <div className="flex justify-between items-center mt-2">
//                 <div className="flex items-center">
//                   <p className="text-gray-600">Quantity: {item.quantity}</p>
//                 </div>
//                 <p className="text-gray-700 font-bold">${item.price * item.quantity}</p>
//               </div>
//             </div>
//           ))}


//           {/* Display total price of items in the cart */}
//           <div className="flex justify-between items-center mt-4">
//             <p className="text-gray-700 text-lg font-bold">Total:</p>
//             <p className="text-gray-700 font-bold">${getTotalPrice().toFixed(2)}</p>
//           </div>

//           {/* Options to proceed to checkout */}
//           <div className="mt-6">
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
//               // onClick={handleCheckout}
//             >
//               Proceed to Checkout
//             </button>
//             <button
//               className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               // onClick={handleClearCart}
//             >
//               Clear Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
