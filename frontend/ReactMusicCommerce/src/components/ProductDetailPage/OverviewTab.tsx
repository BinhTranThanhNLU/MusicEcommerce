import type React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { useEffect, useState } from "react";
import { getTracksByArtist } from "../../apis/audioTrackApi";
import WhatWillYouReceive from "./WhatWillYouReceive";

interface OverviewTabProps {
  track: AudioTrackModel;
}

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
                            <div className="col-md-4" key={item.id}>
                              <div className="product-card border rounded p-2 text-center h-100 shadow-sm">
                                <img
                                  src={
                                    item.coverImage ||
                                    "https://placehold.co/300x300"
                                  }
                                  className="img-fluid rounded mb-2 w-100"
                                  alt={item.title}
                                />
                                <div className="small text-muted mb-1">
                                  {item.audioType}
                                </div>
                                <h6
                                  className="text-truncate mb-2"
                                  title={item.title}
                                >
                                  {item.title}
                                </h6>
                                <div className="text-primary fw-bold">
                                  Từ {formatPrice(item.startingPrice)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slide 2: Nếu có hơn 3 bài thì mới hiển thị slide này */}
                      {relatedTracks.length > 3 && (
                        <div className="carousel-item">
                          <div className="row g-3">
                            {relatedTracks.slice(3, 6).map((item) => (
                              <div className="col-md-4" key={item.id}>
                                <div className="product-card border rounded p-2 text-center h-100 shadow-sm">
                                  <img
                                    src={
                                      item.coverImage ||
                                      "https://placehold.co/300x300"
                                    }
                                    className="img-fluid rounded mb-2 w-100"
                                    alt={item.title}
                                  />
                                  <div className="small text-muted mb-1">
                                    {item.audioType}
                                  </div>
                                  <h6
                                    className="text-truncate mb-2"
                                    title={item.title}
                                  >
                                    {item.title}
                                  </h6>
                                  <div className="text-primary fw-bold">
                                    Từ {formatPrice(item.startingPrice)}
                                  </div>
                                </div>
                              </div>
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
