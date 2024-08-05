import React, { FC } from "react";
import Sidebar from "../components/sidebar"
import { PageEnum } from "../components/sidebar/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage: PageEnum
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, title, currentPage }) => {
  return (
    <section className="flex flex-row w-full h-full gap-8">
      <Sidebar selectedPage={currentPage}/>
			<section className="flex flex-col w-full">
        <div className="w-full pt-8 text-4xl font-semibold"> {title} </div>
        <div className="w-full h-full">
          {children}
        </div>
			</section>
    </section>
  )
}

export default DashboardLayout;