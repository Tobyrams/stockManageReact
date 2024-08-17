import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartLine,
  HandCoins,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Settings,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../assets/Tadinda_new_logo_transparent.png";
import { supabase } from "../supabaseClient"; // Add this import

// Main sidebar component
function SideBarComponent({ isAdmin, session }) {
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
        ? "font-bold text-base-content text-lg" // Active state class
        : "text-gray-500 text-lg hover:font-medium hover:text-base-content", // Inactive state class
    [isActive] // Dependency for useCallback
  );

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Logged out 👋");
    } catch (error) {
      console.error("Error signing out:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="font-poppins">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost bg-base-100 drawer-button"
          >
            <Menu size={30} />
          </label>
        </div>
        <div className="drawer-side z-10 ">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 ">
            {/* Sidebar content here */}
            <div className="flex items-center justify-center gap-4">
              <img src={logo} alt="logo" className="object-cover w-40 h-40 " />
              {/* <h1 className="text-2xl font-bold   pt-4 ">Tadinda.</h1> */}
            </div>

            <div className="divider"></div>

            <li className="pt-4">
              <button
                onClick={() => handleNavLinkClick("/dashboard")}
                className={getButtonClass("/dashboard")}
              >
                <Home size={20} />
                Dashboard
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavLinkClick("/stock")}
                className={getButtonClass("/stock")}
              >
                <Layers size={20} />
                Stock
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/ingredients")}
                className={getButtonClass("/ingredients")}
              >
                <ShoppingBasket size={20} />
                Ingredients
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/product")}
                className={getButtonClass("/product")}
              >
                <PackageSearch size={20} />
                Product
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/analytics")}
                className={getButtonClass("/analytics")}
              >
                <ChartLine size={20} />
                Analytics
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavLinkClick("/finances")}
                className={getButtonClass("/finances")}
              >
                <HandCoins size={20} />
                Finances
              </button>
            </li>

            {/* Divider */}
            <div className="divider"></div>

            {isAdmin && (
              <li>
                <button
                  onClick={() => handleNavLinkClick("/admin")}
                  className={getButtonClass("/admin")}
                >
                  <>
                    <ShieldCheck size={20} />
                    Admin Dashboard
                  </>
                </button>
              </li>
            )}

            <li>
              <button
                onClick={() => handleNavLinkClick("/settings")}
                className={getButtonClass("/settings")}
              >
                <Settings size={20} />
                Settings
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className={getButtonClass("/login")}
              >
                <LogOut />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBarComponent;
