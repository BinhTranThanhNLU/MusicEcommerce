import React from "react";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import ProductCard from "./ProductCard";

const CategorySellerSection:React.FC<{tracks: AudioTrackModel[]}> = ({tracks}) => {

  return (
    <section id="best-sellers" className="best-sellers section">
      {/* Section title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Top Thịnh Hành & Bán Chạy</h2>
        <p>
          Những bản phối, ca khúc và album được mua bản quyền nhiều nhất tuần qua.
          <br />
          Phù hợp cho cả nhu cầu nghe cá nhân và thương mại.
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-5">
          {tracks.slice(0,8).map((track) => (
            <ProductCard key={track.id} track={track}/>
          ))

          }
        </div>

        <div className="text-center mt-4">
          <a href="#more-info" className="btn btn-dark btn-lg">
            Xem thêm
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategorySellerSection;
