import CheckoutForm from "../../components/CheckoutPage/CheckoutForm";
import SummaryOrder from "../../components/CheckoutPage/SummaryOrder";
import TermAndPrivacy from "../../components/CheckoutPage/TermAndPrivacy";
import PageTitle from "../../components/utils/PageTitle";

const CheckoutPage = () => {
  return (
    <main className="main">
      <PageTitle title="Thanh toán" current="Thanh toán" />

      <section id="checkout" className="checkout section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-7">
              <CheckoutForm />
            </div>

            <div className="col-lg-5">
              <SummaryOrder />
            </div>
          </div>

          <TermAndPrivacy />
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
