import React, { useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";

import Header from "./uielements/Header";
import Footer from "./uielements/Footer";
import UserRegistration from "./pages/UserRegistration"
import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Notification from "./uielements/Notification";
import { LoginContext, NotificationContext } from "./Contexts";
import "../scripts/util/types";
import { getTokenFromLocalStorage } from "../scripts/services/user";

export default function App() {

  /**
   * @returns {boolean} true if token is present in localStorage
   */
  const checkIfLoggedIn = () => {
    const token = getTokenFromLocalStorage();
    return !!token;
  }

  // set default value of isLoggedIn to result of checkIfLoggedIn()
  const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn());

  /**
   * setting to null will hide the notification
   * @type {[
   *   import("./Contexts").NotificationData | null,
   *   (value: import("./Contexts").NotificationData) => void
   * ]}
   */
  // @ts-ignore
  const [showNotifWithData, setShowNotifWithData] = useState(null);

  useEffect(() => {
    /* listen for changes in localStorage and reload page
       reload happens if localStorage is cleared or token is removed
       this is to update the isLoggedIn state */
    window.addEventListener("storage", () => {
      const newLoggedIn = checkIfLoggedIn();
      // @ts-ignore
      setIsLoggedIn(oldValue => newLoggedIn);
      if (!newLoggedIn) localStorage.clear();
    })
  }, []);

  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          <NotificationContext.Provider value={{ showNotifWithData, setShowNotifWithData }}>

            {/* search bar is not used */}
            <Header showSearchBar={false} />

            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                {!isLoggedIn
                  ? <Route path="/login" element={<UserLogin />} />
                  : <Route path="/login" element={<Home />} />
                }
                {!isLoggedIn
                  ? <Route path="/signup" element={<UserRegistration />} />
                  : <Route path="/signup" element={<Home />} />
                }
                {
                  !isLoggedIn
                    ? <Route path="/cart" element={<UserLogin />} />
                    : <Route path="/cart" element={<Cart />} />
                }
              </Routes>
            </div>
            <Footer placeBottom={false} />

            {showNotifWithData &&
              <Notification
                // @ts-ignore
                message={showNotifWithData.message}
                // @ts-ignore
                type={showNotifWithData.type}
                setShowNotifWithData={setShowNotifWithData}
              />
            }

          </NotificationContext.Provider>
        </LoginContext.Provider>
      </BrowserRouter>
    </>
  );
}
