import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  Analytics,
  Finances,
  Ingredients,
  LoginPage,
  Product,
  Stock,
  AdminDashboard,
  Settings,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { Dashboard } from "./pages";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "animate.css";

function App() {
  // State variables
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check user role
  const checkUserRole = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Query Supabase to get user role
      const { data, error } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      // Set isAdmin to true if role_id is 2
      setIsAdmin(data.role_id === 2);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to set up auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup function to unsubscribe
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Effect to check user role when session changes
  useEffect(() => {
    if (session) {
      checkUserRole();
    }
  }, [session]);

  return (
    <Router>
      {/* Toast notifications */}
      <Toaster />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute isAdmin={isAdmin} session={session} />}>
          <Route path="/dashboard" element={<Dashboard isAdmin={isAdmin} />} />
          <Route
            path="/stock"
            element={<Stock isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/ingredients"
            element={<Ingredients isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/product"
            element={<Product isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/analytics"
            element={<Analytics isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/finances"
            element={<Finances isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard isAdmin={isAdmin} session={session} />}
          />
          <Route
            path="/settings"
            element={<Settings isAdmin={isAdmin} session={session} />}
          />
        </Route>

        {/* Redirect all other routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
