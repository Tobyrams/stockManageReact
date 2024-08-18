import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Adjust this import path as needed

const PendingUser = () => {
  const navigate = useNavigate();

  // Logout the user and redirect to login page after 5 seconds
  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
    };
    signOut();

    setTimeout(() => {
      navigate("/login");
    }, 5000);
  }, []);

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
        <p className="mb-4">
          Your account is currently pending authorization from the
          administrator.
        </p>
      </div>
    </div>
  );
};

export default PendingUser;
