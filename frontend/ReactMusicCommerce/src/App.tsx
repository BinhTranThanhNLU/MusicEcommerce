import { useContext, useEffect } from "react";
import "./assets/css/style.css";

import HomePage from "./pages/HomePage";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import CategoryPage from "./pages/product/CategoryPage";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import CartPage from "./pages/cart-checkout/CartPage";
import CheckoutPage from "./pages/cart-checkout/CheckoutPage";
import AccountPage from "./pages/user/AccountPage";
import MainLayout from "./layouts/MainLayout";
import ArtistLayout from "./layouts/ArtistLayout";
import ArtistDashboardPage from "./pages/artist/ArtistDashboardPage";
import ArtistTracksPage from "./pages/artist/ArtistTracksPage";
import ArtistUploadPage from "./pages/artist/ArtistUploadPage";
import ArtistLicensesPage from "./pages/artist/ArtistLicensesPage";
import ArtistRevenuePage from "./pages/artist/ArtistRevenuePage";
import { AuthContext } from "./context/AuthContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const ArtistRouteGuard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "artist") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

function App() {
  //AOS
  useEffect(() => {
    const aos = (window as Window & { AOS?: { init: (config: { duration: number; once: boolean }) => void } }).AOS;
    if (aos) {
      aos.init({
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
            <Routes>
              <Route element={<MainLayout />}>
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>

              <Route element={<ArtistRouteGuard />}>
                <Route path="/artist" element={<ArtistLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ArtistDashboardPage />} />
                  <Route path="tracks" element={<ArtistTracksPage />} />
                  <Route path="upload" element={<ArtistUploadPage />} />
                  <Route path="licenses" element={<ArtistLicensesPage />} />
                  <Route path="revenue" element={<ArtistRevenuePage />} />
                </Route>
              </Route>

              <Route
                path="/artist-dashboard"
                element={<Navigate to="/artist/dashboard" replace />}
              />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </BrowserRouter>
        </AudioPlayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
