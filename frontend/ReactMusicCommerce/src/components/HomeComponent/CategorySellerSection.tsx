import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import ProductCard from "./ProductCard";

type CategorySellerSectionProps = {
  tracks: AudioTrackModel[];
  title?: string;
  description?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  sectionId?: string;
  limit?: number;
  dataAosDelay?: string;
};

const CategorySellerSection: React.FC<CategorySellerSectionProps> = ({
  tracks,
  title = "Top Thịnh Hành & Bán Chạy",
  description = (
    <>
      Những bản phối, ca khúc và album được mua bản quyền nhiều nhất tuần qua.
      <br />
      Phù hợp cho cả nhu cầu nghe cá nhân và thương mại.
    </>
  ),
  ctaLabel = "Xem thêm",
  ctaHref = "#more-info",
  sectionId = "best-sellers",
  limit = 8,
  dataAosDelay = "100",
}) => {

  return (
    <section id={sectionId} className="best-sellers section">
      {/* Section title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay={dataAosDelay}>
        <div className="row g-5">
          {tracks.slice(0, limit).map((track) => (
            <ProductCard key={track.id} track={track} />
          ))}
        </div>

        <div className="text-center mt-4">
          <a href={ctaHref} className="btn btn-dark btn-lg">
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategorySellerSection;
