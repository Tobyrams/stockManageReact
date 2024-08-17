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
import { Tooltip, Button } from "@material-tailwind/react";

function Header({ isAdmin, session, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

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
          <div className="flex items-center ">
            <Settings size={30} /> Settings
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar shadow-md bg-base-100 font-poppins relative ring-2 ring-base-300">
        {/* Sidebar Component */}
        <div className="flex-none">
          <SideBarComponent isAdmin={isAdmin} handleLogout={handleLogout} />
        </div>

        {/* Header Title */}
        <div className="flex-1 justify-center text-center items-center">
          <span className="text-2xl md:text-3xl lg:text-4xl font-semibold pl-2 text-shadow-sm">
            {getPageTitle()}
          </span>
        </div>

        {/* Dropdown */}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            {/* Dropdown Btn */}
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Ellipsis size={30} />
            </label>

            {/* Dropdown Content */}
            <ul
              tabIndex={0}
              className="menu menu-xs dropdown-content mt-3 z-[1] p-2 ring-2 ring-base-300 shadow bg-base-100 rounded-sm w-32 sm:w-52"
            >
              <li>
                <ProfileModal isAdmin={isAdmin} session={session} />
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
