import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMyTracks } from "../../apis/artistApi";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import { AuthContext } from "../../context/AuthContext";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import "../../assets/css/artistDashboard.css";
import ArtistTrackFilter from "../../components/ArtistTrackComponent/ArtistTrackFilter";
import ArtistTrackHeader from "../../components/ArtistTrackComponent/ArtistTrackHeader";
import ArtistTrackPagination from "../../components/ArtistTrackComponent/ArtistTrackPagination";
import ArtistTrackTable from "../../components/ArtistTrackComponent/ArtistTrackTable";

const PAGE_SIZE = 8;

const ArtistTracksPage = () => {
  const authContext = useContext(AuthContext);

  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState(""); // Dùng để tránh spam API
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Xử lý Debounce cho Keyword: Đợi user gõ xong 500ms mới cập nhật debouncedKeyword
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timerId);
  }, [keyword]);

  // Reset về trang 1 nếu user đổi bất kỳ bộ lọc nào
  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, genreFilter, statusFilter]);

  const fetchArtistTracks = useCallback(async () => {
    if (!authContext?.user) {
      setHttpError("Bạn cần đăng nhập để xem kho nhạc nghệ sĩ.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHttpError(null);

      // Gọi API gửi TẤT CẢ bộ lọc xuống DB
      const data = await getMyTracks(
        page,
        PAGE_SIZE,
        debouncedKeyword,
        genreFilter,
        statusFilter,
      );

      setTracks(data.tracks ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalItems(data.totalItems ?? 0);
    } catch (error: any) {
      setHttpError(error?.message || "Không thể tải kho nhạc của nghệ sĩ.");
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.user, page, debouncedKeyword, genreFilter, statusFilter]);

  useEffect(() => {
    void fetchArtistTracks();
  }, [fetchArtistTracks]);

  // CHÚ Ý: Cách lấy genres này chỉ đang gom các thể loại ở Trang hiện tại (Current Page).
  // Tối ưu nhất sau này là bạn gọi 1 API getAllGenres() riêng biệt truyền vào Dropdown nhé!
  const genres = useMemo(() => {
    const allGenres = tracks.flatMap((track) => track.tags?.genres ?? []);
    return Array.from(
      new Set(allGenres.map((item) => item.trim()).filter(Boolean)),
    );
  }, [tracks]);

  if (httpError) {
    return <ErrorMessage message={httpError} />;
  }

  return (
    <div className="container-fluid py-4 px-lg-4">
      <ArtistTrackHeader />

      <ArtistTrackFilter
        keyword={keyword}
        setKeyword={setKeyword}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genres={genres}
      />

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {/* TRUYỀN TRỰC TIẾP 'tracks' VÀO TABLE, BỎ QUA 'displayedTracks' */}
        <ArtistTrackTable
          isLoading={isLoading}
          displayedTracks={tracks}
          onTrackDeleted={fetchArtistTracks}
        />

        <ArtistTrackPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          currentCount={tracks.length}
        />
      </div>
    </div>
  );
};

export default ArtistTracksPage;
