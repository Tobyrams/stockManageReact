import React, { useEffect, useState, useRef } from "react";
import { themeChange } from "theme-change";
import toast from "react-hot-toast";
import { Moon, Sun, Monitor, SunMoon } from "lucide-react";

const ThemeToggle = () => {
  // State to track the current theme and dropdown open state
  const [currentTheme, setCurrentTheme] = useState("system");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Initialize theme-change library
    themeChange(false);

    // Helper function to get the system's current theme
    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    // Load saved theme from localStorage or default to "system"
    const savedTheme = localStorage.getItem("theme") || "system";
    setCurrentTheme(savedTheme);

    // Set initial theme based on saved preference or system theme
    if (savedTheme === "system") {
      document.documentElement.setAttribute("data-theme", getSystemTheme());
    } else {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    // Observer to detect changes in the data-theme attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setCurrentTheme(document.documentElement.getAttribute("data-theme"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      if (currentTheme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light"
        );
      }
    };
    mediaQuery.addListener(handleSystemThemeChange);

    // Cleanup function to remove listeners and observers
    return () => {
      observer.disconnect();
      mediaQuery.removeListener(handleSystemThemeChange);
    };
  }, [currentTheme]);

  // Function to set the theme and show a toast notification
  const setTheme = (theme) => {
    if (theme !== currentTheme) {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
      localStorage.setItem("theme", theme);
      setCurrentTheme(theme);
    }
    setIsOpen(false);

    // Show toast notification for theme change
    toast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`, {
      icon:
        theme === "dark" ? <Moon /> : theme === "light" ? <Sun /> : <Monitor />,
      duration: 2000,
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      },
    });
  };

  // Toggle dropdown open/close state
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} onClick={toggleDropdown}>
      <div className="dropdown dropdown-left">
        {/* Theme toggle button */}
        <div tabIndex={0} role="button" className="cursor-pointer">
          <div className="flex items-center lg:text-lg gap-1  ">
            <SunMoon size={20} />
            Theme
          </div>
        </div>
        {/* Dropdown menu for theme selection */}
        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content mr-8 ring-2  ring-base-300 menu bg-base-100 rounded-sm z-[1] w-32 p-2 shadow"
          >
            {/* Light theme option */}
            <li>
              <button
                className={`theme-controller  ${
                  currentTheme === "light" ? "font-extrabold" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                <Sun size={20} />
                Light
              </button>
            </li>
            {/* Dark theme option */}
            <li>
              <button
                className={`theme-controller ${
                  currentTheme === "dark" ? "font-extrabold" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                <Moon size={20} />
                Dark
              </button>
            </li>
            {/* System theme option */}
            <li>
              <button
                className={`theme-controller ${
                  currentTheme === "system" ? "font-extrabold" : ""
                }`}
                onClick={() => setTheme("system")}
              >
                <Monitor size={20} />
                System
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
