import { Outlet } from "react-router-dom";
import "../assets/css/artistDashboard.css";
import ArtistHeader from "../components/ArtistHeader/ArtistHeader";
import ArtistSidebar from "../components/ArtistHeader/ArtistSidebar";

const ArtistLayout = () => {
  return (
    <div className="artist-dashboard d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <ArtistSidebar />
      <div className="main-content flex-grow-1 d-flex flex-column bg-light min-vh-100">
        <ArtistHeader />
        <main className="p-0" style={{ overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ArtistLayout;
