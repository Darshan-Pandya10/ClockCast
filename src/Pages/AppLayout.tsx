import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function AppLayout() {
  return (
    <div className="page bg-white relative">
      <Header />
      <div className="content min-h-[80vh]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
