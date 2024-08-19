import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "./Header";

// ProtectedRoute component to handle authentication and authorization
const ProtectedRoute = ({ isAdmin, session }) => {
  // State to store authentication status and user role
  const [authState, setAuthState] = useState({ isAuthenticated: null, userRole: null });
  const location = useLocation();

  useEffect(() => {
    // Function to check user authentication and fetch user role
    const checkAuth = async () => {
      // Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, set authentication state to false
        setAuthState({ isAuthenticated: false, userRole: null });
        return;
      }

      try {
        // Fetch user role from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Set authentication state with user role
        setAuthState({ isAuthenticated: true, userRole: data.role_id });
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Set authenticated but with null role if there's an error
        setAuthState({ isAuthenticated: true, userRole: null });
      }
    };

    checkAuth();
  }, []); // Run once on component mount

  // Show loading spinner while checking authentication
  if (authState.isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="  rounded-full loading loading-ring loading-lg mt-32"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to pending page if user role is 0 (pending approval)
  if (authState.userRole === 0) {
    return <Navigate to="/pending" replace />;
  }

  // Render protected content with Header and Outlet for nested routes
  return (
    <>
      <Header isAdmin={isAdmin} session={session} />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;