import { useEffect, useState } from "react";
import CategorySellerSection from "../components/HomePage/CategorySellerSection";
import HeroSection from "../components/HomePage/HeroSection";
import PromoCardSection from "../components/HomePage/PromoCardSection";
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

  return (
    <main className="main">
      <HeroSection />
      <PromoCardSection />
      <CategorySellerSection tracks={tracks}/>
    </main>
  );
};

export default HomePage;
