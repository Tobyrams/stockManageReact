import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "./SideBarComponent";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import { Ellipsis, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

function Header({ isAdmin, session }) {
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

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar shadow-md bg-base-100 font-poppins">
        {/* Sidebar Component */}
        <div className="flex-none">
          <SideBarComponent isAdmin={isAdmin} />
        </div>

        {/* Header Title */}
        <div className="flex justify-center text-center w-full items-center">
          <span className="text-2xl md:text-3xl lg:text-4xl font-semibold pl-2 ">
            {getPageTitle()}
          </span>
        </div>

        {/* Dropdown */}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            {/* Dropdown Btn */}
            <button className="btn btn-square btn-ghost">
              <Ellipsis size={30} />
            </button>
            {/* Dropdown Content */}
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content ring-1 ring-base-300 bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow-md "
            >
              <li>
                <ProfileModal isAdmin={isAdmin} session={session} />
              </li>
              <li>
                <ThemeToggle />
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleLogout}>
                  Logout <LogOut size={17} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
