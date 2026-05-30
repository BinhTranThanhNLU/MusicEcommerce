import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchProductList from "../../components/SearchResultComponent/SearchProductList";
import SearchResultPagination from "../../components/SearchResultComponent/SearchResultPagination";
import SearchResultHeader, {
  type SearchFilters,
} from "../../components/SearchResultComponent/SearchResultHeader";

import { ErrorMessage } from "../../components/utils/ErrorMessage";
import type { AudioTrackSearchDocument, SearchType } from "../../models/Search";
import {
  advancedSearchTracks,
  hybridSearchTracks,
  filterSearchTracks,
  fullTextSearchTracks,
  fuzzySearchTracks,
  melodySearchTracks,
  phraseSearchTracks,
  semanticSearchTracks,
} from "../../apis/searchApi";
import type { GenreModel } from "../../models/GenreModel";
import type { MoodModel } from "../../models/MoodModel";
import type { ThemeModel } from "../../models/ThemeModel";
import { getAllGenres } from "../../apis/genreApi";
import { getAllMoods } from "../../apis/moodApi";
import { getAllThemes } from "../../apis/themeApi";

const PAGE_SIZE = 12;

const getSafeSearchType = (input: string | null): SearchType => {
  if (
    input === "fuzzy" ||
    input === "phrase" ||
    input === "semantic" ||
    input === "melody" ||
    input === "hybrid" ||
    input === "advanced" ||
    input === "filter"
  ) {
    return input;
  }
  return "full-text";
};

const getSafeNumber = (rawValue: string | null): number | undefined => {
  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);
  if (Number.isNaN(value) || value < 0) {
    return undefined;
  }
  return value;
};

const hasAnyFilter = (filters: SearchFilters): boolean =>
  Boolean(
    filters.status ||
    filters.genre ||
    filters.mood ||
    filters.theme ||
    filters.minPrice ||
    filters.maxPrice,
  );

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tracks, setTracks] = useState<AudioTrackSearchDocument[]>([]);
  const [genres, setGenres] = useState<GenreModel[]>([]);
  const [moods, setMoods] = useState<MoodModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [melodyFile, setMelodyFile] = useState<File | null>(null);
  const [melodyQuery, setMelodyQuery] = useState("");

  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(0, Number(searchParams.get("page") || "0"));
  const size = Math.max(
    1,
    Number(searchParams.get("size") || String(PAGE_SIZE)),
  );
  const searchType = getSafeSearchType(searchParams.get("type"));
  // Thêm useMemo bọc lại filters
  const filters: SearchFilters = useMemo(
    () => ({
      status: (searchParams.get("status") || "").trim(),
      genre: (searchParams.get("genre") || "").trim(),
      mood: (searchParams.get("mood") || "").trim(),
      theme: (searchParams.get("theme") || "").trim(),
      minPrice: (searchParams.get("minPrice") || "").trim(),
      maxPrice: (searchParams.get("maxPrice") || "").trim(),
    }),
    [searchParams],
  ); // Chỉ cập nhật object khi URL thay đổi
  const isFilterMode = hasAnyFilter(filters);
  const effectiveSearchType: SearchType = isFilterMode
    ? query
      ? "advanced"
      : "filter"
    : searchType;
  const displayQuery =
    effectiveSearchType === "melody" ? melodyQuery || query : query;

  const canUsePagination = useMemo(
    () =>
      !(
        (effectiveSearchType === "semantic" || effectiveSearchType === "melody") &&
        !isFilterMode
      ),
    [effectiveSearchType, isFilterMode],
  );

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [genreData, moodData, themeData] = await Promise.all([
          getAllGenres(),
          getAllMoods(),
          getAllThemes(),
        ]);

        setGenres(genreData);
        setMoods(moodData);
        setThemes(themeData);
      } catch {
        setGenres([]);
        setMoods([]);
        setThemes([]);
      }
    };

    void fetchFilterData();
  }, []);

  useEffect(() => {
    if (effectiveSearchType === "melody" && !melodyFile) {
      setTracks([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    if (effectiveSearchType !== "melody" && !query && !isFilterMode) {
      setTracks([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setHttpError(null);

        const minPrice = getSafeNumber(filters.minPrice);
        const maxPrice = getSafeNumber(filters.maxPrice);

        if (
          minPrice !== undefined &&
          maxPrice !== undefined &&
          minPrice > maxPrice
        ) {
          setHttpError("Giá tối thiểu không được lớn hơn giá tối đa");
          setTracks([]);
          setTotalResults(0);
          setTotalPages(0);
          return;
        }

        const requestPayload = {
          status: filters.status || undefined,
          genres: filters.genre ? [filters.genre] : undefined,
          moods: filters.mood ? [filters.mood] : undefined,
          themes: filters.theme ? [filters.theme] : undefined,
          minPrice,
          maxPrice,
          page,
          size,
        };

        const response =
          effectiveSearchType === "melody" && melodyFile
            ? await melodySearchTracks(melodyFile, size)
            : searchType === "hybrid" && !isFilterMode
            ? await hybridSearchTracks(query, page, size)
            : searchType === "semantic" && !isFilterMode
              ? await semanticSearchTracks(query, size)
              : isFilterMode
                ? query
                  ? await advancedSearchTracks({
                      ...requestPayload,
                      keyword: query,
                    })
                  : await filterSearchTracks(requestPayload)
                : searchType === "fuzzy"
                  ? await fuzzySearchTracks(query, page, size)
                  : searchType === "phrase"
                    ? await phraseSearchTracks(query, page, size)
                    : await fullTextSearchTracks(query, page, size);

        setTracks(response.results || []);
        setTotalResults(response.totalResults || 0);
        setTotalPages(
          (effectiveSearchType === "semantic" || effectiveSearchType === "melody") &&
          !isFilterMode
            ? 1
            : response.totalPages || 0,
        );
        if (effectiveSearchType === "melody") {
          setMelodyQuery(response.query || (melodyFile ? `file: ${melodyFile.name}` : ""));
        }
      } catch (error: any) {
        setTracks([]);
        setTotalResults(0);
        setTotalPages(0);
        setHttpError(
          error?.response?.data?.message || "Không thể tải kết quả tìm kiếm",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSearchResults();
  }, [
    query,
    page,
    size,
    searchType,
    filters,
    isFilterMode,
    effectiveSearchType,
    melodyFile,
  ]);

  const updateSearchParams = (next: {
    q?: string;
    page?: number;
    size?: number;
    type?: SearchType;
    status?: string;
    genre?: string;
    mood?: string;
    theme?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const nextQuery = (next.q ?? query).trim();
      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }

      params.set("page", String(next.page ?? page));
      params.set("size", String(next.size ?? size));
      params.set("type", next.type ?? searchType);

      const writeOptional = (
        key: string,
        value: string | undefined,
        fallback: string,
      ) => {
        const finalValue = (value ?? fallback).trim();
        if (finalValue) {
          params.set(key, finalValue);
        } else {
          params.delete(key);
        }
      };

      writeOptional("status", next.status, filters.status);
      writeOptional("genre", next.genre, filters.genre);
      writeOptional("mood", next.mood, filters.mood);
      writeOptional("theme", next.theme, filters.theme);
      writeOptional("minPrice", next.minPrice, filters.minPrice);
      writeOptional("maxPrice", next.maxPrice, filters.maxPrice);

      return params;
    });
  };

  const handleSearchOnResultPage = (keyword: string) => {
    const nextKeyword = keyword.trim();
    if (!nextKeyword) {
      return;
    }

    updateSearchParams({
      q: nextKeyword,
      page: 0,
      type: isFilterMode ? "advanced" : "hybrid",
    });
  };

  const handleMelodySearch = (audioFile: File) => {
    if (!audioFile) {
      return;
    }

    setMelodyFile(audioFile);
    setMelodyQuery(`file: ${audioFile.name}`);
    updateSearchParams({
      q: "",
      page: 0,
      type: "melody",
      status: "",
      genre: "",
      mood: "",
      theme: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const handleApplyFilters = (nextFilters: SearchFilters) => {
    updateSearchParams({
      page: 0,
      type: query ? "advanced" : "filter",
      status: nextFilters.status,
      genre: nextFilters.genre,
      mood: nextFilters.mood,
      theme: nextFilters.theme,
      minPrice: nextFilters.minPrice,
      maxPrice: nextFilters.maxPrice,
    });
  };

  const handleResetFilters = () => {
    updateSearchParams({
      page: 0,
      type: "full-text",
      status: "",
      genre: "",
      mood: "",
      theme: "",
      minPrice: "",
      maxPrice: "",
    });
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
        query={displayQuery}
        searchType={effectiveSearchType}
        onSearch={handleSearchOnResultPage}
        onMelodySearch={handleMelodySearch}
        filters={filters}
        genres={genres}
        moods={moods}
        themes={themes}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
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
