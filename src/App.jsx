import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Stock,
  Ingredients,
  Product,
  Analytics,
  Finances,
} from "./pages";
import { Header } from "./components";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <div className=" min-h-screen animate__animated animate__fadeIn ">
        <Header />
        <main className="p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/product" element={<Product />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/finances" element={<Finances />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
