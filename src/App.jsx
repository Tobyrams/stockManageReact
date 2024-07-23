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

export default function App() {
  return (
    <Router>
      <div className=" min-h-screen w-[100vw]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/product" element={<Product />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/finances" element={<Finances />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
