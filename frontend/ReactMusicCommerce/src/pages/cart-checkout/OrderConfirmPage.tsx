import PageTitle from "../../components/layouts/PageTitle";
import LeftSidebar from "../../components/OrderConfirmPage/LeftSidebar";
import MainContentArea from "../../components/OrderConfirmPage/MainContentArea";

const OrderConfirmPage = () => {
  return (
    <main className="main">
      <PageTitle />

      <section id="order-confirmation" className="order-confirmation section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="order-confirmation-3">
            <div className="row g-0">
              <LeftSidebar />

              <MainContentArea />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderConfirmPage;
