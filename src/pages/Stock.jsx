import React, { useState, useEffect } from "react";
import { Tooltip, Button } from "@material-tailwind/react";
import { toast } from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useStockSubscription_StockPG } from "../hooks/useStockSubscription";
import { useCategorySubscription } from "../hooks/useCategorySubscription";

const Stock = ({ isAdmin, session }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { stocks, isLoading } = useStockSubscription_StockPG();
  const { categories } = useCategorySubscription();
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  // Function to get the category name from a category ID
  const getCategoryName = (categoryId) => {
    // Find the category object in the categories array that matches the given ID
    const category = categories.find((cat) => cat.id === categoryId);
    // Return the category name if found, otherwise return "Unknown"
    return category ? category.name : "Unknown";
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    expiry: "",
    category_id: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySearch = (e) => {
    setCategorySearchTerm(e.target.value.toLowerCase());
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesName = stock.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const category = categories.find((cat) => cat.id === stock.category_id);
    const matchesCategory =
      category && category.name.toLowerCase().includes(categorySearchTerm);
    return matchesName && matchesCategory;
  });

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setNewItem({
      name: "",
      quantity: "",
      unit: "",
      expiry: "",
      category_id: "",
    });
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
      setIsModalOpen(false); // Close the modal
      setNewItem({
        name: "",
        quantity: "",
        unit: "",
        expiry: "",
        category_id: "",
      });
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
      handleEditModalClose();
    }
  };

  const handleDelete = (id, name) => {
    setDeleteConfirmation({ id, name });
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      await deleteStock(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  const deleteStock = async (id) => {
    const { error } = await supabase.from("stocks").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting item");
    } else {
      toast.success("Item deleted successfully");
    }
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split("-");
    setSortField(field);
    setSortOrder(order);
  };

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const aValue =
      sortField === "category_id"
        ? getCategoryName(a.category_id)
        : a[sortField];
    const bValue =
      sortField === "category_id"
        ? getCategoryName(b.category_id)
        : b[sortField];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <section className="mt-6 font-poppins p-5 sm:p-10 animate__animated animate__fadeIn ">
      <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl mb-4 font-medium opacity-60 text-shadow">
        Overview of current stock
      </h2>

      {/* <div className="flex flex-wrap gap-2 mb-4"> */}
      <div className="grid grid-cols-2  sm:flex  gap-2 mb-2">
        <input
          type="text"
          placeholder="Search stocks..."
          className="input input-bordered w-full max-w-[200px] mr-1"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="select select-bordered w-full max-w-[200px] mr-1"
          value={`${sortField}-${sortOrder}`}
          onChange={handleSortChange}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="expiry-asc">Expiry (Earliest First)</option>
          <option value="expiry-desc">Expiry (Latest First)</option>
          <option value="category_id-asc">Category (A-Z)</option>
          <option value="category_id-desc">Category (Z-A)</option>
        </select>
        <input
          type="text"
          placeholder="Search categories..."
          className="input input-bordered w-full max-w-[200px] mr-1"
          value={categorySearchTerm}
          onChange={handleCategorySearch}
        />

        {isAdmin && (
          <button
            className="btn btn-primary w-full max-w-[200px]"
            onClick={handleAddNew}
          >
            Add New Item
          </button>
        )}
      </div>

      <p className="text-xl text-base-content text-shadow pb-5">
        <span className="font-bold">Today's Date: </span>
        {new Date().toLocaleDateString()}
      </p>

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
                    Name
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
                      Quantity
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
                  <th
                    className="items-center text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer"
                    onClick={() =>
                      handleSortChange({ target: { value: "category_id-asc" } })
                    }
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === "category_id" &&
                        (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                    </div>
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
                  ? Array(5)
                      .fill()
                      .map((_, index) => (
                        <tr key={index}>
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
                          <td>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          {isAdmin && (
                            <td>
                              <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                            </td>
                          )}
                        </tr>
                      ))
                  : sortedStocks.map((stock) => (
                      <tr key={stock.id}>
                        <td>{stock.name}</td>
                        <td>{stock.quantity}</td>
                        <td>{stock.unit}</td>
                        <td>{stock.expiry}</td>
                        <td>{getCategoryName(stock.category_id)}</td>
                        {isAdmin && (
                          <td>
                            <Tooltip
                              content="Edit"
                              placement="top"
                              animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                              }}
                              className="bg-base-100 text-base-content ring-2 ring-base-300 hidden lg:flex"
                            >
                              <Button
                                className="btn btn-md btn-ghost mr-2 text-base-content"
                                onClick={() => handleEdit(stock)}
                                variant="text"
                              >
                                <Pencil size={18} />
                              </Button>
                            </Tooltip>
                            <Tooltip
                              content="Delete"
                              placement="top"
                              animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                              }}
                              className="bg-base-100 text-base-content ring-2 ring-base-300 hidden lg:flex"
                            >
                              <Button
                                className="btn btn-md btn-ghost text-error"
                                onClick={() =>
                                  handleDelete(stock.id, stock.name)
                                }
                                variant="text"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </Tooltip>
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
                <span className="label-text">Unit of Measurement <span className="text-sm text-gray-500">(Optional)</span></span>
              </label>
              <input
                type="text"
                name="unit"
                value={newItem.unit || "-"}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <p className="label-text">Expiry Date <span className="text-sm text-gray-500">(Optional)</span></p>
              </label>
              <input
                type="date"
                name="expiry"
                value={newItem.expiry}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category_id"
                value={newItem.category_id}
                onChange={handleInputChange}
                className="select select-bordered"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Add Item
              </button>
              <button
                htmlFor="add-item-modal"
                className="btn"
                onClick={handleModalClose}
              >
                Cancel
              </button>
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
        className="modal-toggle "
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
                <div className="flex items-center gap-2 ">
                  <input
                    type="number"
                    name="quantity"
                    value={editItem.quantity}
                    onChange={handleEditInputChange}
                    className="input input-bordered w-full "
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-outline btn-square btn-md "
                    onClick={() =>
                      handleEditInputChange({
                        target: {
                          name: "quantity",
                          value: Math.max(0, parseInt(editItem.quantity) - 1),
                        },
                      })
                    }
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-outline btn-square btn-md"
                    onClick={() =>
                      handleEditInputChange({
                        target: {
                          name: "quantity",
                          value: parseInt(editItem.quantity) + 1,
                        },
                      })
                    }
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unit of Measurement</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  value={editItem.unit || "-"}
                  onChange={handleEditInputChange}
                  className="input input-bordered"
                  
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
                  
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  name="category_id"
                  value={editItem.category_id}
                  onChange={handleEditInputChange}
                  className="select select-bordered"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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

      {/* Delete Item Modal */}
      {deleteConfirmation && (
        <>
          <input
            type="checkbox"
            id="delete-confirmation-modal"
            className="modal-toggle"
            checked={!!deleteConfirmation}
            onChange={() => setDeleteConfirmation(null)}
          />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to delete "
                <b>{deleteConfirmation?.name}</b>"?
              </p>
              <div className="modal-action">
                <button className="btn btn-ghost" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
            <label
              className="modal-backdrop"
              htmlFor="delete-confirmation-modal"
            >
              Close
            </label>
          </div>
        </>
      )}
    </section>
  );
};

export default Stock;
