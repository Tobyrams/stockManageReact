import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase, supabaseAdmin } from "../supabaseClient";
import { Trash2, Info, UserPlus } from "lucide-react";
import { Tooltip } from "@material-tailwind/react";
import { UserContext } from "../contexts/UserContext";

function AdminDashboard() {
  // State variables for managing profiles and UI
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { session, onlineUsers } = useContext(UserContext);

  // State for managing delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // State for new user creation form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState(1);

  // Check user role on component mount
  useEffect(() => {
    checkUserRole();
  }, []);

  // Function to check if the current user has admin role
  const checkUserRole = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", session?.user?.id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      setError(error.message);
    } else {
      setIsAdmin(data.role_id === 2);
      if (data.role_id === 2) {
        getProfiles();
      }
    }
    setIsLoading(false);
  };

  // Fetch all user profiles from Supabase
  async function getProfiles() {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select();
    if (error) {
      console.error("Error fetching profiles:", error);
      setError(error.message);
    } else {
      setProfiles(data);
    }
    setLoading(false);
  }

  // Update a user's role in the database
  const updateUserRole = async (userId, newRoleId) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role_id: newRoleId })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role: " + error.message);
    } else {
      toast.success("User role updated!");
      getProfiles();
    }
  };

  // Handle delete button click to show confirmation modal
  const handleDelete = (id, email) => {
    setDeleteConfirmation({ id, email });
    setIsDeleteModalVisible(true);
  };

  // Cancel delete operation and close modal
  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteConfirmation(null);
  };

  // Confirm delete operation and remove user
  const confirmDelete = async () => {
    if (deleteConfirmation) {
      setIsDeleteModalVisible(false);
      await deleteProfile(deleteConfirmation.id);
      setDeleteConfirmation(null);
      getProfiles();
    }
  };

  // Delete a user profile from Supabase
  async function deleteProfile(id) {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error deleting profile: " + error.message);
      setError(error.message);
    } else {
      toast.success("Deleted Profile");
    }
  }

  // Format date and time for display
  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Create a new user with specified email, password, and role
  const createNewUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user using Supabase Admin API
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true, // Automatically confirm the email
      });

      if (error) throw error;

      // Update the user's role in the profiles table
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ role_id: newUserRole })
        .eq("id", data.user.id);

      if (profileError) throw profileError;

      // Success handling
      toast.success("New user created!");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole(1);
      getProfiles(); // Refresh the profiles list
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading spinner for admin dashboard
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-ring loading-lg"></div>
      </div>
    );
  }

  // Redirect to dashboard if user is not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="p-5 sm:p-10 font-poppins animate__animated animate__fadeIn ">
      {/* <Toaster /> */}
      {/* Profiles table card */}
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 mb-8">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4 text-shadow">
            Profiles
          </h1>

          {/* Profiles table */}
          {loading ? (
            // Loading Skeleton for profiles table
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Role</th>
                    <th>
                      Online
                      <Tooltip
                        content="Green: Online, Red: Offline"
                        placement="right"
                      >
                        <Info
                          size={16}
                          className="inline-block ml-1 cursor-help"
                        />
                      </Tooltip>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </td>
                      <td>
                        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </td>
                      <td>
                        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Profiles table
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-lg">
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Role</th>
                    <th className="flex items-start relative justify-center">
                      Status
                      <Tooltip
                        content={
                          <>
                            <span className="mr-2">Status:</span>
                            <span className="inline-block w-3 h-3 rounded-full bg-success mr-1"></span>
                            <span className="text-success mr-2">Online</span>
                            <span className="inline-block w-3 h-3 rounded-full bg-error mr-1"></span>
                            <span className="text-error">Offline</span>
                          </>
                        }
                        placement="bottom"
                      >
                        <Info
                          size={16}
                          className="inline-block ml-2 cursor-help text-gray-600 opacity-50"
                        />
                      </Tooltip>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>{profile.email}</td>
                      <td>{formatDateTime(profile.created_at)}</td>
                      <td>
                        <select
                          value={profile.role_id}
                          onChange={(e) =>
                            updateUserRole(profile.id, parseInt(e.target.value))
                          }
                          className="select select-bordered select-sm  max-w-[100px]"
                        >
                          <option value={1}>User</option>
                          <option value={2}>Admin</option>
                          <option value={3}>Chef</option>
                        </select>
                      </td>
                      <td className="flex items-center justify-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            onlineUsers[profile.id]
                              ? "bg-green-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </td>
                      <td>
                        {profile.role_id === 1 ? (
                          <button
                            className="btn btn-ghost text-error btn-md"
                            onClick={() =>
                              handleDelete(profile.id, profile.email)
                            }
                            disabled={profile.role_id === 2}
                          >
                            <Trash2 />
                          </button>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <input
            type="checkbox"
            id="delete-confirmation-modal"
            className="modal-toggle"
            checked={isDeleteModalVisible}
            onChange={() => {}}
          />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              {deleteConfirmation && (
                <>
                  <p className="py-4">
                    Are you sure you want to delete the profile with email "
                    {deleteConfirmation.email}"?
                  </p>
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
          </div>
        </div>
      </div>

      {/* New User Creation Card */}
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 mt-8">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4 text-shadow">
            Create New User
          </h2>
          <form
            onSubmit={createNewUser}
            className="space-y-4"
            autocomplete="off"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="input input-bordered"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
                autocomplete="off"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                required
                autocomplete="new-password"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(parseInt(e.target.value))}
                className="select select-bordered"
                autocomplete="off"
              >
                <option value={1}>User</option>
                <option value={2}>Admin</option>
                <option value={3}>Chef</option>
              </select>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <UserPlus size={20} className="mr-2" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
