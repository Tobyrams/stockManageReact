import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "./SideBarComponent";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import {
  BadgeDollarSign,
  ChartLine,
  Ellipsis,
  Home,
  Layers,
  LogOut,
  PackageSearch,
  Settings,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

function Header({ isAdmin, session }) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return (
          <div className="flex items-center gap-2">
            <Home size={30} /> Dashboard
          </div>
        );
      case "/stock":
        return (
          <div className="flex items-center gap-2">
            <Layers size={30} /> Stock
          </div>
        );
      case "/ingredients":
        return (
          <div className="flex items-center gap-2">
            <ShoppingBasket size={30} /> Ingredients
          </div>
        );
      case "/product":
        return (
          <div className="flex items-center gap-2">
            <PackageSearch size={30} /> Product
          </div>
        );
      case "/analytics":
        return (
          <div className="flex items-center gap-2">
            <ChartLine size={30} /> Analytics
          </div>
        );
      case "/finances":
        return (
          <div className="flex items-center gap-2">
            <BadgeDollarSign size={30} /> Finances
          </div>
        );
      case "/admin":
        return (
          <div className="flex items-center gap-2">
            <ShieldCheck size={30} /> Admin Dashboard
          </div>
        );
      case "/settings":
        return (
          <div className="flex items-center gap-2">
            <Settings size={30} /> Settings
          </div>
        );
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
      <nav className="navbar shadow-md bg-base-100 font-poppins relative z-10 ring-2 ring-base-300">
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
                <button onClick={() => navigate("/settings")}>Settings</button>
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
