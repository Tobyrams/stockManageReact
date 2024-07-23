import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "./SideBarComponent";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import { LogOut } from "lucide-react";

function Header() {
  const location = useLocation();
  //   const [isOpen, setIsOpen] = useState(false);
  //   const dropdownRef = useRef(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
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
        return "Dashboard";
    }
  };

  return (
    <>
      <div className="navbar shadow-md bg-base-100">
        <div className="flex-none">
          <SideBarComponent />
        </div>
        {/* Header Title */}
        <div className="flex-1">
          <span className="text-2xl font-semibold pl-2">{getPageTitle()}</span>
        </div>
        <div className="flex-none">
          {/* Dropdown */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
            {/* Dropdown Content */}
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content ring-1 ring-base-300 bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow-md"
            >
              <li>
                <ProfileModal />
              </li>
              <ThemeToggle />
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
      </div>
    </>
  );
}

export default Header;
