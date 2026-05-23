import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchProductList from "../../components/SearchResultComponent/SearchProductList";
import SearchResultPagination from "../../components/SearchResultComponent/SearchResultPagination";
import SearchResultHeader from "../../components/SearchResultComponent/SearchResultHeader";

import { ErrorMessage } from "../../components/utils/ErrorMessage";
import type { AudioTrackSearchDocument, SearchType } from "../../models/Search";
import { fullTextSearchTracks, fuzzySearchTracks, phraseSearchTracks, semanticSearchTracks } from "../../apis/audioTrackApi";

const PAGE_SIZE = 12;

const getSafeSearchType = (input: string | null): SearchType => {
  if (input === "fuzzy" || input === "phrase" || input === "semantic") {
    return input;
  }
  return "full-text";
};

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tracks, setTracks] = useState<AudioTrackSearchDocument[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<string | null>(null);

  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(0, Number(searchParams.get("page") || "0"));
  const size = Math.max(1, Number(searchParams.get("size") || String(PAGE_SIZE)));
  const searchType = getSafeSearchType(searchParams.get("type"));

  const canUsePagination = useMemo(
    () => searchType !== "semantic",
    [searchType],
  );

  useEffect(() => {
    if (!query) {
      setTracks([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setHttpError(null);

        const response =
          searchType === "semantic"
            ? await semanticSearchTracks(query, size)
            : searchType === "fuzzy"
              ? await fuzzySearchTracks(query, page, size)
              : searchType === "phrase"
                ? await phraseSearchTracks(query, page, size)
                : await fullTextSearchTracks(query, page, size);

        setTracks(response.results || []);
        setTotalResults(response.totalResults || 0);
        setTotalPages(searchType === "semantic" ? 1 : response.totalPages || 0);
      } catch (error: any) {
        setTracks([]);
        setTotalResults(0);
        setTotalPages(0);
        setHttpError(error?.response?.data?.message || "Không thể tải kết quả tìm kiếm");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSearchResults();
  }, [query, page, size, searchType]);

  const updateSearchParams = (next: {
    q?: string;
    page?: number;
    size?: number;
    type?: SearchType;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("q", (next.q ?? query).trim());
      params.set("page", String(next.page ?? page));
      params.set("size", String(next.size ?? size));
      params.set("type", next.type ?? searchType);

      return params;
    });
  };

  const handleSearchOnResultPage = (keyword: string) => {
    const nextKeyword = keyword.trim();
    if (!nextKeyword) {
      return;
    }

    // Search trong trang ket qua la full-text; semantic chi dung tren Header.
    updateSearchParams({ q: nextKeyword, page: 0, type: "full-text" });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) {
      return;
    }
    updateSearchParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (httpError) {
    return <ErrorMessage message={httpError} />;
  }

  return (
    <main className="main">
      <SearchResultHeader
        totalResults={totalResults}
        query={query}
        searchType={searchType}
        onSearch={handleSearchOnResultPage}
      />
      <SearchProductList tracks={tracks} isLoading={isLoading} />
      {canUsePagination && (
        <SearchResultPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default SearchResultPage;
