import React from "react";
import NavBar from "./NavBar";
import SearchBar from "./product/SearchBar";

// @ts-ignore
import logo from "../../res/logo.svg";
import { assertType } from "../../scripts/util/util";

/**
 * Header component
 * @param {object} props
 * @param {boolean?} props.showSearchBar - Whether to show the search bar
 * @returns {JSX.Element} - Header component
 */
export default function Header({ showSearchBar = true }) {
  
  assertType(showSearchBar, "boolean", "showSearchBar");

  return (
    <header className="flex justify-around items-center color-bg-primary shadow-md">
      <a href="/">
        <div className="flex items-center">
          <img className="w-16" src={logo} alt="logo" />
          <span className="text-xl font-semibold color-fg-accent">FlipZone</span>
        </div>
      </a>
      <SearchBar showSearchBar={showSearchBar} />
      <NavBar />
    </header>
  );
}
