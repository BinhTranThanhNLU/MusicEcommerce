import React from "react";
import PageTitle from "../../components/utils/PageTitle";
import ProfileMenu from "../../components/AccountComponent/ProfileMenu";
import LibraryTab from "../../components/AccountComponent/LibraryTab";
import OrdersTab from "../../components/AccountComponent/OrdersTab";
import ReviewsTab from "../../components/AccountComponent/ReviewsTab";
import SettingsTab from "../../components/AccountComponent/SettingsTab";

const AccountPage = () => {
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
            <ProfileMenu />

            {/* Content Area */}
            <div className="col-lg-9">
              <div className="content-area">
                <div className="tab-content">
                  <LibraryTab />

                  <OrdersTab />

                  <ReviewsTab />

                  <SettingsTab />
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
