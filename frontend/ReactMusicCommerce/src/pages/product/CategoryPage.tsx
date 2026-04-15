import { useParams, useSearchParams } from "react-router-dom";
import CategoryHeaderSection from "../../components/CategoryPage/CategoryHeaderSection";
import PricingRangeWidget from "../../components/CategoryPage/PricingRangeWidget";
import ProductCategoryWidget from "../../components/CategoryPage/ProductCategoryWidget";
import ProductListSection from "../../components/CategoryPage/ProductListSection";
import PageTitle from "../../components/layouts/PageTitle";
import Pagination from "../../components/utils/Pagination";
import { useEffect, useState } from "react";
import ArtistFilterWidget from "../../components/CategoryPage/ArtistFilterWidget";
import type { ArtistModel } from "../../models/ArtistModel";
import { getAllArtists } from "../../apis/artistApi";
import { ErrorMessage } from "../../components/utils/ErrorMessage";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id) || 1;

  const [artists, setArtists] = useState<ArtistModel[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(0);

  const page = Number(searchParams.get("page")) || 0;

  const [httpError, setHttpError] = useState<string | null>(null);

  const setPage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
    });
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getAllArtists();
        setArtists(data);
      } catch (error: any) {
        setHttpError(error.message || "Error fetching artists");
      }
    };

    fetchArtists();
  }, []);

  // Reset page khi thay đổi Category
  useEffect(() => {
    setSearchParams({ page: "0" });
  }, [categoryId]);

  // Tự động scroll khi thay đổi trang hoặc filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, categoryId]);

  if (httpError) return <ErrorMessage message={httpError} />;

  return (
    <main className="main">
      <PageTitle />

      <div className="container">
        <div className="row">
          <div className="col-lg-4 sidebar">
            <div className="widgets-container">
              <ProductCategoryWidget />
              <PricingRangeWidget />
              <ArtistFilterWidget artists={artists}/>
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
