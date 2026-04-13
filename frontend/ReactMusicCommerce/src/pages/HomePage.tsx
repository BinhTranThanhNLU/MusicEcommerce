import CategorySellerSection from "../components/HomePage/CategorySellerSection";
import HeroSection from "../components/HomePage/HeroSection";
import PromoCardSection from "../components/HomePage/PromoCardSection";

const HomePage = () => {
  return (
    <main className="main">
      <HeroSection />
      <PromoCardSection />
      <CategorySellerSection />
    </main>
  );
};

export default HomePage;
