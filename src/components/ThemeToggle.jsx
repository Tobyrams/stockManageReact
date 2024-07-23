import React, { useEffect, useState, useRef } from "react";
import { themeChange } from "theme-change";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Initialize theme-change
    themeChange(false);

    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Add event listener for theme change
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

    // Cleanup function
    return () => observer.disconnect();
  }, []);

  const setTheme = (theme) => {
    if (theme !== currentTheme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      setCurrentTheme(theme);
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

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
    <li ref={dropdownRef}>
      <div className="dropdown dropdown-left">
        <div
          tabIndex={0}
          role="button"
          className="cursor-pointer w-full"
          onClick={toggleDropdown}
        >
          Theme
        </div>
        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content ring-1 ring-base-300 menu bg-base-100 rounded-box z-[1]  w-32 p-2 shadow"
          >
            <li>
              <button
                className={`theme-controller ${
                  currentTheme === "light" ? "font-extrabold" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </li>
            <li>
              <button
                className={`theme-controller ${
                  currentTheme === "dark" ? "font-extrabold" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
};

export default ThemeToggle;
