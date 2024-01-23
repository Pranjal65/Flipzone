import React from "react";
import { assertType } from "../../scripts/util/util";

/**
 * Footer component
 * @param {object} props
 * @param {boolean?} props.placeBottom - Whether to use absolute positioning and place at the bottom of the page
 * @returns {JSX.Element} Footer component
 */
export default function Footer({ placeBottom = false }) {

  assertType(placeBottom, "boolean", "placeBottom");

  // verify that placeBottom is a boolean
  if (typeof placeBottom !== "boolean") {
    throw new Error("placeBottom is not a boolean");
  }

  return (
    <footer className={"w-full color-bg-dark color-fg-dark py-10 " + (placeBottom ? "absolute bottom-0" : "")}>
      <div className="flex justify-center">
        <p>FlipZone © 2024</p>
      </div>
    </footer>
  )
}
