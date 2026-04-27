import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getTracksByArtist } from "../../apis/audioTrackApi";
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
  const [genreFilter, setGenreFilter] = useState("all");

  const fetchArtistTracks = useCallback(async () => {
    if (!authContext?.user) {
      setHttpError("Bạn cần đăng nhập để xem kho nhạc nghệ sĩ.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHttpError(null);

      const data = await getTracksByArtist(authContext.user.id, {
        page,
        size: PAGE_SIZE,
      });

      setTracks(data.tracks ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalItems(data.totalItems ?? 0);
    } catch (error: any) {
      setHttpError(error?.message || "Không thể tải kho nhạc của nghệ sĩ.");
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.user, page]);

  useEffect(() => {
    void fetchArtistTracks();
  }, [fetchArtistTracks]);

  const genres = useMemo(() => {
    const allGenres = tracks.flatMap((track) => track.tags?.genres ?? []);
    return Array.from(new Set(allGenres.map((item) => item.trim()).filter(Boolean)));
  }, [tracks]);

  const displayedTracks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return tracks.filter((track) => {
      const matchesKeyword =
        !normalizedKeyword ||
        track.title.toLowerCase().includes(normalizedKeyword) ||
        (track.tags?.genres ?? []).some((genre) => genre.toLowerCase().includes(normalizedKeyword)) ||
        (track.tags?.moods ?? []).some((mood) => mood.toLowerCase().includes(normalizedKeyword));

      const matchesGenre =
        genreFilter === "all" ||
        (track.tags?.genres ?? []).some((genre) => genre.toLowerCase() === genreFilter.toLowerCase());

      return matchesKeyword && matchesGenre;
    });
  }, [tracks, keyword, genreFilter]);

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
        genres={genres}
      />

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <ArtistTrackTable 
          isLoading={isLoading} 
          displayedTracks={displayedTracks} 
          onTrackDeleted={fetchArtistTracks}
        />
        
        <ArtistTrackPagination 
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          currentCount={displayedTracks.length}
        />
      </div>
    </div>
  );
};

export default ArtistTracksPage;