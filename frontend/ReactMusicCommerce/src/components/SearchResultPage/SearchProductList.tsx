import ProductCard from "../utils/ProductCard";
import SearchProductCard from "./SearchProductCard";

const SearchProductList = () => {
  return (
    <section id="search-product-list" className="search-product-list section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4">
          <SearchProductCard />
          <SearchProductCard />
          <SearchProductCard />
          <SearchProductCard />
          <SearchProductCard />
        </div>
      </div>
    </section>
  );
};

export default SearchProductList;
