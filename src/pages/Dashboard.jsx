import React from "react";
import { DrawerComponent } from "../components";
import { useNavigate } from "react-router-dom";
import { BackgroundTexture } from "../components";
import { useStockSubscription } from "../hooks/useStockSubscription";

function Dashboard() {
  const navigate = useNavigate();
  const { stockItems, lowStockItems } = useStockSubscription();

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
      {/* <BackgroundTexture /> */}
      <DrawerComponent />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="mt-8 bg-base-100 shadow-lg rounded-lg overflow-hidden ring-2  ring-base-300 ring-offset-1 ring-offset-base-300">
          {/* Header section with title and current date */}
          <div className="p-4 bg-base-100 flex items-center">
            <h2 className="text-2xl font-bold pr-5 text-shadow-sm">
              Expiry Tracking
            </h2>
            <span className="text-md text-gray-500 text-shadow">
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
                            ? "text-orange-500"
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

        {/*  Low Stock Items card */}
        <div className="mt-8 bg-base-100 shadow-lg rounded-lg overflow-hidden ring-2 ring-base-300 ring-offset-1 ring-offset-base-300">
          <div className="p-4 bg-base-100 flex items-center justify-between ">
            <h2 className="text-2xl font-bold pr-5 text-shadow-sm">
              Low Stock Items
            </h2>
            <button
              className="btn btn-sm btn-outline text-shadow"
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
                    Amount Remaining
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
