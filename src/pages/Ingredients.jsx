import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tooltip, Button } from "@material-tailwind/react";
function Ingredients({ isAdmin, session }) {
  // State declarations
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    product: "",
    ingredients: "",
  });
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [deletingIngredientId, setDeletingIngredientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ingredients on component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  // Function to fetch ingredients from Supabase
  async function fetchIngredients() {
    setIsLoading(true);
    const { data, error } = await supabase.from("ingredients").select("*");
    if (error) console.error("Error fetching ingredients:", error);
    else setIngredients(data);
    setIsLoading(false);
  }

  // Function to handle ingredient deletion
  const handleDelete = async (id) => {
    const { error } = await supabase.from("ingredients").delete().eq("id", id);
    if (error) console.error("Error deleting ingredient:", error);
    else {
      fetchIngredients();
      setIsDeleteModalVisible(false);
      toast.success("Ingredient deleted!");
    }
  };

  // Function to handle ingredient editing
  const handleEdit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("ingredients")
      .update(editingIngredient)
      .eq("id", editingIngredient.id);
    if (error) console.error("Error updating ingredient:", error);
    else {
      fetchIngredients();
      setIsEditModalVisible(false);
      toast.success("Ingredient updated!");
    }
  };

  // Function to handle adding new ingredient
  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("ingredients").insert(newIngredient);
    if (error) console.error("Error adding ingredient:", error);
    else {
      fetchIngredients();
      window.add_ingredient_modal.close();
      setNewIngredient({
        product: "",
        ingredients: "",
      });
      toast.success("Ingredient added!");
    }
  };

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-10 font-poppins animate__animated animate__fadeIn ">
      {/* Page title */}
      <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl mb-4 font-medium opacity-60 text-shadow">
        Ingredients in each batch
      </h2>

      {/* Search and Add New Ingredient section */}
      <div className="flex  gap-2 mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          className="input input-bordered  w-full max-w-[200px] mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => window.add_ingredient_modal.showModal()}
          >
            Add New Ingredient
          </button>
        )}
      </div>

      {/* Ingredients table */}
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th className="text-sm sm:text-base md:text-lg lg:text-xl text-shadow">
                    Product
                  </th>
                  <th className=" text-sm sm:text-base md:text-lg lg:text-xl text-shadow">
                    Ingredients
                  </th>
                  {isAdmin && (
                    <th className="text-sm sm:text-base md:text-lg lg:text-xl text-shadow">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? // Skeleton loader
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </td>
                        <td>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </td>
                        {isAdmin && (
                          <td>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                          </td>
                        )}
                      </tr>
                    ))
                  : // Actual data
                    filteredIngredients.map((ingredient) => (
                      <tr
                        key={ingredient.id}
                        className="text-sm sm:text-base md:text-md lg:text-lg"
                      >
                        <td>{ingredient.product}</td>
                        <td>
                          <div className="flex flex-col">
                            {ingredient.ingredients.split(",").map((item) => (
                              <div key={item}>{item},</div>
                            ))}
                          </div>
                        </td>
                        {isAdmin && (
                          <td>
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
                                onClick={() => {
                                  setEditingIngredient(ingredient);
                                  setIsEditModalVisible(true);
                                }}
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
                              className="bg-base-100 text-base-content ring-2 ring-base-300 hidden sm:flex"
                            >
                              <Button
                                className="btn btn-ghost btn-md text-error"
                                onClick={() => {
                                  setDeletingIngredientId(ingredient.id);
                                  setIsDeleteModalVisible(true);
                                }}
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

      {/* Add New Ingredient Modal */}
      <dialog
        id="add_ingredient_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-semibold text-2xl sm:text-3xl md:text-4xl text-center mb-4 text-shadow">
            Add New Ingredient
          </h3>
          <form onSubmit={handleAdd}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="input input-bordered"
                value={newIngredient.product}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    product: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ingredient Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter ingredient name"
                className="input input-bordered"
                value={newIngredient.ingredients}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    ingredients: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Add Ingredient
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => window.add_ingredient_modal.close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Ingredient Modal */}
      {isEditModalVisible && (
        <div
          className="modal modal-open"
          onClick={() => setIsEditModalVisible(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-2xl sm:text-3xl md:text-4xl text-center mb-4 text-shadow">
              Edit Ingredient
            </h3>
            <form onSubmit={handleEdit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered"
                  value={editingIngredient.product}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      product: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ingredient Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ingredient name"
                  className="input input-bordered"
                  value={editingIngredient.ingredients}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      ingredients: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn "
                  onClick={() => setIsEditModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && (
        <div
          className="modal modal-open"
          onClick={() => setIsDeleteModalVisible(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this ingredient?</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => handleDelete(deletingIngredientId)}
              >
                Yes, Delete
              </button>
              <button
                className="btn"
                onClick={() => setIsDeleteModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ingredients;
