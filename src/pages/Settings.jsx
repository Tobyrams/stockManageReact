import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import toast from "react-hot-toast";
import { Moon, Sun, Monitor } from "lucide-react";

const Settings = () => {
  // State to keep track of the current theme
  const [currentTheme, setCurrentTheme] = useState("system");

  // Arrays of available light and dark themes
  const lightThemes = ["lofi", "nord", "light"];
  const darkThemes = ["black", "business", "dim"];

  // Effect hook to initialize theme on component mount
  useEffect(() => {
    // Initialize theme-change library
    themeChange(false);

    // Get saved theme from localStorage or default to "system"
    const savedTheme = localStorage.getItem("theme") || "system";
    setCurrentTheme(savedTheme);

    // Function to get the system's preferred theme
    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    // Set initial theme
    if (savedTheme === "system") {
      document.documentElement.setAttribute("data-theme", getSystemTheme());
    } else {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Function to handle theme changes
  const handleThemeChange = (selectedTheme) => {
    if (selectedTheme !== currentTheme) {
      // If "system" is selected, use the system's preferred theme
      if (selectedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
      } else {
        // Otherwise, set the selected theme
        document.documentElement.setAttribute("data-theme", selectedTheme);
      }

      // Save the selected theme to localStorage
      localStorage.setItem("theme", selectedTheme);

      // Update the current theme state
      setCurrentTheme(selectedTheme);

      // Show a toast notification for the theme change
      toast(
        `${
          selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
        } Theme`,
        {
          icon:
            selectedTheme === "dark" ? (
              <Moon />
            ) : selectedTheme === "light" ? (
              <Sun />
            ) : (
              <Monitor />
            ),
          duration: 2000,
          style: {
            borderRadius: "10px",
            background: selectedTheme === "dark" ? "#333" : "#fff",
            color: selectedTheme === "dark" ? "#fff" : "#333",
          },
        }
      );
    }
  };

  return (
    <div className="p-4">
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 ring-offset-2 ring-offset-base-300">
        <div className="card-body">
          <h2 className="card-title">Theme Settings</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose a theme:</span>
            </label>
            {/* Dropdown for theme selection */}
            <select
              className="select select-bordered w-full max-w-xs"
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="system">System</option>
              {/* Light theme options */}
              <optgroup label="Light Themes">
                {lightThemes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </optgroup>
              {/* Dark theme options */}
              <optgroup label="Dark Themes">
                {darkThemes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
