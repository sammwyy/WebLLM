import { Outlet } from "react-router-dom";

import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import useMobile from "./hooks/use-mobile";

export default function Layout() {
  const isMobile = useMobile();
  const isDesktop = !isMobile;

  return (
    <div className="dark flex flex-col w-screen h-screen">
      {/* Main Content (Sidebar and Page) */}
      <div className={`${isMobile && "flex-col"} flex h-full`}>
        {/* Desktop: Sidebar */}
        {isDesktop && <Sidebar />}

        {/* Mobile: Navbar */}
        {isMobile && (
          <Navbar onCreateClick={() => {}} onModelClick={() => {}} />
        )}

        {/* Page */}
        <div className="flex-1 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
