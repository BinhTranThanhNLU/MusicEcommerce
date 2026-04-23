import { useContext, useEffect, useState } from "react";
import PageTitle from "../../components/utils/PageTitle";
import ProfileMenu from "../../components/AccountComponent/ProfileMenu";
import LibraryTab from "../../components/AccountComponent/LibraryTab";
import OrdersTab from "../../components/AccountComponent/OrdersTab";
import ReviewsTab from "../../components/AccountComponent/ReviewsTab";
import SettingsTab from "../../components/AccountComponent/SettingsTab";
import { AuthContext } from "../../context/AuthContext";
import type { UserModel } from "../../models/UserModel";
import type { AccountOrderResponse } from "../../responsemodel/AccountOrderResponse";
import { getCurrentUser, getUserOrders } from "../../apis/userApi";

const AccountPage = () => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<UserModel | null>(authContext?.user ?? null);
  const [orders, setOrders] = useState<AccountOrderResponse[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [accountErrorMessage, setAccountErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAccountData = async () => {
      setIsOrdersLoading(true);
      setAccountErrorMessage(null);

      const [userResult, ordersResult] = await Promise.allSettled([
        getCurrentUser(),
        getUserOrders(),
      ]);

      if (!isMounted) {
        return;
      }

      if (userResult.status === "fulfilled") {
        setUser(userResult.value);
      }

      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value);
      }

      if (userResult.status === "rejected" || ordersResult.status === "rejected") {
        setAccountErrorMessage("Không tải được đầy đủ dữ liệu tài khoản. Vui lòng thử lại.");
      }

      setIsOrdersLoading(false);
    };

    loadAccountData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="main">
      <PageTitle title="Tài khoản" current="Tài khoản" />

      {/* Account Section */}
      <section id="account" className="account section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          {/* Mobile Menu Toggle */}
          <div className="mobile-menu d-lg-none mb-4">
            <button
              className="mobile-menu-toggle"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#profileMenu"
            >
              <i className="bi bi-grid"></i>
              <span>Menu</span>
            </button>
          </div>

          <div className="row g-4">
            {/* Profile Menu */}
            <ProfileMenu user={user} />

            {/* Content Area */}
            <div className="col-lg-9">
              <div className="content-area">
                {accountErrorMessage ? (
                  <div className="alert alert-warning mb-4" role="alert">
                    {accountErrorMessage}
                  </div>
                ) : null}

                <div className="tab-content">
                  <LibraryTab />

                  <OrdersTab orders={orders} isLoading={isOrdersLoading} />

                  <ReviewsTab />

                  <SettingsTab user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccountPage;
