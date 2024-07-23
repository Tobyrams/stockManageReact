import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartLine,
  HandCoins,
  Layers,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingBasket,
} from "lucide-react";

// Main sidebar component
function SideBarComponent() {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const location = useLocation(); // Hook to access current location

  // Function to close the drawer, called when a link is clicked
  const closeDrawer = useCallback(() => {
    const drawerToggle = document.getElementById("my-drawer");
    if (drawerToggle) {
      drawerToggle.checked = false; // Uncheck the drawer toggle to close it
    }
  }, []);

  // Function to handle navigation link clicks
  const handleNavLinkClick = useCallback(
    (to) => {
      closeDrawer(); // Close the drawer
      navigate(to); // Navigate to the target path
    },
    [closeDrawer, navigate] // Dependencies for useCallback
  );

  // Function to check if the current path matches the given path
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location] // Dependency for useCallback
  );

  // Function to get the tailwind class for a button based on its active state
  const getButtonClass = useCallback(
    (path) =>
      isActive(path)
        ? "font-bold text-primary text-md" // Active state class
        : "hover:text-gray-700 text-md", // Inactive state class
    [isActive] // Dependency for useCallback
  );

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn bg-base-100 drawer-button">
            <i className="fa-solid fa-bars fa-xl"></i>
          </label>
        </div>
        <div className="drawer-side z-10 ">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <h1 className="text-2xl font-medium py-4 border-b-2">Tadinda.</h1>

            <li>
              <button
                onClick={() => handleNavLinkClick("/")}
                className={getButtonClass("/")}
              >
                <LayoutDashboard />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/stock")}
                className={getButtonClass("/stock")}
              >
                <Layers />
                Stock
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/ingredients")}
                className={getButtonClass("/ingredients")}
              >
                <ShoppingBasket />
                Ingredients
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/product")}
                className={getButtonClass("/product")}
              >
                <PackageSearch />
                Product
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/analytics")}
                className={getButtonClass("/analytics")}
              >
                <ChartLine />
                Analytics
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/finances")}
                className={getButtonClass("/finances")}
              >
                <HandCoins />
                Finances
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/logout")}
                className={getButtonClass("/logout")}
              >
                <LogOut />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBarComponent;
