import { Outlet } from "react-router-dom";

import Sidebar from "./components/sidebar";

export default function Layout() {
  return (
    <div className="dark flex flex-col w-screen h-screen">
      {/* Main Content (Sidebar and Page) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
