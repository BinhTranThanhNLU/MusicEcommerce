import { useEffect } from "react";
import "./assets/css/style.css";

import Header from "./components/HeaderAndFooter/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/HeaderAndFooter/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CategoryPage from "./pages/product/CategoryPage";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import AudioPlayer from "./components/AudioPlayer";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductDetail from "./components/ProductDetailPage/ProductDetail";
import ProductDetailPage from "./pages/product/ProductDetailPage";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <AudioPlayerProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/genre/:id" element={<CategoryPage />} />
              <Route path="/mood/:id" element={<CategoryPage />} />
              <Route path="/theme/:id" element={<CategoryPage />} />
              <Route path="/detail-product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
            <Footer />
            <AudioPlayer />
          </BrowserRouter>
        </AudioPlayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
