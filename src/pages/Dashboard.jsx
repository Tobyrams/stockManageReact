import React, { useEffect, useState } from "react";
import { DrawerComponent } from "../components";
import { supabase } from "../supabaseClient"; // Ensure this import is correct
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { BackgroundTexture } from "../components";
function Dashboard() {
  const navigate = useNavigate();

  // State to store the list of stock items
  const [stockItems, setStockItems] = useState([]);

  // State to store the list of low stock items
  const [lowStockItems, setLowStockItems] = useState([]);

  // Fetch stock items when the component mounts
  useEffect(() => {
    fetchStockItems();
    fetchLowStockItems();
  }, []);

  // Function to fetch stock items from Supabase
  async function fetchStockItems() {
    try {
      // Query the 'stocks' table, selecting name and expiry fields, ordered by expiry date
      const { data, error } = await supabase
        .from("stocks")
        .select("name, expiry")
        .order("expiry", { ascending: true });

      if (error) throw error;
      setStockItems(data);
    } catch (error) {
      toast.error("Failed to fetch stock items");
      console.error("Error fetching stock items:", error);
    }
  }

  // Function to fetch low stock items from Supabase
  async function fetchLowStockItems() {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("name, quantity")
        .lte("quantity", 10)
        .order("quantity", { ascending: true });

      if (error) throw error;
      setLowStockItems(data);
    } catch (error) {
      toast.error("Failed to fetch low stock items");
      console.error("Error fetching low stock items:", error);
    }
  }

  // Function to calculate the status of an item based on its expiry date
  const calculateStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    return diffDays;
  };

  const handleViewAllClick = () => {
    navigate("/stock");
  };

  return (
    <div className="p-5 sm:p-10 animate__animated animate__fadeIn">
      <BackgroundTexture />
      <DrawerComponent />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="mt-8 bg-base-100 shadow-lg rounded-lg overflow-hidden ring-2  ring-base-300">
          {/* Header section with title and current date */}
          <div className="p-4 bg-base-100 flex items-center">
            <h2 className="text-2xl font-bold pr-5">Expiry Tracking</h2>
            <span className="text-md text-gray-500">
              <b>Today - </b> {new Date().toLocaleDateString()}
            </span>
          </div>
          {/* Table to display stock items */}
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead>
                <tr className="bg-base-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {/* Map through stockItems and render each item */}
                {stockItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.expiry).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Display status with appropriate color coding */}
                      <span
                        className={`badge badge-outline rounded-full ${
                          calculateStatus(item.expiry) === "Expired"
                            ? "text-red-500"
                            : calculateStatus(item.expiry) <= 3
                            ? "text-yellow-500"
                            : ""
                        }`}
                      >
                        {calculateStatus(item.expiry) === "Expired"
                          ? "Expired"
                          : `${calculateStatus(item.expiry)} day${
                              calculateStatus(item.expiry) !== 1 ? "s" : ""
                            } left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Low Stock Items card */}
        <div className="mt-8 bg-base-100 shadow-lg rounded-lg overflow-hidden ring-2  ring-base-300">
          <div className="p-4 bg-base-100 flex items-center justify-between ">
            <h2 className="text-2xl font-bold pr-5">Low Stock Items</h2>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleViewAllClick}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead>
                <tr className="bg-base-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {lowStockItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-500 font-semibold">
                        {item.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
