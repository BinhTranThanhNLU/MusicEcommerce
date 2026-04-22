import type React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { useEffect, useState } from "react";
import { getTracksByArtist } from "../../apis/audioTrackApi";
import WhatWillYouReceive from "./WhatWillYouReceive";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

interface OverviewTabProps {
  track: AudioTrackModel;
}

// Component để hiển thị track card với nút phát nhạc
const RelatedTrackCard: React.FC<{ track: AudioTrackModel; formatPrice: (price: number) => string }> = ({ track, formatPrice }) => {
  const { currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsPlaying = isCurrentTrack && isPlaying;

  return (
    <div className="col-md-4">
      <div className="product-card border rounded p-2 text-center h-100 shadow-sm position-relative">
        <div className="position-relative">
          <img
            src={
              track.coverImage ||
              "https://placehold.co/300x300"
            }
            className="img-fluid rounded mb-2 w-100"
            alt={track.title}
            style={{ aspectRatio: "1/1", objectFit: "cover" }}
          />
          {/* Play button overlay */}
          <button
            className={`position-absolute top-50 start-50 translate-middle btn btn-sm rounded-circle ${
              trackIsPlaying ? "btn-danger" : "btn-primary"
            }`}
            onClick={() => togglePlayPause(track)}
            style={{ width: "40px", height: "40px", zIndex: 10 }}
          >
            <i className={`bi ${trackIsPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
          </button>
        </div>
        <div className="small text-muted mb-1">
          {track.audioType}
        </div>
        <h6
          className="text-truncate mb-2"
          title={track.title}
        >
          {track.title}
        </h6>
        <div className="text-primary fw-bold">
          Từ {formatPrice(track.startingPrice)}
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ track }) => {
  const [relatedTracks, setRelatedTracks] = useState<AudioTrackModel[]>([]);

  // Format tiền tệ
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (track && track.artist) {
      const fetchRelated = async () => {
        try {
          const data = await getTracksByArtist(track.artist.id, { size: 7 });

          // Kiểm tra cấu trúc response, thường là res.data (chứa mảng DTO)
          const tracksArray = data.tracks || [];

          // Lọc bỏ bài hát hiện tại đang xem và chỉ lấy tối đa 6 bài cho Carousel
          const filtered = tracksArray
            .filter((t: AudioTrackModel) => t.id !== track.id)
            .slice(0, 6);
          setRelatedTracks(filtered);
        } catch (error) {
          console.error("Lỗi khi tải bài hát liên quan:", error);
        }
      };
      fetchRelated();
    }
  }, [track]);

  return (
    <div
      className="tab-pane fade show active"
      id="ecommerce-product-details-5-overview"
    >
      <div className="overview-content mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="content-section">
              <h4 className="mb-3">Mô tả sản phẩm</h4>

              <p
                dangerouslySetInnerHTML={{
                  __html:
                    track.description?.replace(/\n/g, "<br/>") ||
                    "Đang cập nhật mô tả...",
                }}
              />

              <p className="mt-3 bg-light p-3 rounded">
                <strong>Tâm trạng (Mood):</strong>{" "}
                {track.tags?.moods?.length
                  ? track.tags.moods.join(", ")
                  : "Đang cập nhật"}
                <br />
                <strong>Thể loại (Genre):</strong>{" "}
                {track.tags?.genres?.length
                  ? track.tags.genres.join(", ")
                  : "Đang cập nhật"}
              </p>

              {relatedTracks.length > 0 && (
                <>
                  <h4 className="mt-5 mb-4">Các sản phẩm cùng nghệ sĩ</h4>
                  <div
                    id="relatedMusicCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner pb-4">
                      {/* Slide 1: Tối đa 3 bài đầu */}
                      <div className="carousel-item active">
                        <div className="row g-3">
                          {relatedTracks.slice(0, 3).map((item) => (
                            <RelatedTrackCard key={item.id} track={item} formatPrice={formatPrice} />
                          ))}
                        </div>
                      </div>

                      {/* Slide 2: Nếu có hơn 3 bài thì mới hiển thị slide này */}
                      {relatedTracks.length > 3 && (
                        <div className="carousel-item">
                          <div className="row g-3">
                            {relatedTracks.slice(3, 6).map((item) => (
                              <RelatedTrackCard key={item.id} track={item} formatPrice={formatPrice} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chỉ hiện nút Next/Prev nếu có nhiều hơn 3 bài */}
                    {relatedTracks.length > 3 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#relatedMusicCarousel"
                          data-bs-slide="prev"
                          style={{ width: "5%", left: "-15px" }}
                        >
                          <span
                            className="carousel-control-prev-icon bg-dark rounded-circle p-2"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target="#relatedMusicCarousel"
                          data-bs-slide="next"
                          style={{ width: "5%", right: "-15px" }}
                        >
                          <span
                            className="carousel-control-next-icon bg-dark rounded-circle p-2"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <WhatWillYouReceive />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
