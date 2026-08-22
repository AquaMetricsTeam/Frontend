import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/layouts/Navbar";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i18n } = useTranslation();
  return (
    <div
      className="flex h-screen overflow-hidden bg-bg-base "
      key={i18n.language}
    >
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
