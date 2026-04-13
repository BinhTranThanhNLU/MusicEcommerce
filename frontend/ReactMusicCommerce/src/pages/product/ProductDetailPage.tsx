import PageTitle from "../../components/layouts/PageTitle";
import InformationTab from "../../components/ProductDetailPage/InformationTab";
import ProductDetail from "../../components/ProductDetailPage/ProductDetail";
import ProductGallery from "../../components/ProductDetailPage/ProductGallery";

const ProductDetailPage = () => {
  return (
    <main className="main">
      <PageTitle />

      <section id="product-details" className="product-details section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-4">
            <ProductGallery />
            <ProductDetail />
          </div>
          <InformationTab />
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
