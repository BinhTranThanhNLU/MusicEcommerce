import { useContext, useEffect } from "react";
import "./assets/css/style.css";

import HomePage from "./pages/HomePage";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
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
import UpdateTrackPage from "./pages/artist/UpdateTrackPage";
import ViewTrackPage from "./pages/artist/ViewTrackPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminUserPage from "./pages/admin/AdminUserPage";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import AdminCopyrightPage from "./pages/admin/AdminCopyrightPage";
import AdminModerationPage from "./pages/admin/AdminModerationPage";
import AdminRevenuePage from "./pages/admin/AdminRevenuePage";
import ErrorPage from "./pages/auth/ErrorPage";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const ArtistRouteGuard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "artist") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

const AdminRouteGuard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

const UserRouteGuard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Nếu chưa đăng nhập mà gõ bậy URL, đá văng về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập thì cho phép vào trang
  return <Outlet />;
};

function App() {
  //AOS
  useEffect(() => {
    const aos = (
      window as Window & {
        AOS?: { init: (config: { duration: number; once: boolean }) => void };
      }
    ).AOS;
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
              {/* --- ROUTE CHO USER --- */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/genre/:id" element={<CategoryPage />} />
                <Route path="/mood/:id" element={<CategoryPage />} />
                <Route path="/theme/:id" element={<CategoryPage />} />
                <Route
                  path="/detail-product/:id"
                  element={<ProductDetailPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>

              {/* --- ROUTE CHO USER ĐÃ ĐĂNG NHẬP (BẮT BUỘC BẢO VỆ) --- */}
              <Route element={<MainLayout />}>
                <Route element={<UserRouteGuard />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Route>
              </Route>

              {/* --- ROUTE CHO ARTIST --- */}
              <Route element={<ArtistRouteGuard />}>
                <Route path="/artist" element={<ArtistLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ArtistDashboardPage />} />
                  <Route path="tracks" element={<ArtistTracksPage />} />
                  <Route path="tracks/view/:id" element={<ViewTrackPage />} />
                  <Route
                    path="tracks/update/:id"
                    element={<UpdateTrackPage />}
                  />
                  <Route path="upload" element={<ArtistUploadPage />} />
                  <Route path="licenses" element={<ArtistLicensesPage />} />
                  <Route path="revenue" element={<ArtistRevenuePage />} />
                </Route>
              </Route>

              {/* --- ROUTE CHO ADMIN --- */}
              <Route element={<AdminRouteGuard />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="revenue" element={<AdminRevenuePage />} />
                  <Route path="moderation" element={<AdminModerationPage />} />
                  <Route path="users" element={<AdminUserPage />} />
                  <Route
                    path="users/view/:id"
                    element={<AdminUserDetailPage />}
                  />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="copyright" element={<AdminCopyrightPage />} />
                </Route>
              </Route>

              {/* --- CÁC ROUTE BÁO LỖI --- */}
              <Route element={<MainLayout />}>
                {/* Lỗi 403: Cấm truy cập */}
                <Route
                  path="/403"
                  element={
                    <ErrorPage
                      code="403"
                      title="Truy cập bị từ chối"
                      message="Bạn không có quyền truy cập vào khu vực này. Vui lòng đăng nhập với tài khoản cấp cao hơn."
                    />
                  }
                />

                {/* Lỗi 404: Không tìm thấy trang (Dấu * sẽ bắt TẤT CẢ các URL không khớp với bất kỳ Route nào ở trên) */}
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AudioPlayerProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
