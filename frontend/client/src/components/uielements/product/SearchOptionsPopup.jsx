import React from "react";
import { assertType } from "../../../scripts/util/util";

/**
 * Used along with the search bar.
 * @param {Object} props - props
 * @param {String} props.searchText - search text, used to show suggestions
 * @param {Boolean} props.showPopup - whether to show the popup
 * @returns {JSX.Element} - NavBar component
 */
export default function SearchOptionsPopup({ searchText, showPopup = false }) {

  assertType(searchText, "string", "searchText");
  assertType(showPopup, "boolean", "showPopup");

  if (!showPopup) return <></>;

  let listStyle = "px-5 py-2 hover:bg-gray-100 cursor-pointer";

  const suggestions = [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3",
    "Suggestion 4",
    "Suggestion 5",
    "Suggestion 6",
  ];

  // if suggestions is empty, return null
  if (suggestions.length === 0) return <></>;

  return (
    <>
      <div className="fixed w-1/2 top-14">
        <ul className="color-bg-primary rounded-lg color-border-bg-accent w-full list-none shadow-md">
          {suggestions.map((suggestion, index) => {
            // add rounded corners to first and last list items
            const thisListStyle = index === 0 ?
              `${listStyle} rounded-t-lg` : index === suggestions.length - 1 ?
                `${listStyle} rounded-b-lg` : listStyle;
            return (
              <li key={index} className={thisListStyle}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
