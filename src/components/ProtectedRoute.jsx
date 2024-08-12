import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "./Header";

const ProtectedRoute = ({ isAdmin, session }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      // Loading spinner
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-gray-500 rounded-full loading loading-ring  "></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <>
      <Header isAdmin={isAdmin} session={session} />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
