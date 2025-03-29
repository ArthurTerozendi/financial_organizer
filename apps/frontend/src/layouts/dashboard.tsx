import React, { FC, useState } from "react";
import Sidebar from "../components/sidebar";
import { PageEnum } from "../components/sidebar/types";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage: PageEnum;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  title,
  currentPage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="flex flex-col md:flex-row w-full h-full bg-dark-gray">
      <div className="md:hidden p-4">
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white"
        >
          <MenuIcon />
        </IconButton>
      </div>
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar selectedPage={currentPage} />
      </div>
      <section className="flex flex-col w-full p-4 overflow-auto">
        <div className="w-full pt-4 md:pt-8 text-2xl md:text-4xl font-semibold">
          {title}
        </div>
        <div className="w-full h-full">{children}</div>
      </section>
    </section>
  );
};

export default DashboardLayout;
