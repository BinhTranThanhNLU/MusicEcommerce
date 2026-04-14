import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import ProductCard from "./ProductCard";
import { getTracksByGenre, getTracksByMood, getTracksByTheme } from "../../apis/audioTrackApi";

interface TrackListProps {
  categoryId: number;
  page: number;
  setTotalPages: (total: number) => void;
}

const ProductListSection: React.FC<TrackListProps> = ({
  categoryId,
  page,
  setTotalPages,
}) => {
  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        let data;

        if (location.pathname.includes("genre")) {
          data = await getTracksByGenre(categoryId, page);
        } else if (location.pathname.includes("mood")) {
          data = await getTracksByMood(categoryId, page);
        } else if (location.pathname.includes("theme")) {
          data = await getTracksByTheme(categoryId, page);
        }

        if (data) {
          setTracks(data.tracks);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Fetch tracks error:", error);
      }
    };

    fetchTracks();
  }, [categoryId, page, location.pathname]);

  return (
    <section
      id="category-product-list"
      className="category-product-list section"
    >
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4">
          {tracks.map((track) => (
            <div key={track.id} className="col-6 col-xl-4">
              <ProductCard track={track} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductListSection;
