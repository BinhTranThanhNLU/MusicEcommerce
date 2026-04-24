import { useParams } from "react-router-dom";
import PageTitle from "../../components/utils/PageTitle";
import InformationTab from "../../components/ProductDetailComponent/InformationTab";
import ProductDetail from "../../components/ProductDetailComponent/ProductDetail";
import ProductGallery from "../../components/ProductDetailComponent/ProductGallery";
import type { AudioTrackModel } from "../../models/AudioTrackModel";
import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/utils/ErrorMessage";
import { SpinningLoading } from "../../components/utils/SpinningLoading";
import { getAudioTrackById } from "../../apis/audioTrackApi";

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [track, setTrack] = useState<AudioTrackModel | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackDetail = async () => {
      // Bắt trường hợp không có ID trên URL
      if (!id) {
        setHttpError("Không tìm thấy mã sản phẩm.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getAudioTrackById(Number(id));
        setTrack(data);
      } catch (error: any) {
        console.error("Lỗi khi tải chi tiết bài hát:", error);
        // Cập nhật state httpError giống form của ông
        setHttpError(
          error.message || "Đã xảy ra lỗi khi tải chi tiết bài hát.",
        );
      } finally {
        // Cuối cùng kiểu gì cũng phải tắt loading
        setIsLoading(false);
      }
    };

    fetchTrackDetail();
  }, [id]);

  if (isLoading) return <SpinningLoading />;
  if (httpError) return <ErrorMessage message={httpError} />;

  if (!track) return <ErrorMessage message="Không tìm thấy bài hát này." />;

  return (
    <main className="main">
      <PageTitle title="Chi tiết sản phẩm" current="Chi tiết sản phẩm"/>

      <section id="product-details" className="product-details section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-4">
            <ProductGallery track={track} />
            <ProductDetail track={track} />
          </div>
          <InformationTab track={track}/>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
