import React from "react";
import { useNavigate } from "react-router-dom";

const PendingUser = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
        <p className="mb-4">
          Your account is currently pending authorization from the administrator.
        </p>
        {/* <p className="mb-4">
          Please check back later or contact support if you have any questions.
        </p> */}
        <button
          onClick={handleBackToLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PendingUser;