import React, { useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";

const Stock = ({ isAdmin, session }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    expiry: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [progress, setProgress] = useState(100);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTimer, setDeleteTimer] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    // Set loading to true before fetching data
    setIsLoading(true);
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching stocks", {
        icon: "🚨",
      });
    } else {
      setStocks(data);
    }
    // Set loading to false after data is fetched
    setIsLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewItem({ name: "", quantity: "", unit: "", expiry: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("stocks").insert([newItem]);

    if (error) {
      toast.error("Error adding new item");
    } else {
      toast.success("New item added!");
      fetchStocks();
      handleModalClose();
    }
  };

  const handleEdit = (stock) => {
    setEditItem(stock);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("stocks")
      .update(editItem)
      .eq("id", editItem.id);

    if (error) {
      toast.error("Error updating item");
    } else {
      toast.success("Item updated successfully");
      fetchStocks();
      handleEditModalClose();
    }
  };

  const handleDelete = (id, name) => {
    setDeleteConfirmation({ id, name });
    setProgress(100);
    setIsModalVisible(true);
    startDeleteTimer();
  };

  const startDeleteTimer = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          confirmDelete();
          return 0;
        }
        return prevProgress - 1;
      });
    }, 30);
    setDeleteTimer(timer);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    clearInterval(deleteTimer);
    setDeleteConfirmation(null);
    setProgress(100);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      setIsModalVisible(false);
      clearInterval(deleteTimer);
      await deleteStock(deleteConfirmation.id);
      setDeleteConfirmation(null);
      setProgress(100);
    }
  };

  const deleteStock = async (id) => {
    const { error } = await supabase.from("stocks").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting item");
    } else {
      toast.success("Item deleted successfully");
      fetchStocks();
    }
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split("-");
    setSortField(field);
    setSortOrder(order);
  };

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <section className="mt-6 font-poppins p-5 sm:p-10">
      <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl mb-4 font-medium opacity-60">
        Overview of current stock
      </h2>
      {/* Action buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search stocks..."
          className="input input-bordered w-full max-w-xs mr-1"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="select select-bordered mr-1"
          value={`${sortField}-${sortOrder}`}
          onChange={handleSortChange}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="expiry-asc">Expiry (Earliest First)</option>
          <option value="expiry-desc">Expiry (Latest First)</option>
        </select>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            Add New Item
          </button>
        )}
      </div>

      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th
                    className="flex items-center text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer"
                    onClick={() =>
                      handleSortChange({ target: { value: "name-asc" } })
                    }
                  >
                    Name{" "}
                    {sortField === "name" &&
                      (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </th>
                  <th
                    className="  items-center text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer"
                    onClick={() =>
                      handleSortChange({ target: { value: "quantity-asc" } })
                    }
                  >
                    <div className="flex items-center ">
                      Quantity{" "}
                      {sortField === "quantity" &&
                        (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                    </div>
                  </th>
                  <th className=" items-center text-xs sm:text-sm md:text-base lg:text-lg">
                    Unit
                  </th>
                  <th
                    className="flex  items-center text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer"
                    onClick={() =>
                      handleSortChange({ target: { value: "expiry-asc" } })
                    }
                  >
                    Expiry{" "}
                    {sortField === "expiry" &&
                      (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </th>
                  {isAdmin && (
                    <th className="text-xs sm:text-sm md:text-base lg:text-lg">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? // If loading, render skeleton rows
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <tr key={index}>
                          {/* Skeleton cells for each column */}
                          <td>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          {/* Conditional rendering for admin actions column */}
                          {isAdmin && (
                            <td>
                              <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                            </td>
                          )}
                        </tr>
                      ))
                  : // If not loading, render actual stock data
                    sortedStocks.map((stock) => (
                      <tr key={stock.id}>
                        <td>{stock.name}</td>
                        <td>{stock.quantity}</td>
                        <td>{stock.unit}</td>
                        <td>{stock.expiry}</td>
                        {isAdmin && (
                          <td>
                            <button
                              className="btn btn-md btn-ghost mr-2"
                              onClick={() => handleEdit(stock)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              className="btn btn-md btn-ghost text-error"
                              onClick={() => handleDelete(stock.id, stock.name)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      <input
        type="checkbox"
        id="add-item-modal"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)}
      />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box ">
          <h3 className="font-semibold text-3xl sm:text-4xl md:text-5xl text-center">
            Add New Item
          </h3>
          <h3 className="font-medium opacity-50 text-md sm:text-lg md:text-xl lg:text-xl text-center pb-10">
            Enter details for new item
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Unit of Measurement</span>
              </label>
              <input
                type="text"
                name="unit"
                value={newItem.unit}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Expiry Date</span>
              </label>
              <input
                type="date"
                name="expiry"
                value={newItem.expiry}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Add Item
              </button>
              <label
                htmlFor="add-item-modal"
                className="btn"
                onClick={handleModalClose}
              >
                Cancel
              </label>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="add-item-modal">
          Close
        </label>
      </div>

      {/* Edit Item Modal */}
      <input
        type="checkbox"
        id="edit-item-modal"
        className="modal-toggle"
        checked={isEditModalOpen}
        onChange={() => setIsEditModalOpen(!isEditModalOpen)}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-semibold text-3xl sm:text-4xl md:text-5xl text-center">
            Edit Item
          </h3>
          <h3 className="font-medium opacity-50 text-md sm:text-lg md:text-xl lg:text-xl text-center pb-10">
            Update details for the item
          </h3>
          {editItem && (
            <form onSubmit={handleUpdate}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stock Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editItem.name}
                  onChange={handleEditInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={editItem.quantity}
                  onChange={handleEditInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unit of Measurement</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  value={editItem.unit}
                  onChange={handleEditInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Expiry Date</span>
                </label>
                <input
                  type="date"
                  name="expiry"
                  value={editItem.expiry}
                  onChange={handleEditInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <label
                  htmlFor="edit-item-modal"
                  className="btn"
                  onClick={handleEditModalClose}
                >
                  Cancel
                </label>
              </div>
            </form>
          )}
        </div>
        <label className="modal-backdrop" htmlFor="edit-item-modal">
          Close
        </label>
      </div>

      {/* Delete Confirmation Modal */}
      <input
        type="checkbox"
        id="delete-confirmation-modal"
        className="modal-toggle"
        checked={isModalVisible}
        onChange={() => {}}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          {deleteConfirmation && (
            <>
              <p className="py-4">
                Are you sure you want to delete "
                <b>{deleteConfirmation.name}</b>"?
              </p>
              <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4">
                <div
                  className="bg-error h-2.5 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="modal-action">
                <button className="btn btn-ghost" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
        <label className="modal-backdrop" htmlFor="delete-confirmation-modal">
          Close
        </label>
      </div>
    </section>
  );
};

export default Stock;
