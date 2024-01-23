import React from "react";
import { useState } from "react";

import SearchOptionsPopup from "./SearchOptionsPopup";
import { assertType } from "../../../scripts/util/util";

/**
 * Search bar for searching products.
 * Is used in the header of the page.
 * @param {object} props
 * @param {boolean?} props.showSearchBar - Whether to show the search bar or not
 * @returns {JSX.Element} - SearchBar component
 */
export default function SearchBar({ showSearchBar = true }) {
  
  assertType(showSearchBar, "boolean", "showSearchBar");

  const [searchText, setSearchText] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={"w-1/2 " + (!showSearchBar ? "invisible" : "block")}>
      <input
        type="text"
        placeholder="Search products"
        className={`color-bg-accent px-5 py-2 my-3 rounded-lg color-border-bg-accent w-full`}
        value={searchText}
        onChange={(e) => setSearchText(oldValue => {
          // if the search text is empty, hide the popup
          setShowPopup(oldPopupState => e.target.value.length > 0);
          return e.target.value;
        })}
      />
      <SearchOptionsPopup searchText={searchText} showPopup={showPopup} />
    </div>
  );
}
