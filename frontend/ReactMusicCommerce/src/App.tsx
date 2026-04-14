import { useEffect, useState } from "react";
import './assets/css/style.css'

import AdminCopyrightManagementPage from "./pages/admin/AdminCopyrightManagementPage";
import Header from "./components/HeaderAndFooter/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/HeaderAndFooter/Footer";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import CategoryPage from "./pages/product/CategoryPage";

function App() {

  //AOS
  useEffect(() => {
    // @ts-ignore
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/genre/:id" element={<CategoryPage />} />
        <Route path="/mood/:id" element={<CategoryPage />} />
        <Route path="/theme/:id" element={<CategoryPage />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
