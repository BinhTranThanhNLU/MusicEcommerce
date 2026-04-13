import { useEffect, useState } from "react";
import './assets/css/style.css'

import AdminCopyrightManagementPage from "./pages/admin/AdminCopyrightManagementPage";
import Header from "./components/layouts/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/layouts/Footer";

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
    <>
      <Header />
      <HomePage />
      <Footer />
    </>
  );
}

export default App;
