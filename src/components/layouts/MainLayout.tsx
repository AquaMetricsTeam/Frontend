import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/layouts/Navbar";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onBurgerClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-bg-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
