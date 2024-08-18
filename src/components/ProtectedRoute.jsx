import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "./Header";

const ProtectedRoute = ({ isAdmin, session, handleLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setUserRole(data.role_id);
        }
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null || userRole === null) {
    return (
      // Loading spinner
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-gray-500 rounded-full loading loading-ring"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 0) { // Assuming 3 is the role_id for pending users
    return <Navigate to="/pending" replace />;
  }

  return (
    <>
      <Header isAdmin={isAdmin} session={session} handleLogout={handleLogout} />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;