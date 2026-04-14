import { useParams, useSearchParams } from "react-router-dom";
import CategoryHeaderSection from "../../components/CategoryPage/CategoryHeaderSection";
import PricingRangeWidget from "../../components/CategoryPage/PricingRangeWidget";
import ProductCategoryWidget from "../../components/CategoryPage/ProductCategoryWidget";
import ProductListSection from "../../components/CategoryPage/ProductListSection";
import PageTitle from "../../components/layouts/PageTitle";
import Pagination from "../../components/utils/Pagination";
import { useEffect, useState } from "react";
import ArtistFilterWidget from "../../components/CategoryPage/ArtistFilterWidget";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id) || 1;

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(0);

  const page = Number(searchParams.get("page")) || 0;

  const setPage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
    });
  };

  // Reset page khi thay đổi Category
  useEffect(() => {
    setSearchParams({ page: "0" });
  }, [categoryId]);

  // Tự động scroll khi thay đổi trang hoặc filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, categoryId]);

  return (
    <main className="main">
      <PageTitle />

      <div className="container">
        <div className="row">
          <div className="col-lg-4 sidebar">
            <div className="widgets-container">
              <ProductCategoryWidget />
              <PricingRangeWidget />
              <ArtistFilterWidget />
            </div>
          </div>

          <div className="col-lg-8">
            <CategoryHeaderSection />
            <ProductListSection
              categoryId={categoryId}
              page={page}
              setTotalPages={setTotalPages}
            />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
