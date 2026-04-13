import BrandFilterWidget from "../../components/CategoryPage/BrandFilterWidget";
import CategoryHeaderSection from "../../components/CategoryPage/CategoryHeaderSection";
import ColorFilterWidget from "../../components/CategoryPage/ColorFilterWidget";
import PricingRangeWidget from "../../components/CategoryPage/PricingRangeWidget";
import ProductCategoryWidget from "../../components/CategoryPage/ProductCategoryWidget";
import ProductListSection from "../../components/CategoryPage/ProductListSection";
import PageTitle from "../../components/layouts/PageTitle";
import Pagination from "../../components/layouts/Pagination";

const CategoryPage = () => {
  return (
    <main className="main">
      <PageTitle />

      <div className="container">
        <div className="row">
          <div className="col-lg-4 sidebar">
            <div className="widgets-container">
              <ProductCategoryWidget />
              <PricingRangeWidget />
              <ColorFilterWidget />
              <BrandFilterWidget />
            </div>
          </div>

          <div className="col-lg-8">
            <CategoryHeaderSection />
            <ProductListSection />
            <Pagination />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
