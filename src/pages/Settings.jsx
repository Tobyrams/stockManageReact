import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import toast from "react-hot-toast";
import { Moon, Sun, Monitor, Plus, Trash, Edit2, Info } from "lucide-react";
import { Tooltip, Button, Typography } from "@material-tailwind/react";
import { supabase } from "../supabaseClient"; // Ensure this import is correct

const Settings = ({ isAdmin, session }) => {
  // State to keep track of the current theme
  const [currentTheme, setCurrentTheme] = useState("system");
  // State to keep track of the new category
  const [newCategory, setNewCategory] = useState("");
  // State to keep track of the category being edited
  const [editingCategory, setEditingCategory] = useState(null);
  // State to track loading for categories
  const [loading, setLoading] = useState(true);

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
            background: darkThemes.includes(selectedTheme) ? "#333" : "#fff",
            color: darkThemes.includes(selectedTheme) ? "#fff" : "#333",
          },
        }
      );
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch initial categories
    fetchCategories();

    // Set up real-time subscription
    const subscription = supabase
      .channel("public:categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        handleCategoriesChange
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (error) {
      toast.error("Error fetching categories");
    } else {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleCategoriesChange = (payload) => {
    // console.log("Change received!", payload);
    fetchCategories(); // Refetch all categories
  };

  const addCategory = async () => {
    if (newCategory.trim()) {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategory.trim() }]);
      if (error) {
        toast.error("Failed to add category");
      } else {
        setNewCategory("");
        toast.success("Category added successfully", {
          duration: 3000,
          style: {
            background: darkThemes.includes(currentTheme) ? "#333" : "#fff",
            color: darkThemes.includes(currentTheme) ? "#fff" : "#333",
          },
        });
      }
    }
  };

  const deleteCategory = async (id) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible
                ? "animate__animated animate__bounceInDown animate__fast"
                : "animate__animated animate__bounceOutUp animate__fast"
            } max-w-md w-full bg-base-100 shadow-xl ring-1 ring-base-300 ring-offset-2 ring-offset-base-300 rounded-lg pointer-events-auto flex`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-base-content">
                    Error Deleting Category
                  </p>
                  <p className="mt-1 text-sm text-base-content/70">
                    Please make sure there are no stock items that contain the
                    category "{categoryToDelete?.name}".
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-base-300">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-semibold text-error hover:text-error-focus focus:outline-none focus:ring-2 focus:ring-error"
              >
                Dismiss
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          onClose: () => toast.dismiss(),
        }
      );
    } else {
      toast.success("Category deleted ", {
        duration: 3000,
        style: {
          background: darkThemes.includes(currentTheme) ? "#333" : "#fff",
          color: darkThemes.includes(currentTheme) ? "#fff" : "#333",
        },
      });
    }
  };

  const startEditing = (category) => {
    setEditingCategory({ ...category });
  };

  const saveEdit = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      const { error } = await supabase
        .from("categories")
        .update({ name: editingCategory.name.trim() })
        .eq("id", editingCategory.id);
      if (error) {
        toast.error("Failed to update category");
      } else {
        setEditingCategory(null);
        toast.success("Category updated ", {
          duration: 3000,
          style: {
            background: darkThemes.includes(currentTheme) ? "#333" : "#fff",
            color: darkThemes.includes(currentTheme) ? "#fff" : "#333",
          },
        });
      }
    }
  };

  return (
    <div className="p-4 animate__animated animate__fadeIn">
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 ring-offset-2 ring-offset-base-300 mb-4">
        <div className="card-body">
          <h2 className="card-title">Theme Settings</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose a theme:</span>
            </label>
            {/* Dropdown for theme selection */}
            <select
              className="select  ring-2 ring-base-300 w-full max-w-xs"
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

      {/* Categories */}
      {isAdmin && (
        <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 ring-offset-2 ring-offset-base-300">
          <div className="card-body">
            {/* Stock Categories Heading */}
            <div className="flex items-center gap-2">
              <h2 className="card-title">Stock Categories</h2>
              <Tooltip
                placement="bottom"
                className="border ring-2 ring-base-300 bg-base-100 px-4 py-3 shadow-xl"
                content={
                  <div className="w-80">
                    <Typography className="font-medium text-base-content">
                      Stock Categories
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-80 text-base-content"
                    >
                      Stock Categories is the list of categories for the stock
                      items on the Stock page.
                    </Typography>
                  </div>
                }
              >
                <Info size={20} className="cursor-pointer" />
              </Tooltip>
            </div>

            {/* Add new category */}
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="New category name"
                className="input input-bordered w-full  mr-2"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button className="btn btn-primary" onClick={addCategory}>
                <Plus size={20} />
                Add
              </button>
            </div>

            {/* Categories list with loading skeleton */}
            {loading ? (
              // Loading skeleton
              <ul className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="flex">
                      <div className="skeleton h-8 w-8 mr-2"></div>
                      <div className="skeleton h-8 w-8"></div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              // Categories list
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex w-full items-center text-sm sm:text-lg font-medium  justify-between hover:bg-base-200/30"
                  >
                    {editingCategory && editingCategory.id === category.id ? (
                      <>
                        <input
                          type="text"
                          className="input input-bordered w-full mr-2"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-success mr-2"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setEditingCategory(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{category.name}</span>
                        <div>
                          <Tooltip
                            content="Edit"
                            placement="top"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                            className="bg-base-100 text-base-content ring-2 ring-base-300 hidden sm:flex"
                          >
                            <Button
                              className="btn btn-ghost btn-md mr-2 text-base-content"
                              variant="text"
                              onClick={() => startEditing(category)}
                            >
                              <Edit2 size={16} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            content="Delete"
                            placement="top"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                            className="bg-base-100 text-base-content ring-2 ring-base-300 hidden sm:flex"
                          >
                            <Button
                              className="btn btn-ghost btn-md text-error"
                              variant="text"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
