import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

function Ingredients({ isAdmin, session }) {
  const [ingredients, setIngredients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    product: "",
    ingredients: "",
  });
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [deletingIngredientId, setDeletingIngredientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const { data, error } = await supabase.from("ingredients").select("*");
    if (error) console.error("Error fetching ingredients:", error);
    else setIngredients(data);
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("ingredients").delete().eq("id", id);
    if (error) console.error("Error deleting ingredient:", error);
    else {
      fetchIngredients();
      setIsDeleteModalVisible(false);
      toast.success("Ingredient deleted!");
    }
  };

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

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("ingredients").insert(newIngredient);
    if (error) console.error("Error adding ingredient:", error);
    else {
      fetchIngredients();
      setIsModalVisible(false);
      setNewIngredient({
        product: "",
        ingredients: "",
      });
      toast.success("Ingredient added!");
    }
  };

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-10 font-poppins">
      <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl mb-4 font-medium opacity-60">
        Ingredients in each batch
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          className="input input-bordered w-full max-w-xs mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalVisible(true)}
          >
            Add New Ingredient
          </button>
        )}
      </div>
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th className="text-sm sm:text-base md:text-lg lg:text-xl">
                    Product
                  </th>
                  <th className=" text-sm sm:text-base md:text-lg lg:text-xl">
                    Ingredients
                  </th>
                  {isAdmin && (
                    <th className="text-sm sm:text-base md:text-lg lg:text-xl">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient) => (
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
                        <button
                          className="btn btn-ghost btn-md mr-2"
                          onClick={() => {
                            setEditingIngredient(ingredient);
                            setIsEditModalVisible(true);
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="btn btn-ghost btn-md text-error"
                          onClick={() => {
                            setDeletingIngredientId(ingredient.id);
                            setIsDeleteModalVisible(true);
                          }}
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

      {isModalVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Ingredient</h3>
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
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Ingredient</h3>
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
                  className="btn"
                  onClick={() => setIsEditModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
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
