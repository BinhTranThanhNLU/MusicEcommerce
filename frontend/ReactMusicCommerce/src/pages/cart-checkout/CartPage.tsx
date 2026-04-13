import CartItem from "../../components/CartPage/CartItem";
import CartList from "../../components/CartPage/CartList";
import CartSummary from "../../components/CartPage/CartSummary";
import PageTitle from "../../components/layouts/PageTitle";

const CartPage = () => {
  return (
    <main className="main">
      <PageTitle />

      <section id="cart" className="cart section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
              <CartList />
            </div>

            <div
              className="col-lg-4 mt-4 mt-lg-0"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CartSummary />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
