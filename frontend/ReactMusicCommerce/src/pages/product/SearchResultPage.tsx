import Pagination from "../../components/layouts/Pagination";
import SearchProductList from "../../components/SearchResultPage/SearchProductList";
import SearchResultHeader from "../../components/SearchResultPage/SearchResultHeader";

const SearchResultPage = () => {
  return (
    <main className="main">
      <SearchResultHeader />
      <SearchProductList />
      <Pagination />
    </main>
  );
};

export default SearchResultPage;
