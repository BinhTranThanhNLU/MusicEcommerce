import { Outlet } from "react-router-dom";
import Header from "../components/HeaderAndFooter/Header";
import Footer from "../components/HeaderAndFooter/Footer";
import AudioPlayer from "../components/utils/AudioPlayer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
      <AudioPlayer />
    </>
  );
};

export default MainLayout;
