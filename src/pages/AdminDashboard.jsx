import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { Trash2 } from "lucide-react";

function AdminDashboard({ session }) {
  // State variables
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Delete confirmation state variables
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Check user role on component mount
  useEffect(() => {
    checkUserRole();
  }, []);

  //   // Fetch profiles and set up realtime listener when user is admin
  useEffect(() => {
    if (isAdmin) {
      getProfiles();
      const cleanupListener = setupRealtimeListener();
      return () => cleanupListener();
    }
  }, [isAdmin]);

  // Function to check user role
  const checkUserRole = async () => {
    // if (!session?.user?.id) {
    //   //   console.error("No user ID found in session");
    //   setError("No user ID found. Please log in again.");
    //   setLoading(false);
    //   return;
    // }

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
    }
    setLoading(false);
  };

  // Set up realtime listener for profile changes
  const setupRealtimeListener = () => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Handle realtime updates
  const handleRealtimeUpdate = (payload) => {
    if (payload.eventType === "INSERT") {
      setProfiles((prevProfiles) => [...prevProfiles, payload.new]);
    } else if (payload.eventType === "UPDATE") {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === payload.new.id ? payload.new : profile
        )
      );
    } else if (payload.eventType === "DELETE") {
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== payload.old.id)
      );
    }
  };

  // Fetch profiles from Supabase
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

  // Update user role
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
    }
  };

  // Handle delete button click
  const handleDelete = (id, email) => {
    setDeleteConfirmation({ id, email });
    setIsDeleteModalVisible(true);
  };

  // Cancel delete operation
  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteConfirmation(null);
  };

  // Confirm delete operation
  const confirmDelete = async () => {
    if (deleteConfirmation) {
      setIsDeleteModalVisible(false);
      await deleteProfile(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  // Delete profile from Supabase
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

  // Format date and time
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

  // Render main component
  return (
    <div className="p-5 sm:p-10 font-poppins animate__animated animate__fadeIn ">
      <Toaster />
      <div className="card bg-base-100 shadow-xl ring-2 ring-base-300 ">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4 text-shadow">Profiles</h1>

          {/* Profiles table */}
          {loading ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
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
                        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Role</th>
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
                          className="select ring-1 ring-base-300 rounded-full select-sm w-full max-w-xs"
                        >
                          <option value={1}>User</option>
                          <option value={2}>Admin</option>
                          <option value={3}>Chef</option>
                        </select>
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
    </div>
  );
}

export default AdminDashboard;
