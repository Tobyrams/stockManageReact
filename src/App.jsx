import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  LoginPage,
  Dashboard,
  Stock,
  Ingredients,
  Product,
  Analytics,
  Finances,
} from "./pages";
import { Header } from "./components";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="bg-base-100 min-h-screen animate__animated animate__fadeIn font-poppins">
        <Content />
      </div>
      <Toaster />
    </Router>
  );
}

function Content() {
  const location = useLocation();
  const hideHeaderPaths = ["/"];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <main className="p-5">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/product" element={<Product />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/finances" element={<Finances />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
