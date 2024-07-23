import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate authentication logic (e.g., API call)
    const isAuthenticated = email === "admin@gmail.com" && password === "admin";

    if (isAuthenticated) {
      // Redirect to the dashboard
      navigate("/dashboard");
      toast.success(`Welcome ${email} `, {
        duration: 3000,
      });
    } else {
      // Handle authentication failure (e.g., show an error message)
      toast.error("Incorrect Email or Password! ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center mb-2">Login</h2>
      <p className="text-center font-medium text-sm text-base-content/70 mb-4">
        Enter your login information
      </p>
      {/* Card */}
      <div className="card w-full ring-1 ring-base-300 max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleLogin}>
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

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center mt-8 mb-28">
        <p className="text-sm">
          Do you have an account?
          <a href="#" className="link hover:text-primary ml-1">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
