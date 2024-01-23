import React, { useEffect, useContext } from "react";
import { NotificationContext } from "../Contexts";
import { assertType } from "../../scripts/util/util";

/**
 * Show notification
 * @param {string} message
 * @param {string} type - success or error
 * @returns {void}
 */
export function useShowNotification(message, type) {
  const { showNotifWithData, setShowNotifWithData } = useContext(NotificationContext);
  setShowNotifWithData({ message, type });
}

/**
 * Notification component
 * @param {object} props
 * @param {string} props.message
 * @param {string} props.type - success or error
 * @param {function} props.setShowNotifWithData - To hide notification after timeout
 */
export default function Notification({ message, type, setShowNotifWithData }) {

  assertType(message, "string", "message");
  assertType(type, "string", "type");
  assertType(setShowNotifWithData, "function", "setShowNotifWithData");

  useEffect(() => {
    // hide notification after 3 seconds
    const timeout = setTimeout(() => setShowNotifWithData(oldValue => null), 3000);
    return () => clearTimeout(timeout);
  }, [setShowNotifWithData]);

  return (
    <>
      {/* background div: fully-transparent, hide notification on click
          the bottom-full prevents the content div from taking up the whole screen
          which would prevent the background elements from being clicked */}
      <div className="fixed inset-0 bottom-full flex justify-center items-start content-center z-50"
        style={{ backgroundColor: "transparent" }}
        onClick={e => {
          if (e.target !== e.currentTarget) return;
          setShowNotifWithData(oldValue => null);
        }}
      >
        {/* notification div */}
        <div
          className="mt-5 color-bg-primary w-[40%] h-50 p-5 rounded-lg bg-red"
          style={{ backgroundColor: type === "success" ? "rgb(134, 239, 172)" : "rgb(254, 202, 202)" }}
        >
          {/* flex justify-between: message and close button */}
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">{message}</h2>

            {/* close button: red oh hover */}
            <button
              className={`
              color-bg-accent rounded-lg
              px-2 text-red hover:bg-red-500 hover:text-white
              transition duration-150 ease-in-out focus:outline-none`}
              onClick={() => setShowNotifWithData(oldValue => null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
