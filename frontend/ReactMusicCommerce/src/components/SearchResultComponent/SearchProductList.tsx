import type { AudioTrackSearchDocument } from "../../models/Search";
import SearchProductCard from "./SearchProductCard";

interface SearchProductListProps {
  tracks: AudioTrackSearchDocument[];
  isLoading: boolean;
}

const SearchProductList = ({ tracks, isLoading }: SearchProductListProps) => {
  return (
    <section id="search-product-list" className="search-product-list section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 mb-0 text-muted">Đang tải kết quả tìm kiếm...</p>
          </div>
        ) : tracks.length > 0 ? (
          <div className="row g-4">
            {tracks.map((track) => (
              <SearchProductCard key={`${track.id}-${track.title}`} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h5 className="mb-2">Không tìm thấy kết quả phù hợp</h5>
            <p className="text-muted mb-0">
              Bạn có thể thử từ khóa khác hoặc tìm bằng thanh tìm kiếm thông minh trên Header.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchProductList;
