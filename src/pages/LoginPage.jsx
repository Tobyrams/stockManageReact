import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  // State for form inputs and toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Handle authentication (both login and signup)
  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      // Perform signup or login based on isSignup state
      const authResult = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      const { data, error } = authResult;
      if (error) throw error;

      // Fetch user's role from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      // Navigate user based on their role
      switch (profileData.role_id) {
        case 0:
          navigate("/pending");
          toast("Pending Admin Approval", { icon: "⚠️" });
          break;
        case 1:
        case 2:
          navigate(profileData.role_id === 1 ? "/dashboard" : "/admin");
          toast.success(`Welcome ${email}`, { duration: 3000 });
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during authentication");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      {/* Page title and description */}
      <h2 className="text-4xl font-bold text-center mb-2">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      <p className="text-center font-medium text-sm text-base-content/70 mb-4">
        {isSignup ? "Create your account" : "Enter your login information"}
      </p>
      {/* Login/Signup form card */}
      <div className="card w-full ring-1 ring-base-300 max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleAuth}>
            {/* Email input field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email:</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Password input field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password:</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Submit button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </div>
          </form>
          {/* Toggle between login and signup */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="btn btn-link text-base-content/70 hover:text-primary"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
