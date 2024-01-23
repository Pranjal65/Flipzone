import React, { createContext } from "react";
import "../scripts/util/types";

/**
 * @typedef {Object} LoginContextDefault
 * @property {boolean} isLoggedIn
 * @property {(value: boolean) => void} setIsLoggedIn
 */

/**
 * @type {LoginContextDefault}
 */
const loginContextDefault = {
  isLoggedIn: false,
  setIsLoggedIn: (value) => { },
};

/**
 * Usage:
 * ```
 * const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
 * ```
 * where
 * ```
 * isLoggedIn: boolean
 * setIsLoggedIn: (boolean) => any
 * ```
 * @type {React.Context<LoginContextDefault>}
 */
export const LoginContext = createContext(loginContextDefault);


/**
 * @typedef {Object} NotificationData
 * @property {string} message
 * @property {string} type
 */

/**
 * @typedef {Object} NotificationContextDefault
 * @property {NotificationData | null} showNotifWithData
 * @property {(value: NotificationData) => void} setShowNotifWithData
 */

/**
 * @type {NotificationContextDefault}
 */
const notificationContextDefault = {
  showNotifWithData: null,
  setShowNotifWithData: (value) => { },
};

/**
 * Usage:
 * ```
 * const { showNotifWithData, setShowNotifWithData } = useContext(NotificationContext);
 * ```
 * where
 * ```
 * showNotifWithData: { message: string, type: string } | null
 * setShowNotifWithData: ({ message: string, type: string }) => any
 * ```
 * @type {React.Context<NotificationContextDefault>}
 */
export const NotificationContext = createContext(notificationContextDefault);
