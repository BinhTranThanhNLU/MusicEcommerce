import { useEffect, useState } from "react";
import CategorySellerSection from "../components/HomeComponent/CategorySellerSection";
import HeroSection from "../components/HomeComponent/HeroSection";
import PromoCardSection from "../components/HomeComponent/PromoCardSection";
import type { AudioTrackModel } from "../models/AudioTrackModel";
import { ErrorMessage } from "../components/utils/ErrorMessage";
import { SpinningLoading } from "../components/utils/SpinningLoading";
import { getAllAudioTracks } from "../apis/audioTrackApi";

const HomePage = () => {

  const [tracks, setTracks] = useState<AudioTrackModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioTracks = async () => {
      try {
        const data = await getAllAudioTracks();
        setTracks(data);
      } catch (error: any) {
        setHttpError(error.message || "Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioTracks();
  },[]);

  if (isLoading) return <SpinningLoading />;
  if (httpError) return <ErrorMessage message={httpError} />;

  const sellerSectionConfigs = [
    {
      sectionId: "best-sellers",
      title: "Top Thịnh Hành & Bán Chạy",
      description: (
        <>
          Những bản phối, ca khúc và album được mua bản quyền nhiều nhất tuần qua.
          <br />
          Phù hợp cho cả nhu cầu nghe cá nhân và thương mại.
        </>
      ),
      ctaLabel: "Xem thêm",
      ctaHref: "#categories-highlight",
      dataAosDelay: "100",
    },
    {
      sectionId: "home-featured-collections",
      title: "Tuyển Chọn Đáng Nghe",
      description: (
        <>
          Những track đang được đội ngũ biên tập gợi ý nhiều nhất cho trang chủ.
          <br />
          Tập trung vào màu sắc âm thanh dễ nghe và giàu cảm hứng.
        </>
      ),
      ctaLabel: "Khám phá bộ sưu tập",
      ctaHref: "#home-trending",
      dataAosDelay: "150",
    },
    {
      sectionId: "home-editor-picks",
      title: "Editor's Picks",
      description: (
        <>
          Danh sách track nổi bật để người dùng lướt nhanh và tìm cảm hứng ngay từ đầu.
          <br />
          Giữ trải nghiệm trang chủ sinh động hơn thay vì chỉ có một khối nội dung.
        </>
      ),
      ctaLabel: "Xem lựa chọn khác",
      ctaHref: "#home-new-releases",
      dataAosDelay: "200",
    },
    {
      sectionId: "home-new-releases",
      title: "Mới Đăng Tải Gần Đây",
      description: (
        <>
          Nội dung mới giúp trang chủ có thêm nhịp cập nhật, tạo cảm giác luôn có điều mới.
          <br />
          Vẫn dùng chung tập dữ liệu seller section để giữ triển khai gọn nhẹ.
        </>
      ),
      ctaLabel: "Xem thêm track mới",
      ctaHref: "#best-sellers",
      dataAosDelay: "250",
    },
  ];

  return (
    <main className="main">
      <HeroSection />
      <PromoCardSection />
      <div id="categories-highlight">
        {sellerSectionConfigs.map((section) => (
          <CategorySellerSection
            key={section.sectionId}
            tracks={tracks}
            title={section.title}
            description={section.description}
            ctaLabel={section.ctaLabel}
            ctaHref={section.ctaHref}
            sectionId={section.sectionId}
            limit={8}
            dataAosDelay={section.dataAosDelay}
          />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
