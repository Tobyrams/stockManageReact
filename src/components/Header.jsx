import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "./SideBarComponent";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import { Ellipsis, LogOut } from "lucide-react";

function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/stock":
        return "Stock";
      case "/ingredients":
        return "Ingredients";
      case "/product":
        return "Product";
      case "/analytics":
        return "Analytics";
      case "/finances":
        return "Finances";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar shadow-md bg-base-100">
        {/* Sidebar Component */}
        <div className="flex-none">
          <SideBarComponent />
        </div>

        {/* Header Title */}
        <div className="flex-1">
          <span className="text-2xl font-semibold pl-2">{getPageTitle()}</span>
        </div>

        {/* Dropdown */}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            {/* Dropdown Btn */}
            <button className="btn btn-square btn-ghost">
              <Ellipsis />
            </button>
            {/* Dropdown Content */}
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content ring-1 ring-base-300 bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow-md "
            >
              <li>
                <ProfileModal />
              </li>
              <li>
                <ThemeToggle />
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>
                  Logout <LogOut size={17} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
